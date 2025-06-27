import styled from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from '../Dashboard';

export interface FileItem {
    type: "file";
    name: string;
    path: string;
}

export interface FolderItem {
    type: "folder";
    name: string;
    path: string;
    children: ContentItem[];
}

export type ContentItem = FileItem | FolderItem;

export interface Course {
    id: string;
    course_name: string;
    content: ContentItem[];
}

export const Container = styled.div`
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

export const SelectionBar = styled.div`
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

export const DetailBar = styled.div`
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

export const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #000;
`;

export const Button = styled.button`
    background-color: #ffffff;
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
        background-color: #dedcdc;
        border: 1px solid #2e2e2e;
    }
`;

export const BackButton = styled(Button)`
    background-color: #007bff;
    border: none;
    color: #ffffff;
    font-weight: 700;
    margin-bottom: 15px;

    &:hover {
        background-color: #1976d2;
        border: none;
    }
`;

export const NextButton = styled(BackButton)`
    position: absolute;
    right: 0;
`;

export const ChapterButton = styled(Button)`
    border: 1px solid #ddd;
    text-align: left;
    width: 99%;
    margin: 0;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    justify-content: space-between;

    &:hover {
        background-color: #dedcdc;
        border: 1px solid #ddd;
    }

    &.active {
        background-color: #dedcdc;
        border: 1px solid #939393;
    }
`;

export const SectionButton = styled(ChapterButton)`
    width: 95%;
`;

export const SectionContainer = styled.div<{ isOpen: boolean }>`
    max-height: ${props => props.isOpen ? '1000px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease;
`;

export const DashboardWrapper = styled.div`
    display: flex, 
    align-items: center, 
    gap: 16px, 
    padding-left: 16px, 
    margin-bottom: 12px
`;

export const DashboardTitle = styled.h2`
    font-weight: 700;
    width: 100%;
    display: flex;
    justify-content: center;
`;

export const DashboardButton = styled(BackButton)`
    position: fixed;
    top: 8px;
    left: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    width: 150px;
`;

export const VerticalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 16px;
`;

export const VerticalGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const Iframe = styled.iframe`
    width: 100%;
    height: 80vh;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
`;

export const PracticeButton = styled(Button)`
    background-color: #007bff;
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

export const PracticeButtonsContainer = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
`;

export const ChapterContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
