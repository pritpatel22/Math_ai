from googleapiclient.discovery import build
from django.conf import settings
import requests
import isodate
import os
import logging
from mongoengine import DoesNotExist
from django.conf import settings
from django.shortcuts import render, redirect
from .models import User, UserProfile, Admin,Course, Video
from mongoengine import Q 
from django.contrib.auth import logout
from django.contrib import messages
from django.http import FileResponse,Http404
import os
import logging
from mongoengine import DoesNotExist
from django.conf import settings
from .serializers import CourseSerializer
from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib import messages


logger = logging.getLogger(__name__)



def admin_login(request):
    print(f"Request method: {request.method}")
    if request.method == 'POST':
        # Get form data
        login_input = request.POST.get('username_or_email')
        password = request.POST.get('password')
        print(login_input)
        # Use Q objects to filter by either username or email
        admin = Admin.objects.filter(Q(username=login_input) | Q(email=login_input)).first()
        
        # if admin.check_password(password):
        if login_input and password:
            print(password)
            logger.debug(f"Login attempt for: {login_input}")

            if admin:
                logger.debug(f"Found admin: {admin.username}")
                print(admin.check_password(password))
                if admin.check_password(password):
                    request.session['admin_username'] = admin.username
                    logger.info(f"Admin {admin.username} logged in successfully.")
                    return redirect('user_list')
                else:
                    logger.warning(f"Password mismatch for admin: {admin.username}")
                    messages.error(request, 'Invalid credentials. Please try again.')
            else:
                logger.warning(f"Admin not found for input: {login_input}")
                messages.error(request, 'Invalid credentials. Please try again.')
                return render(request, 'admin/admin_login.html')
        else:
            messages.error(request, 'Please fill in both username/email and password fields.')
    
    return render(request, 'admin/admin_login.html')



def serve_avatar(request, path):
    file_path = os.path.join(settings.AVATAR_ROOT, path)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'))
    raise Http404("Avatar not found")



def user_profile_list(request):
    if 'admin_username' not in request.session:
        return redirect('admin_login')

    profiles = []
    try:
        profiles = UserProfile.objects.all()
    except Exception as e:
        logger.error(f"Error retrieving user profiles: {e}")
        # Optionally, you can add a message to display in the template
        profiles = []  # Fallback to an empty list if there's an error

    valid_profiles = []
    for profile in profiles:
        try:
            profile.user.reload()  # Check if the user exists
            valid_profiles.append(profile)
        except DoesNotExist:
            logger.warning(f'Orphaned UserProfile detected: {profile.id}')
            continue  # Skip this profile if the user does not exist

    return render(request, 'admin/user_profile_list.html', {'profiles': valid_profiles})

def user_list(request):
    if 'admin_username' not in request.session:
        return redirect('admin_login')  # Redirect to login if not authenticated

    users = []
    try:
        users = User.objects.all()
    except Exception as e:
        logger.error(f"Error retrieving users: {e}")
        # Fallback to an empty list if there's an error
        users = []

    valid_users = []
    for user in users:
        try:
            user.reload()  # Check if the user exists (if applicable)
            valid_users.append(user)
        except DoesNotExist:
            logger.warning(f'Orphaned User detected: {user.id}')
            continue  # Skip this user if they do not exist

    return render(request, 'admin/user_list.html', {'users': valid_users})

def admin_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        if 'admin_username' not in request.session:
            return redirect('admin_login')  # Redirect to login if not authenticated
        return view_func(request, *args, **kwargs)
    return _wrapped_view

# List all courses
@admin_required  # Assuming you have a decorator for admin access
def admin_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('/')


YOUTUBE_API_KEY = settings.YOUTUBE_API_KEY

def youtube_search(query):
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    request = youtube.search().list(
        part='snippet',
        maxResults=10,
        q=query,
        type='video'  # Change to 'playlist' if you want to include playlists
    )
    response = request.execute()
    return response.get('items', [])


def parse_duration(duration_str):
    try:
        duration = isodate.parse_duration(duration_str)
        return int(duration.total_seconds())  # Convert to total seconds
    except Exception as e:
        print("Duration parsing error:", str(e))
        return 0  # Default to 0 if there's an error

def get_video_details(video_id):
    api_key = YOUTUBE_API_KEY  # Ensure you use your actual API key
    url = f'https://www.googleapis.com/youtube/v3/videos?id={video_id}&key={api_key}&part=snippet,contentDetails'

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses

        # If the response is successful, parse the data
        data = response.json()
        
        # Debug: Print the raw API response
        print("API Response:", data)

        # Simply return the entire API response without extracting specific data
        return data
        
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except KeyError as key_err:
        print(f"Key error occurred: {key_err}")
    except Exception as e:
        print("Exception occurred:", str(e))
    return None  # Return None if there was an error
