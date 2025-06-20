from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

def send_html_email(to_email, matched_code):
    subject = 'Mã xác nhận từ hệ thống'

    html_content = f"""
    <p>Chào bạn,</p>
    <p>Mã xác nhận của bạn là: <strong>{matched_code}</strong></p>
    <br>
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000;">
        <p><strong>Nguyễn Đức Thịnh</strong> / Giảng viên<br>
        <a href="mailto:ndthinh1402@gmail.com">ndthinh1402@gmail.com</a> / 0919140184</p>

        <p><strong>Bộ môn Toán Ứng dụng - Khoa CNTT - ĐHXD</strong><br>
        Phòng 409 Nhà A1, 55 Giải Phóng, Hà Nội<br>
        <a href="http://huce.edu.vn" target="_blank">http://huce.edu.vn</a></p>
    </div>
    """

    text_content = strip_tags(html_content)
    from_email = 'Nguyễn Đức Thịnh / Giảng viên <ndthinh1402@gmail.com>'

    msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
