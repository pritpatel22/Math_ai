from rest_framework_mongoengine import serializers # type: ignore
from .models import User, PaymentStatus ,Course, Video

class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'mobile_number', 'avatar', 'is_admin', 'password')

    def validate_email(self, value):
        if User.objects(email=value).first():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_mobile_number(self, value):
        if len(str(value)) != 10:  # Assuming a 10-digit mobile number
            raise serializers.ValidationError("Mobile number must be exactly 10 digits.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user


class PaymentStatusSerializer(serializers.DocumentSerializer):
    class Meta:
        model = PaymentStatus
        fields = ['status']


class CourseSerializer(serializers.DocumentSerializer):

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'videos', 'created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['videos'] = [
            video.video_data  # Add the raw video data dictionary
            for video in Video.objects.filter(course=instance)
        ]
        return representation
