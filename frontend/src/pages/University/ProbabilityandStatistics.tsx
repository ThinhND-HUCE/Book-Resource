import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BackButton, NextButton, Course, FileItem, Iframe, FolderItem, ContentItem, Button, VerticalWrapper, VerticalGroup, ChapterContainer, ChapterButton, SectionContainer, SectionButton, PracticeButton, Title, PracticeButtonsContainer, DashboardButton, Container, SelectionBar, DetailBar, DashboardTitle, DashboardWrapper } from "./CourseInterfaceCSS";
import { API_URL } from "../../constants/apiConfig";
import { getExerciseLoadersWithDescription } from '../../constants/demFileTrongComponent';
import { JSX } from "react";

const ProbabilityandStatistics: React.FC = () => {
    const [course, setCourse] = useState<Course | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [htmlFiles, setHtmlFiles] = useState<FileItem[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
    const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());
    const [, setOpenSections] = useState<Set<string>>(new Set());
    const [exerciseList, setExerciseList] = useState<{ label: string, componentLoader: () => Promise<any> }[]>([]);
    const [exerciseComponent, setExerciseComponent] = useState<JSX.Element | null>(null);
    //1. Điều kiện hiển thị cái Exercise
    const [showExercise, setShowExercise] = useState(false);
    const navigate = useNavigate();

    // Lấy gradeId từ localStorage (được lưu khi chọn course)
    const gradeId = localStorage.getItem("last_grade_id");

    const formatName = (name: string) => {
        // Xóa các từ "section", "chapter" và dấu hai chấm ở đầu
        return name.replace(/^(section|chapter)\s*/i, '').replace(/^:\s*/, '');
    };

    //Hàm đóng mở chapter
    const toggleChapter = (chapterName: string) => {
        setOpenChapters(prev => {
            const newSet = new Set<string>();
            if (!prev.has(chapterName)) {
                newSet.add(chapterName);
            }
            return newSet;
        });
    };

    //Hàm đóng mở section
    const toggleSection = (sectionName: string) => {
        setOpenSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionName)) {
                newSet.delete(sectionName);
            } else {
                newSet.add(sectionName);
            }
            return newSet;
        });
    };

    //Lấy dữ liệu từ API: Đổi theo tên course tương ứng
    useEffect(() => {
        fetch(`${API_URL}/api/grades/University/courses/Probability_and_Statistics/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then((data: Course) => setCourse(data))
            .catch(err => console.error("Lỗi lấy dữ liệu khóa học:", err));
    }, []);

    useEffect(() => {
        if (!course || !selectedChapter || !selectedSection) return;

        const findSectionFolder = (items: ContentItem[]): FolderItem | null => {
            for (const item of items) {
                if (item.type === "folder" && item.name === selectedSection) return item;
                if (item.type === "folder") {
                    const found = findSectionFolder(item.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const chapter = course.content.find(
            item => item.type === "folder" && item.name === selectedChapter
        ) as FolderItem | undefined;

        const section = chapter ? findSectionFolder(chapter.children) : null;

        if (section) {
            console.log("Path", section.path)
            getExerciseLoadersWithDescription(section.path).then(setExerciseList);
        }
    }, [course, selectedChapter, selectedSection]);


    //Chỉ lấy số từ các file
    const extractNumber = (filename: string) => {
        const match = filename.match(/(?:\s|^)(\d+(?:\.\d+)*)(?!.*\d)/);
        return match ? match[1] : filename;
    };

    //Hàm đọc nội dung file theo từng file 1
    const fetchHtmlContent = async (filePath: string, files: FileItem[], index: number) => {
        try {
            const response = await fetch(`${API_URL}/api/files/view/?path=${encodeURIComponent(filePath)}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            });

            const text = await response.text();
            const body = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || text;
            console.log("File path:", filePath)
            // 👉 Xử lý ảnh: ảnh nằm cùng thư mục với filePath
            const normalizedPath = filePath.replace(/\\/g, "/"); // 👉 đổi \ thành /

            const folderPath = normalizedPath.substring(0, normalizedPath.lastIndexOf("/"));
            console.log("Folder path:", folderPath)

            const adjustedBody = body.replace(/<img\s+[^>]*src=["']([^"']+)["']/gi, (match, src) => {
                // Nếu src có khoảng trắng, có thể là do backend đổi tên hiển thị → ta đảo lại thành dấu "_"
                const normalizedSrc = src.replace(/ /g, "_");

                // Nếu ảnh là đường dẫn tương đối thì xử lý
                if (!normalizedSrc.startsWith("http") && !normalizedSrc.startsWith("/")) {
                    const fullPath = `${folderPath}/${normalizedSrc}`;
                    const encoded = encodeURIComponent(fullPath);
                    return match.replace(src, `${API_URL}/api/files/view/?path=${encoded}`);
                }

                return match;
            });

            setHtmlContent(adjustedBody.trim());
            setHtmlFiles(files);
            setCurrentFileIndex(index);
        } catch (error) {
            console.error("Lỗi khi tải HTML:", error);
        }
    };

    //Hàm render Latex từ file html và nút tiếp, quay lại
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
            <div style={{ position: "relative" }}>
                <BackButton onClick={() => setHtmlContent(null)}>← Quay lại</BackButton>
                <NextButton onClick={goNext}>Tiếp →</NextButton>
                <Iframe
                    srcDoc={html}  // Hiển thị nội dung HTML mà không bị escape
                    title="Course Content"
                />
            </div>
        );
    };

    //Hàm render các chapter
    const renderChapters = () => {
        return (
            <VerticalWrapper>
                {course?.content
                    .filter(item => item.type === "folder")
                    .map(chapter => {
                        const folder = chapter as FolderItem;
                        const isChapterOpen = openChapters.has(folder.name);

                        return (
                            <VerticalGroup key={folder.path}>
                                <ChapterContainer>
                                    <ChapterButton
                                        className={selectedChapter === folder.name ? "active" : ""}
                                        onClick={() => {
                                            setSelectedChapter(folder.name);
                                            setSelectedSection(null);
                                            toggleChapter(folder.name);
                                        }}
                                    >
                                        <span>{formatName(folder.name)}</span>
                                    </ChapterButton>
                                </ChapterContainer>
                                <SectionContainer isOpen={isChapterOpen}>
                                    {folder.children.map(section =>
                                        section.type === "folder" ? (
                                            <ChapterContainer key={section.path}>
                                                <SectionButton
                                                    style={{ margin: "8px 8px 0 8px" }}
                                                    className={selectedSection === section.name ? "active" : ""}
                                                    onClick={() => {
                                                        setSelectedSection(section.name);
                                                        toggleSection(section.name);
                                                        setHtmlContent(null);
                                                    }}
                                                >
                                                    <span>{formatName(section.name)}</span>
                                                </SectionButton>
                                            </ChapterContainer>
                                        ) : null
                                    )}
                                </SectionContainer>
                            </VerticalGroup>
                        );
                    })}
                <PracticeButton
                    style={{ margin: "20px 0", backgroundColor: "#62aeff" }}
                    onClick={() => console.log("Luyện tập tất cả chapter")}
                >
                    Bài tập tổng hợp
                </PracticeButton>
            </VerticalWrapper>
        );
    };

    //Hàm hiển thị file dưới dạng lưới
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

        // Nếu đang hiển thị 1 bài luyện tập cụ thể (component JSX)
        if (showExercise && exerciseComponent) {
            return exerciseComponent;
        }

        // Nếu đang hiển thị giao diện nội dung section (bình thường)
        const filesOnly = section.children.filter(c => c.type === "file") as FileItem[];

        return (
            <>
                <Title>{formatName(section.name)}</Title>

                {/* Nút bấm để hiển thị các file HTML */}
                {filesOnly.map((item, index) => (
                    <Button
                        key={item.path}
                        onClick={() => {
                            setHtmlContent(null);
                            fetchHtmlContent(item.path, filesOnly, index);
                        }}
                    >
                        {extractNumber(item.name)}
                    </Button>
                ))}

                {/* Các nút luyện tập được generate động từ các file tsx */}
                {exerciseList.length > 0 && (
                    <PracticeButtonsContainer>
                        {exerciseList.map((ex, index) => (
                            <PracticeButton
                                key={index}
                                style={{ width: '220px' }}
                                onClick={async () => {
                                    const Comp = await ex.componentLoader();
                                    toast.success(`Bắt đầu luyện tập: ${ex.label}`, { autoClose: 2000 });
                                    setShowExercise(true);
                                    setExerciseComponent(<Comp onBack={() => {
                                        setShowExercise(false);
                                        setExerciseComponent(null);
                                    }} />);
                                }}
                            >
                                {ex.label}
                            </PracticeButton>
                        ))}
                    </PracticeButtonsContainer>
                )}
            </>
        );
    };

    if (!course) return <span>Đang tải dữ liệu...</span>;

    return (
        <>
            <DashboardWrapper>
                <DashboardButton onClick={() => navigate(gradeId ? `/courses/${gradeId}` : '/Dashboard')}>
                    ← Khóa học
                </DashboardButton>
                <DashboardTitle>
                    {course?.course_name}
                </DashboardTitle>
            </DashboardWrapper>
            <Container>
                <SelectionBar>{renderChapters()}</SelectionBar>
                <DetailBar>{htmlContent ? renderHtmlViewer() : renderSectionContent()}</DetailBar>
            </Container>
        </>
    );
};

export default ProbabilityandStatistics;
