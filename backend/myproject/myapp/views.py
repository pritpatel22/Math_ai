import datetime
import json
import os
import logging
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from passlib.hash import pbkdf2_sha256 # type: ignore
from mongoengine import ValidationError
from django.conf import settings
from .serializers import PaymentStatusSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.contrib.auth import authenticate
from .models import User, UserProfile,PaymentStatus,Video,Course
import wolframalpha
from . import utils

logger = logging.getLogger(__name__)

# Temporary storage for extracted text
image_text_storage = {}

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and 'image' in request.FILES:
        try:
            uploaded_file = request.FILES['image']
            saved_path = default_storage.save(uploaded_file.name, ContentFile(uploaded_file.read()))

            # Preprocess the image
            processed_image_path = utils.preprocess_image(default_storage.path(saved_path))

            # Extract text from the processed image
            extracted_text = utils.extract_text_from_image_with_google_vision(processed_image_path)

            if extracted_text:
                extracted_text = utils.postprocess_extracted_text(extracted_text)
                image_text_storage['extracted_text'] = extracted_text

                return JsonResponse({
                    'message': 'Image uploaded and text extracted successfully.',
                    'extracted_text': extracted_text
                })

            return JsonResponse({'error': 'No text found in the image.'}, status=400)

        except Exception as e:
            logger.error(f"Error processing image: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)
        finally:
            # Clean up
            if default_storage.exists(saved_path):
                default_storage.delete(saved_path)
            if default_storage.exists(processed_image_path):
                default_storage.delete(processed_image_path)

    return JsonResponse({'error': 'Invalid request method or no file found in request'}, status=400)


client = wolframalpha.Client(settings.WOLFRAMALPHA_API_KEY)
@csrf_exempt
def solve_equation_with_wolframalpha(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            problem_text = data.get('text', None)
            if not problem_text:
                return JsonResponse({'error': 'No text provided'}, status=400)

            # Query WolframAlpha to solve the equation
            try:
                res = client.query(problem_text)
                solution = next(res.results).text  # Extract the first result

                # Get related YouTube video links (if this is still needed)
                video_links = utils.get_youtube_links(problem_text)

                return JsonResponse({
                    'text': problem_text,
                    'solution': solution,
                    'video_links': video_links
                })

            except StopIteration:
                logger.error("No solution found")
                return JsonResponse({'error': 'No solution found'}, status=404)
            except Exception as e:
                logger.error(f"Error querying WolframAlpha: {e}", exc_info=True)
                return JsonResponse({'error': str(e)}, status=400)

        except json.JSONDecodeError:
            logger.error("Error decoding JSON data", exc_info=True)
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"Error processing request: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)



def custom_login(request, user):
    request.session.flush()  # Clear the session to avoid conflicts
    request.session['user_id'] = str(user.id)  # Store the user ID
    request.session['is_authenticated'] = True  # Mark as authenticated
    request.user = user  # Optionally set the request.user


@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username_or_email = data.get('username_or_email', '')
            password = data.get('password', '')
            is_google_signin = data.get('is_google_signin', False)

            if not username_or_email:
                return JsonResponse({'error': 'Please provide a username or email.'}, status=400)

            user = authenticate(request, username_or_email=username_or_email, password=password, is_google_signin=is_google_signin, backend='myapp.backends.UsernameOrEmailBackend')

            if user is not None:
                if user.is_active:
                    
                    custom_login(request,user)

                    payload = {
                        'refresh': str(RefreshToken.for_user(user)),
                        'access': str(RefreshToken.for_user(user).access_token),
                        'user_id': str(user.id),  # Use str(user.id) for MongoDB
                        'email': user.email,
                        'username': user.username,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
                        'iat': datetime.datetime.utcnow(),
                    }
                    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                    return JsonResponse({'status': 'success', 'token': token}, status=200)
                else:
                    return JsonResponse({'error': 'Account is inactive.'}, status=403)
            else:
                return JsonResponse({'error': 'Invalid username/email or password. Please sign up if you do not have an account.'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            logger.error(f"Error logging in: {e}", exc_info=True)
            return JsonResponse({'error': 'Internal server error.'}, status=500)

    return JsonResponse({'error': 'Invalid method.'}, status=405)


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            # Parse JSON data
            data = json.loads(request.body)
            first_name = data.get('firstname')
            last_name = data.get('lastname')
            email = data.get('email')
            is_google_signup = data.get('is_google_signup', False)  # Default to False for manual signup
            mobile_number = data.get('mobile', None)
            password = data.get('password', None)
            confirm_password = data.get('confirmPassword', None)

            # Validate common fields
            if not (first_name and email):
                return JsonResponse({'error': 'First name and email are required'}, status=400)

            # Check if the email already exists
            if User.objects(email=email).first():
                return JsonResponse({'error': 'Email already exists'}, status=400)

            # Manual signup: validate password and confirm password
            if not is_google_signup:
                if not (mobile_number and password and confirm_password):
                    return JsonResponse({'error': 'Mobile number, password, and confirm password are required for manual signup'}, status=400)

                if password != confirm_password:
                    return JsonResponse({'error': 'Passwords do not match'}, status=400)

                # Create user with full details for manual signup
                user = User(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    mobile_number=mobile_number,
                )
                user.verify_password(password)  # Hash the password

            else:
                # Google signup: no password or mobile number required
                user = User(
                    is_google_signup=True,
                    email=email,
                    first_name=first_name,
                    last_name=last_name  # Optional for Google signup
                )

            user.save()  # Save the user to MongoDB
            return JsonResponse({'status': 'success', 'message': 'User registered successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValidationError as ve:
            logger.error(f"Validation error: {ve}", exc_info=True)
            return JsonResponse({'error': str(ve)}, status=400)
        except Exception as e:
            logger.error(f"Registration error: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def user_details(request):
    if request.method == 'POST':
        try:
            auth_header = request.headers.get('Authorization', None)
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Authorization header missing or invalid'}, status=401)
            
            token = auth_header.split(' ')[1]

            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid token'}, status=401)

            # Fetch the user from MongoDB using the user ID
            try:
                user = User.objects.get(id=user_id)
                
                # Get or create UserProfile
                user_profile = UserProfile.objects(user=user).first()
                if not user_profile:
                    user_profile = UserProfile(user=user)
                    user_profile.save()  # Save the new profile

            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Construct the user data
            user_data = {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'mobile_number': user.mobile_number,
                'avatar': user_profile.avatar if user_profile.avatar else None,
            }

            # Generate a new JWT token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return JsonResponse({
                'user_data': user_data,
                'access_token': access_token
            })

        except Exception as e:
            logger.error(f"Error: {str(e)}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
def update_user_details(request):
    if request.method == 'POST':
        try:
            auth_header = request.headers.get('Authorization', None)
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Authorization header missing or invalid'}, status=401)

            token = auth_header.split(' ')[1]

            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')  # Get user ID from payload
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid token'}, status=401)

            # Fetch the user from MongoDB using the user ID
            try:
                user = User.objects.get(id=user_id)
                user_profile = UserProfile.objects(user=user).first()  # Fetch the user profile

                # Create a new UserProfile if it doesn't exist
                if user_profile is None:
                    user_profile = UserProfile(user=user)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Parse the request data
            data = request.POST
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            mobile_number = data.get('mobile_number')

            # Update user details if provided
            if 'avatar' in request.FILES:
                avatar = request.FILES['avatar']
                
                # Validate that the uploaded file is an image (optional, based on your validation logic)
                if avatar.content_type.startswith('image/'):
                    
                    # Ensure the avatar directory exists
                    if not os.path.exists(settings.AVATAR_ROOT):
                        os.makedirs(settings.AVATAR_ROOT)

                    # Construct the full path for the avatar
                    avatar_path = os.path.join(settings.AVATAR_ROOT, avatar.name)
                    
                    # Save the file to the specified path
                    with open(avatar_path, 'wb+') as destination:
                        for chunk in avatar.chunks():
                            destination.write(chunk)
                    
                    # Update the user profile with the new avatar URL
                    user_profile.avatar = f"{settings.AVATAR_URL}{avatar.name}"  # Set the URL for the avatar
                    
                    # Save the user profile
                    user_profile.save()


            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            if mobile_number:
                user.mobile_number = mobile_number 

            # Save the updated user details
            user.save()
            user_profile.save()

            # Return updated user data
            user_data = {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'mobile_number': user.mobile_number,
                'avatar': request.build_absolute_uri(user_profile.avatar) if user_profile.avatar else None,  # Get avatar path
            }

            return JsonResponse({'user_data': user_data}, status=200)

        except Exception as e:
            logger.error(f"Error: {str(e)}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
def ChangePassword(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')  # Get username from request
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')

            if not all([username, current_password, new_password, confirm_password]):
                return JsonResponse({'error': 'All fields are required'}, status=400)

            # Fetch user from MongoDB
            user = User.objects.get(username=username)  # Adjust this query as needed
            
            # Verify current password
            if not pbkdf2_sha256.verify(current_password, user.password):
                return JsonResponse({'error': 'Current password is incorrect'}, status=400)

            if new_password != confirm_password:
                return JsonResponse({'error': 'New passwords do not match'}, status=400)

            # Update password in the database
            user.password = pbkdf2_sha256.hash(new_password)  # Hash the new password
            user.save()  # Ensure this works with your MongoDB setup

            return JsonResponse({'status': 'success'}, status=200)

        except User.DoesNotExist:
            logger.error("User not found", exc_info=True)
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            logger.error("Error decoding JSON data", exc_info=True)
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            logger.error(f"Error processing request: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)



@csrf_exempt
def get_payment_status(request):
    if request.method == 'POST':
        try:
            # Extract the Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Authorization header missing or invalid'}, status=401)

            # Extract the token from the Bearer Authorization header
            token = auth_header.split(' ')[1]

            # Decode the JWT token to extract the username
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                username = payload.get('username')
                if not username:
                    return JsonResponse({'error': 'Username missing in token'}, status=400)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid token'}, status=401)

            # Fetch the user from MongoDB using the username
            user = User.objects(username=username).first()
            if not user:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Fetch or create the payment status for the user
            payment_status = PaymentStatus.objects(user=user).first()
            if not payment_status:
                payment_status = PaymentStatus(user=user, status='pending')
                payment_status.save()

            # Serialize the payment status and return
            serializer = PaymentStatusSerializer(payment_status)
            return JsonResponse(serializer.data, status=200)

        except Exception as e:
            return JsonResponse({'error': f'Unhandled error: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def update_payment_status(request):
    if request.method == 'POST':
        try:
            # Extract the token from the Authorization header
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({'error': 'Authorization header missing or invalid'}, status=401)

            token = auth_header.split(' ')[1]

            # Decode the JWT token to get the username
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                username = payload.get('username')
                if not username:
                    return JsonResponse({'error': 'Username missing in token'}, status=400)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid token'}, status=401)

            # Fetch the user from MongoDB
            user = User.objects(username=username).first()
            if not user:
                return JsonResponse({'error': 'User not found'}, status=404)

            # Fetch or create payment status for the user
            payment_status = PaymentStatus.objects(user=user).first()
            if not payment_status:
                payment_status = PaymentStatus(user=user, status='pending')
                payment_status.save()

            # Parse the request data
            try:
                data = json.loads(request.body)
                new_status = data.get('status')  # Ensure this matches the field name in PaymentStatus
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)

            if new_status:
                # Update the payment status and save to MongoDB
                payment_status.status = new_status
                payment_status.save()
                serializer = PaymentStatusSerializer(payment_status)
                return JsonResponse(serializer.data, status=200)
            else:
                return JsonResponse({'error': 'Payment status not provided'}, status=400)

        except Exception as e:
            return JsonResponse({'error': f'Unhandled error: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def course_list_view(request):
    if request.method == 'GET':
        try:
            # Fetch all courses
            courses = Course.objects.all()
            if not courses:
                return JsonResponse({'error': 'No courses found.'}, status=404)

            course_data = [{'id': str(course.id), 'title': course.title} for course in courses]
            return JsonResponse(course_data, safe=False)

        except Exception as e:
            return JsonResponse({'error': f'An error occurred while fetching courses: {str(e)}'}, status=500)

    elif request.method == 'POST':
        try:
            # Parse incoming JSON data
            body = json.loads(request.body)
            course_id = body.get('course_id')

            if not course_id:
                return JsonResponse({'error': 'course_id is required.'}, status=400)

            # Fetch the course by ID
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'error': 'Course not found.'}, status=404)

            # Fetch associated videos
            video_data = []
            for video_ref in course.videos:
                try:
                    video = Video.objects.get(id=video_ref.id)
                    video_info = {
                        'id': str(video.id),
                        'video_data': video.video_data  # Fetch the raw video data
                    }
                    video_data.append(video_info)
                except Video.DoesNotExist:
                    continue  # Skip videos that do not exist
            return JsonResponse(video_data, safe=False)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Method not allowed.'}, status=405)