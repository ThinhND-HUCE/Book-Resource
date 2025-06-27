from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from django.conf import settings
from bookapp.permissions import IsAuthenticatedWithJWT
from rest_framework.decorators import permission_classes
import os
import json
import re
import urllib.parse
import mimetypes

COURSES_DIR = os.path.abspath(os.path.join(settings.BASE_DIR, '..', 'Resource'))

def get_course_info(course_path):
    info_path = os.path.join(course_path, "info.json")
    info = {}

    # Đọc file info.json nếu có
    if os.path.exists(info_path):
        try:
            with open(info_path, "r", encoding="utf-8") as f:
                info = json.load(f)
        except Exception as e:
            print(f"Lỗi khi đọc {info_path}:", e)

    # Tìm file ảnh đầu tiên trong thư mục làm ảnh đại diện
    try:
        for entry in os.listdir(course_path):
            if entry.lower().endswith(('.webp', '.png', '.jpg', '.jpeg')):
                image_path = os.path.join(course_path, entry)
                info["thumbnail"] = f"/api/files/view/?path={urllib.parse.quote(image_path)}"
                break
    except Exception as e:
        print(f"Lỗi khi tìm ảnh trong {course_path}:", e)

    return info if info else None

def read_folder_structure(dir_path):
    results = []
    try:
        for entry in os.listdir(dir_path):
            full_path = os.path.join(dir_path, entry)
            if os.path.isdir(full_path):
                info = get_course_info(full_path)
                if "review" in entry.lower():
                    continue
                children = read_folder_structure(full_path)
                if info:
                    results.append({
                        "type": "folder",
                        "name": entry.replace("_", " ") + ". " + (info.get("chapter_name") or info.get("section_name") or ""),
                        "path": full_path,
                        "children": children,
                        "sort_key": entry
                    })
                else:
                    results.append({
                        "type": "folder",
                        "name": entry.replace("_", " "),
                        "path": full_path,
                        "children": children,
                        "sort_key": entry
                    })
            elif entry.lower().endswith(".html"):
                results.append({
                    "type": "file",
                    "name": entry.replace("_", " "),
                    "path": full_path,
                    "sort_key": entry
                })

        def get_number(item):
            matches = re.findall(r'\d+', item["sort_key"])
            return tuple(map(int, matches)) if matches else (0,)

        results.sort(key=get_number)
    except Exception as e:
        print(f"Lỗi khi đọc thư mục {dir_path}:", e)

    return results

@api_view(['GET'])
def list_grades(request):
    """API để lấy danh sách tất cả các lớp"""
    try:
        folders = os.listdir(COURSES_DIR)
        grades = []
        
        # Sắp xếp grades theo thứ tự
        grade_order = [
            'Grade_1', 'Grade_2', 'Grade_3', 'Grade_4', 'Grade_5', 'Grade_6',
            'Grade_7', 'Grade_8', 'Grade_9', 'Grade_10', 'Grade_11', 'Grade_12', 'University'
        ]
        
        for grade_id in grade_order:
            if grade_id in folders:
                grade_path = os.path.join(COURSES_DIR, grade_id)
                if os.path.isdir(grade_path):
                    info = get_course_info(grade_path)
                    grades.append({
                        "id": grade_id,
                        "grade_name": info.get("grade_name") if info else (
                            "Đại học" if grade_id == "University" else f"Lớp {grade_id.replace('Grade_', '')}"
                        )
                    })
        
        return Response(grades)
    except Exception as e:
        return Response({"error": "Không thể đọc danh sách lớp"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticatedWithJWT])
def list_courses_by_grade(request, grade_id):
    """API để lấy danh sách khóa học theo lớp"""
    try:
        grade_path = os.path.join(COURSES_DIR, grade_id)
        if not os.path.exists(grade_path) or not os.path.isdir(grade_path):
            return Response({"error": "Lớp không tồn tại"}, status=status.HTTP_404_NOT_FOUND)
        
        folders = os.listdir(grade_path)
        courses = []
        
        for folder in folders:
            folder_path = os.path.join(grade_path, folder)
            if os.path.isdir(folder_path):
                info = get_course_info(folder_path)
                courses.append({
                    "id": folder,
                    "course_name": info.get("course_name") if info else folder.replace("_", " "),
                    "thumbnail": info.get("thumbnail") if info else None
                })
        
        return Response(courses)
    except Exception as e:
        return Response({"error": "Không thể đọc danh sách khóa học"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticatedWithJWT])
def course_detail(request, grade_id, course_id):
    course_path = os.path.join(COURSES_DIR, grade_id, course_id)
    print(f"[DEBUG] Đường dẫn tới khóa học: {course_path}")  # Debug

    if not os.path.exists(course_path) or not os.path.isdir(course_path):
        print("[DEBUG] Không tìm thấy thư mục khóa học.")  # Debug
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
    file_path = request.GET.get("path")

    if not file_path or not os.path.exists(file_path):
        return Response({"error": "File không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

    # Xác định loại file
    is_image = file_path.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))

    # Nếu không phải ảnh → kiểm tra permission
    if not is_image:
        # Manual check token (vì không dùng decorator ở đây)
        checker = IsAuthenticatedWithJWT()
        if not checker.has_permission(request, None):
            return Response({"error": "Không có quyền truy cập"}, status=status.HTTP_403_FORBIDDEN)

    try:
        mime_type, _ = mimetypes.guess_type(file_path)
        with open(file_path, "rb") as f:
            return HttpResponse(f.read(), content_type=mime_type or "application/octet-stream")
    except Exception as e:
        return Response({"error": "Không thể đọc file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticatedWithJWT])
def generate_pages_from_template(request):
    """
    Tạo các file pages .tsx còn thiếu bằng cách sao chép nội dung từ file mẫu
    và thay thế đường dẫn course_id tương ứng
    """
    try:
        # Đường dẫn đến file mẫu và thư mục pages
        template_filename = "ProbabilityandStatistics.tsx"
        template_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'src', 'pages', template_filename)
        pages_dir = os.path.join(settings.BASE_DIR, '..', 'frontend', 'src', 'pages')

        if not os.path.exists(template_path):
            return Response({"error": "Không tìm thấy file mẫu"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        with open(template_path, "r", encoding="utf-8") as f:
            template_content = f.read()

        created_pages = []

        for grade_folder in os.listdir(COURSES_DIR):
            grade_path = os.path.join(COURSES_DIR, grade_folder)
            if not os.path.isdir(grade_path):
                continue

            for course_folder in os.listdir(grade_path):
                course_path = os.path.join(grade_path, course_folder)
                if not os.path.isdir(course_path):
                    continue

                # Tên component dạng PascalCase
                component_name = ''.join(word.capitalize() for word in course_folder.split('_'))
                page_filename = f"{component_name}.tsx"
                page_path = os.path.join(pages_dir, page_filename)

                if os.path.exists(page_path):
                    continue  # Bỏ qua nếu đã tồn tại

                # Thay thế URL và ComponentName trong nội dung mẫu
                new_content = template_content
                new_content = new_content.replace("/course/Probability_and_Statistics", f"/course/{course_folder}")
                new_content = new_content.replace("ProbabilityandStatistics", component_name)

                # Ghi file mới
                with open(page_path, "w", encoding="utf-8") as f:
                    f.write(new_content)

                created_pages.append(page_filename)

        return Response({"created": created_pages}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