@admin_required  # Assuming you have a decorator for admin access
def admin_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('/')


# List all courses
@admin_required
def course_list(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return render(request, 'admin/course_list.html', {'courses': serializer.data})


@admin_required
def course_detail(request, course_id):
    try:
        # Retrieve the course by its ID
        course = Course.objects.get(id=course_id)
    except DoesNotExist:
        return redirect('course_list')  # Redirect to a list or handle accordingly

    # Serialize course data
    course_serializer = CourseSerializer(course)

    # Fetch associated videos using the stored references in the course document
    video_ids = course.videos  # This should be a list of video references
    video_data = []

    print(f"Video IDs for course {course_id}: {video_ids}")  # Debug output

    # If video_ids is empty, output a more descriptive message
    if not video_ids:
        print("No videos found for this course.")

    # Construct video data from the video references
    for video_ref in video_ids:
        try:
            # Fetch the Video document using the reference
            video = Video.objects.get(id=video_ref.id)
            video_info = {
                'id': str(video.id),  # Ensure ID is a string for template rendering
                'title': video.video_data.get('items', [{}])[0].get('snippet', {}).get('title', 'No Title'),
                'thumbnail_url': video.video_data.get('items', [{}])[0].get('snippet', {}).get('thumbnails', {}).get('high', {}).get('url', 'path/to/default-image.jpg'),
                'video_url': f"https://www.youtube.com/embed/{video.video_data.get('items', [{}])[0].get('id', '')}",  # Construct the embed URL
            }
            video_data.append(video_info)
        except DoesNotExist:
            print(f"Video with ID {video_ref.id} does not exist.")  # Debug output for missing video references

    return render(request, 'admin/course_details.html', {
        'course': course_serializer.data,
        'videos': video_data
    })



@admin_required
def add_course(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')

        errors = {}
        if not title:
            errors['title'] = 'Course title is required.'
        if not description:
            errors['description'] = 'Course description is required.'

        if errors:
            return render(request, 'admin/add_course.html', {
                'errors': errors,
                'serializer': CourseSerializer(data=request.POST),
            })

        Course.objects.create(title=title, description=description)
        messages.success(request, 'Course added successfully.')
        return redirect('course_list')

    return render(request, 'admin/add_course.html', {
        'serializer': CourseSerializer(),
    })

# Delete a course
@admin_required
def delete_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except DoesNotExist:
        raise Http404("Course does not exist")

    course.delete()
    messages.success(request, 'Course deleted successfully.')
    logger.info(f"Course '{course.title}' deleted.")
    return redirect('course_list')


@admin_required
def search_videos(request, course_id):  # Accept course_id as a parameter
    videos = []  # Initialize videos to an empty list

    if request.method == 'POST':
        query = request.POST.get('query')
        videos = youtube_search(query)  # Search videos based on the query

    return render(request, 'admin/search_videos.html', {
        'videos': videos,
        'course_id': course_id,  # Pass course_id to the template context
    })

@admin_required
def add_video_to_course(request, course_id, video_id):
    # Fetch video details from YouTube API
    video_details = get_video_details(video_id)
    
    # Check if video details were found
    if video_details is None:
        messages.error(request, "Video not found.")
        return redirect('course_detail', course_id=course_id)

    try:
        # Retrieve the course by its ID
        course = Course.objects.get(id=course_id)

        # Create a new Video object linked to the course, storing the entire raw video data
        video = Video(
            course=course,
            video_data=video_details  # Store the entire raw data as it is
        )
        video.save()  # Save the video to the database

        # Append the new video reference to the course's video list (reference to the Video object)
        course.videos.append(video)  # Append the Video object, not the video_details
        course.save()  # Save the course to update the video list

        messages.success(request, "Video added successfully.")
    except Exception as e:
        messages.error(request, f"Error adding video: {str(e)}")
        print(f"Error adding video: {str(e)}")  # Log the error for debugging

    return redirect('course_detail', course_id=course_id)




# Delete a video
@admin_required
def delete_video(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        video.delete()
        messages.success(request, 'Video removed successfully.')
    except Video.DoesNotExist:
        messages.error(request, 'Video does not exist.')
    return redirect('course_detail', course_id=str(video.course.id))
