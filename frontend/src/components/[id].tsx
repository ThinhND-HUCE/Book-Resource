import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const CourseDetail: React.FC = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [htmlFiles, setHtmlFiles] = useState<FileItem[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);

    const extractNumber = (filename: string) => {
        const match = filename.match(/Proskuryakov_(\d+)\.html/);
        return match ? match[1] : filename;
    };

    const filterContent = (content: ContentItem[]): ContentItem[] => {
        return content.map(item => {
            if (item.type === "folder") {
                return {
                    ...item,
                    children: filterContent(item.children)
                };
            }
            return item;
        });
    };

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/courses/${id}`)
                .then(response => response.json())
                .then((data: Course) => {
                    const filteredContent = filterContent(data.content);
                    setCourse({
                        ...data,
                        content: filteredContent
                    });
                })
                .catch(error => console.error("Lỗi khi lấy thông tin khóa học:", error));
        }
    }, [id]);

    const toggleFolder = (path: string) => {
        setExpandedFolders(prev => ({
            ...prev,
            [path]: !prev[path]
        }));
    };

    const fetchHtmlContent = async (filePath: string, files: FileItem[], index: number) => {
        try {
            const response = await fetch(`http://localhost:5000/file?path=${encodeURIComponent(filePath)}`);
            const text = await response.text();
            const bodyContent = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || text;

            setHtmlFiles(files);
            setCurrentFileIndex(index);
            setHtmlContent(bodyContent.trim());
        } catch (error) {
            console.error("Error fetching HTML content:", error);
        }
    };

    const renderFolderContent = (folder: FolderItem) => {
        const filesOnly = folder.children.filter(c => c.type === 'file') as FileItem[];

        return (
            <div>
                {filesOnly.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            fetchHtmlContent(item.path, filesOnly, index);
                        }}
                    >
                        {extractNumber(item.name)}
                    </button>
                ))}
            </div>
        );
    };

    const renderChapterContent = (chapter: FolderItem) => {
        return (
            <div>
                <button
                    onClick={() => {
                        setSelectedChapter(chapter.name);
                        setSelectedSection(null);
                    }}
                >
                    {chapter.name}
                </button>
                {selectedChapter === chapter.name && chapter.children.map((section) => (
                    <div key={section.path}>
                        <button onClick={() => setSelectedSection(section.name)}>
                            {section.name}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const renderSectionContent = () => {
        if (htmlContent) {
            const htmlTemplate = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
                    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
                    <style>
                        body {
                            font-family: system-ui;
                            padding: 20px;
                            font-size: 16px;
                            line-height: 1.5;
                        }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
                </html>
            `;

            const goNext = () => {
                if (currentFileIndex !== null && currentFileIndex < htmlFiles.length - 1) {
                    const nextIndex = currentFileIndex + 1;
                    fetchHtmlContent(htmlFiles[nextIndex].path, htmlFiles, nextIndex);
                } else {
                    setHtmlContent(null);
                    setCurrentFileIndex(null);
                }
            };

            return (
                <div>
                    <button onClick={() => setHtmlContent(null)}>← Quay lại</button>
                    <button onClick={goNext}>Tiếp →</button>
                    <iframe
                        srcDoc={htmlTemplate}
                        title="HTML Content"
                        style={{ width: '100%', height: '80vh', border: '1px solid #ccc' }}
                    />
                </div>
            );
        }

        if (!selectedSection || !course) return null;

        const findSection = (items: ContentItem[]): FolderItem | null => {
            for (const item of items) {
                if (item.type === "folder" && item.name === selectedSection) {
                    return item;
                }
                if (item.type === "folder") {
                    const found = findSection(item.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const chapter = course.content.find(item => item.type === "folder" && item.name === selectedChapter) as FolderItem | undefined;
        if (!chapter) return null;

        const section = chapter.type === "folder" ? findSection(chapter.children) : null;
        if (!section) return <span>Không tìm thấy section</span>;

        return (
            <>
                <h2>Nội dung {section.name}</h2>
                {renderFolderContent(section)}
            </>
        );
    };

    if (!course) {
        return <span>Đang tải dữ liệu...</span>;
    }

    const chapters = course.content.filter(item => item.type === "folder");

    return (
        <div>
            <div>
                {chapters.map(chapter => renderChapterContent(chapter))}
            </div>

            <div>
                {selectedSection ? (
                    renderSectionContent()
                ) : (
                    <span>Chọn một section để xem nội dung</span>
                )}
            </div>
        </div>
    );
};

export default CourseDetail;
