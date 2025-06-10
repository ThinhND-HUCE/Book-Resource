import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Exercise from '../components/Exercise';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
    grid-template-columns: 25.5% 70%;
    gap: 24px;
    height: 80vh;
    width: 100vw;
    position: fixed;
    top: 70px; // Modified from 20px to 70px to make room for the dashboard button
    left: 20px;
    right: 20px;
    bottom: 20px;
    box-sizing: border-box;
`;

const SelectionBar = styled.div`
    background-color: #f8f8f8;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    border-radius: 8px;
    height: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #ffffff;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #cccccc;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #999999;
    }
`;

const DetailBar = styled.div`
    background-color: #f8f8f8;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    border-radius: 8px;
    height: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #ffffff;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #cccccc;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #999999;
    }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: rgba(0, 0, 0);
`;

const Button = styled.button`
    border: 1px solid #000000;
    border-radius: 8px;
    padding: 10px;
    font-size: 16px;
    width: 105px;
    margin: 8px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
    
    &:hover {
        background-color: #c5c5c5;
        border: 1px solid #2e2e2e;
    }
`;

const BackButton = styled(Button)`
    background-color: #2196f3;
    border: none;
    color: #ffffff;
    font-weight: 700;
    margin-bottom: 15px;

    &:hover {
        background-color: #1976d2;
        border: none;
    }
`;

const NextButton = styled(BackButton)`
    position: absolute;
    right: 0;
`;

const ChapterButton = styled(Button)`
    border: 1px solid #ddd;
    text-align: left;
    width: 333px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        background-color: #2196f3;
        border: 1px solid #ddd;
    }

    &.active {
        background-color: #2196f3;
        border-color: #a4c8f0;
    }
`;

const SectionButton = styled(ChapterButton)`
    width: 325px;
`;

const SectionContainer = styled.div<{ isOpen: boolean }>`
    max-height: ${props => props.isOpen ? '1000px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease;
`;

const DashboardButton = styled(BackButton)`
    position: fixed;
    top: 8px;
    left: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    width: 150px;
`;

const VerticalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 16px;
`;

const VerticalGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Iframe = styled.iframe`
    width: 100%;
    height: 80vh;
    border: 1px solid #ccc;
    border-radius: 8px;
`;

const PracticeButton = styled(Button)`
    background-color: #2196f3;
    color: white;
    border: none;
    margin: 8px 0;
    width: 100%;
    min-width: 100px;

    &:hover {
        background-color: #1976d2;
        border: none;
    }
`;

const PracticeButtonsContainer = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
`;

const ChapterContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const ProbabilityandStatistics: React.FC = () => {
    const [course, setCourse] = useState<Course | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [htmlFiles, setHtmlFiles] = useState<FileItem[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
    const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());
    const [showExercise, setShowExercise] = useState(false);
    const navigate = useNavigate();

    const formatName = (name: string) => {
        // Xóa các từ "section", "chapter" và dấu hai chấm ở đầu
        return name.replace(/^(section|chapter)\s*/i, '').replace(/^:\s*/, '');
    };

    const toggleChapter = (chapterName: string) => {
        setOpenChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterName)) {
                newSet.delete(chapterName);
            } else {
                newSet.add(chapterName);
            }
            return newSet;
        });
    };

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

    useEffect(() => {
        fetch(`http://localhost:8000/api/courses/Probability_and_Statistics`)
            .then(res => res.json())
            .then((data: Course) => setCourse(data))
            .catch(err => console.error("Lỗi lấy dữ liệu khóa học:", err));
    }, []);

    const extractNumber = (filename: string) => {
        const match = filename.match(/Proskuryakov (\d+)\.html/);
        return match ? match[1] : filename;
    };

    const showExerciseContent = async (type: number) => {
        setShowExercise(true);
        toast.success(`Bắt đầu luyện tập dạng ${type}!`, {
            autoClose: 2000,
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

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

    const renderSectionButtons = (folder: FolderItem) => {
        const filesOnly = folder.children.filter(c => c.type === "file") as FileItem[];

        return filesOnly.map((item, index) => (
            <Button 
                key={item.path} 
                onClick={() => {
                    setHtmlContent(null); // Clear current content
                    fetchHtmlContent(item.path, filesOnly, index);
                }}
            >
                {extractNumber(item.name)}
            </Button>
        ));
    };

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
                    style={{ margin: "20px 0" }}
                    onClick={() => console.log("Luyện tập tất cả chapter")}
                >
                    Luyện tập tất cả chapter
                </PracticeButton>
            </VerticalWrapper>
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

        if (showExercise) {
            return <Exercise onBack={() => setShowExercise(false)} />;
        }

        return (
            <>
                <Title>{formatName(section.name)}</Title>
                {renderSectionButtons(section)}
                <PracticeButtonsContainer>
                    <PracticeButton 
                        style={{ width: '200px' }}
                        onClick={() => showExerciseContent(1)}
                    >
                        Luyện tập dạng 1
                    </PracticeButton>
                    <PracticeButton 
                        style={{ width: '200px' }}
                        onClick={() => showExerciseContent(2)}
                    >
                        Luyện tập dạng 2
                    </PracticeButton>
                    <PracticeButton 
                        style={{ width: '200px' }}
                        onClick={() => showExerciseContent(3)}
                    >
                        Luyện tập dạng 3
                    </PracticeButton>
                </PracticeButtonsContainer>
            </>
        );
    };

    if (!course) return <span>Đang tải dữ liệu...</span>;

    return (
        <>
            <DashboardButton onClick={() => navigate('/Dashboard')}>
                ← Khóa học
            </DashboardButton>
            <Container>
                <SelectionBar>{renderChapters()}</SelectionBar>
                <DetailBar>{htmlContent ? renderHtmlViewer() : renderSectionContent()}</DetailBar>
            </Container>
        </>
    );
};

export default ProbabilityandStatistics;
