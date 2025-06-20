from rest_framework import serializers
from bookapp.models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('lastName', 'firstName', 'username', 'password', 'classname', 'phone', 'email')  # Không bao gồm id
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'username': {'required': True}
        }

    def create(self, validated_data):
        user = User(**validated_data)
        print(validated_data)
        user.set_password(validated_data.get('password'))
        user.save()
        return user