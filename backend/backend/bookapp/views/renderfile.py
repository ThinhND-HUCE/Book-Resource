from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
import os
import json

COURSES_DIR = "C:/Users/crist/OneDrive/Desktop/Book-Resource/Resource"

def get_course_info(course_path):
    info_path = os.path.join(course_path, "info.json")
    if os.path.exists(info_path):
        try:
            with open(info_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Lỗi khi đọc {info_path}:", e)
    return None

def read_folder_structure(dir_path):
    results = []
    try:
        for entry in os.listdir(dir_path):
            full_path = os.path.join(dir_path, entry)
            if os.path.isdir(full_path):
                if "review" in entry.lower():
                    continue
                children = read_folder_structure(full_path)
                results.append({
                    "type": "folder",
                    "name": entry,
                    "path": full_path,
                    "children": children
                })
            elif entry.lower().endswith(".html"):
                results.append({
                    "type": "file",
                    "name": entry,
                    "path": full_path
                })

        # Sắp xếp theo số trong tên file
        def get_number(name):
            import re
            match = re.search(r'\d+', name)
            return int(match.group()) if match else 0

        results.sort(key=lambda x: get_number(x["name"]))
    except Exception as e:
        print(f"Lỗi khi đọc thư mục {dir_path}:", e)

    return results

@api_view(['GET'])
def list_courses(request):
    try:
        folders = os.listdir(COURSES_DIR)
        courses = []
        for folder in folders:
            folder_path = os.path.join(COURSES_DIR, folder)
            if os.path.isdir(folder_path):
                info = get_course_info(folder_path)
                courses.append({
                    "id": folder,
                    "course_name": info.get("course_name") if info else folder
                })
        return Response(courses)
    except Exception as e:
        return Response({"error": "Không thể đọc thư mục khóa học"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def course_detail(request, course_id):
    course_path = os.path.join(COURSES_DIR, course_id)
    if not os.path.exists(course_path) or not os.path.isdir(course_path):
        return Response({"error": "Khóa học không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

    info = get_course_info(course_path)
    content = read_folder_structure(course_path)

    return Response({
        "id": course_id,
        "course_name": info.get("course_name") if info else course_id,
        "content": content
    })

@api_view(['GET'])
def get_file_content(request):
    # Lấy tham số "path" từ query string
    file_path = request.GET.get("path")
    if not file_path or not os.path.exists(file_path):
        return Response({"error": "File không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Đọc nội dung file
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Trả về nội dung với content_type là "text/html" để đảm bảo trình duyệt render đúng
        return HttpResponse(content, content_type="text/html")
    except Exception as e:
        return Response({"error": "Không thể đọc file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)