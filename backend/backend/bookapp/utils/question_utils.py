import base64

def encode_values(*args):
    """Mã hóa danh sách số nguyên thành base64 string"""
    raw = '-'.join(map(str, args)).encode()
    return base64.urlsafe_b64encode(raw).decode()

def decode_values(code):
    """Giải mã base64 string thành danh sách số nguyên"""
    raw = base64.urlsafe_b64decode(code.encode()).decode()
    return list(map(int, raw.split('-')))