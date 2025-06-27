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

def send_otp_email(to_email, otp_code):
    subject = 'Xác nhận OTP đăng nhập lần đầu'

    html_content = f"""
    <p>Chào bạn,</p>
    <p>Mã OTP của bạn là: <strong>{otp_code}</strong></p>
    <p>Vui lòng sử dụng mã này trong vòng 5 phút.</p>
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

def send_otp_email_forgot(to_email, otp_code):
    subject = 'Khôi phục mật khẩu - Mã xác thực OTP'

    html_content = f"""
    <p>Xin chào,</p>
    <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu từ địa chỉ email này.</p>
    <p>Mã OTP để xác minh là: <strong style="font-size: 18px; color: #d9534f;">{otp_code}</strong></p>
    <p>Vui lòng nhập mã này trong vòng <strong>5 phút</strong> để tiếp tục quá trình đặt lại mật khẩu.</p>
    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
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

