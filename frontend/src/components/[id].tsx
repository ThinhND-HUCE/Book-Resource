import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

// Thêm type declaration cho MathJax
declare global {
    interface Window {
        MathJax: {
            typeset: () => void;
            startup: {
                promise: Promise<void>;
            };
        };
    }
}

interface FileItem {
    type: "file";
    name: string;
    path: string;
}

interface FolderItem {
    type: "folder";
    name: string;
    path: string;
    children: ContentItem[];
}

type ContentItem = FileItem | FolderItem;

interface Course {
    id: string;
    course_name: string;
    content: ContentItem[];
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 25% 70%;
    gap: 24px;
    height: 80vh;
    width: 100vw;
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    box-sizing: border-box;
`;

const Sidebar = styled.div`
    background-color: #f5f5f5;
    padding: 16px;
    border-radius: 8px;
    height: 91vh;
    overflow-x: auto;
`;

const Button = styled.button`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    font-size: 16px;
    text-align: left;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        background-color: #2196f3;
    }

    &.active {
        background-color: #1976d2;
        border-color: #a4c8f0;
    }
`;

const HtmlViewer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Iframe = styled.iframe`
    width: 100%;
    height: 80vh;
    border: 1px solid #ccc;
    border-radius: 8px;
`;

const HorizontalWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 16px;
`;

const VerticalGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const CourseDetail: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [htmlFiles, setHtmlFiles] = useState<FileItem[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);

    useEffect(() => {
        if (courseId) {
            fetch(`http://localhost:8000/api/courses/${courseId}`)
                .then(res => res.json())
                .then((data: Course) => setCourse(data))
                .catch(err => console.error("Lỗi lấy dữ liệu khóa học:", err));
        }
    }, [courseId]);

    const extractNumber = (filename: string) => {
        const match = filename.match(/Proskuryakov_(\d+)\.html/);
        return match ? match[1] : filename;
    };

    const fetchHtmlContent = async (filePath: string, files: FileItem[], index: number) => {
        try {
            const response = await fetch(`http://localhost:8000/api/files/view?path=${encodeURIComponent(filePath)}`);
            const text = await response.text();
            const body = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || text;

            setHtmlContent(body.trim());
            setHtmlFiles(files);
            setCurrentFileIndex(index);
        } catch (error) {
            console.error("Lỗi khi tải HTML:", error);
        }
    };

    const renderHtmlViewer = () => {
        const goNext = () => {
            if (currentFileIndex !== null && currentFileIndex < htmlFiles.length - 1) {
                fetchHtmlContent(htmlFiles[currentFileIndex + 1].path, htmlFiles, currentFileIndex + 1);
            } else {
                setHtmlContent(null);
                setCurrentFileIndex(null);
            }
        };

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
                <style>
                    body { font-family: system-ui; padding: 20px; font-size: 16px; }
                </style>
            </head>
            <body>
                ${htmlContent}
            </body>
            </html>
        `;

        return (
            <HtmlViewer>
                <Button onClick={() => setHtmlContent(null)}>← Quay lại</Button>
                <Button onClick={goNext}>Tiếp →</Button>
                <Iframe
                    srcDoc={html}  // Hiển thị nội dung HTML mà không bị escape
                    title="Course Content"
                    onLoad={async () => {
                        try {
                            await window.MathJax?.startup?.promise;  // Đảm bảo MathJax khởi tạo
                            window.MathJax?.typeset();  // Render LaTeX
                        } catch (error) {
                            console.error("Lỗi khi render LaTeX:", error);
                        }
                    }}
                />
            </HtmlViewer>
        );
    };

    const renderSectionButtons = (folder: FolderItem) => {
        const filesOnly = folder.children.filter(c => c.type === "file") as FileItem[];

        return filesOnly.map((item, index) => (
            <Button key={item.path} onClick={() => fetchHtmlContent(item.path, filesOnly, index)}>
                {extractNumber(item.name)}
            </Button>
        ));
    };

    const renderChapters = () => {
        return (
            <HorizontalWrapper>
                {course?.content
                    .filter(item => item.type === "folder")
                    .map(chapter => {
                        const folder = chapter as FolderItem;

                        return (
                            <VerticalGroup key={folder.path}>
                                <Button
                                    className={selectedChapter === folder.name ? "active" : ""}
                                    onClick={() => {
                                        setSelectedChapter(folder.name);
                                        setSelectedSection(null);
                                    }}
                                >
                                    {folder.name}
                                </Button>
                                {selectedChapter === folder.name &&
                                    folder.children.map(section =>
                                        section.type === "folder" ? (
                                            <Button
                                                key={section.path}
                                                style={{ marginLeft: "8px" }}
                                                className={selectedSection === section.name ? "active" : ""}
                                                onClick={() => setSelectedSection(section.name)}
                                            >
                                                {section.name}
                                            </Button>
                                        ) : null
                                    )}
                            </VerticalGroup>
                        );
                    })}
            </HorizontalWrapper>
        );
    };

    const renderSectionContent = () => {
        if (!course || !selectedChapter || !selectedSection) return null;

        const findSection = (items: ContentItem[]): FolderItem | null => {
            for (const item of items) {
                if (item.type === "folder" && item.name === selectedSection) return item;
                if (item.type === "folder") {
                    const found = findSection(item.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const chapter = course.content.find(
            item => item.type === "folder" && item.name === selectedChapter
        ) as FolderItem | undefined;

        const section = chapter ? findSection(chapter.children) : null;
        if (!section) return <span>Không tìm thấy section</span>;

        return (
            <>
                <h2>Nội dung: {section.name}</h2>
                {renderSectionButtons(section)}
            </>
        );
    };

    if (!course) return <span>Đang tải dữ liệu...</span>;

    return (
        <Container>
            <Sidebar>{renderChapters()}</Sidebar>
            <div>{htmlContent ? renderHtmlViewer() : renderSectionContent()}</div>
        </Container>
    );
};

export default CourseDetail;
