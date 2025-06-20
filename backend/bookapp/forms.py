from django import forms

class AnswerForm(forms.Form):
    m = forms.IntegerField(label="Tổng số trường hợp ")
    t = forms.IntegerField(label="Số trường hợp thuận lợi (t)")
    p = forms.FloatField(label="Xác suất P(A)", help_text="Nhập giá trị làm tròn đến 4 chữ số thập phân")
