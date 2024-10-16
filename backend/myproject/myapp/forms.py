from django import forms
from .models import Course, Video

# Form for adding and editing a Course
class CourseForm(forms.Form):
    title = forms.CharField(
        max_length=255,
        widget=forms.TextInput(attrs={'placeholder': 'Course Title', 'class': 'form-control'}),
        label="Course Title"
    )
    description = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Course Description', 'class': 'form-control'}),
        label="Course Description",
        required=False  # Make it optional as per your requirements
    )

    def save(self):
        # Create a Course instance
        course = Course(
            title=self.cleaned_data['title'],
            description=self.cleaned_data['description'],
            # Handle image if required
            # image=self.cleaned_data.get('image'),  # Only if you have an image field in your Course model
        )
        course.save()

# Form for adding and editing a Video
class VideoForm(forms.Form):
    title = forms.CharField(
        max_length=255,
        widget=forms.TextInput(attrs={'placeholder': 'Video Title', 'class': 'form-control'}),
        label="Video Title"
    )
    video_url = forms.CharField(
        widget=forms.TextInput(attrs={'placeholder': 'Embed Video URL', 'class': 'form-control'}),
        label="Embed Video URL"
    )
    description = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Video Description', 'class': 'form-control'}),
        label="Video Description (optional)",
        required=False  # Make it optional as per your requirements
    )

    def save(self, course):
        # Create a Video instance
        video = Video(
            title=self.cleaned_data['title'],
            video_url=self.cleaned_data['video_url'],
            description=self.cleaned_data['description'],
            course=course  # Associate video with the course
        )
        video.save()
