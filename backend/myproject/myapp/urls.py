from django.urls import path
from . import views,adminViews
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('avatar/<path:path>/', adminViews.serve_avatar, name='serve_avatar'),

    #Admin view
    path('', adminViews.admin_login, name='admin_login'),
    path('users/', adminViews.user_list, name='user_list'),
    path('users/profiles/', adminViews.user_profile_list, name='user_profile_list'),
    path('admin/logout/', adminViews.admin_logout, name='admin_logout'),
    
    
    
    # Course-related URLs
    path('courses/', adminViews.course_list, name='course_list'),  # List all courses
    path('courses/<str:course_id>/', adminViews.course_detail, name='course_detail'),  # View course detail
    path('add_course/', adminViews.add_course, name='add_course'),  # Add a new course
    path('courses/delete/<str:course_id>/', adminViews.delete_course, name='delete_course'),  # Delete a course
    
    # Video-related URLs
    path('courses/<str:course_id>/search/', adminViews.search_videos, name='search_videos'),   # Search for videos
    path('courses/<str:course_id>/add_video_to_course/<str:video_id>/', adminViews.add_video_to_course, name='add_video_to_course'),  # Add a video to a specific course
    path('videos/delete/<str:video_id>/', adminViews.delete_video, name='delete_video'),  # Delete a video
    
    # File upload and processing
    path('upload/', views.upload_file, name='upload_file'),
    path('upload/solve/',views.solve_equation_with_wolframalpha, name='solve_equation'),

    # User authentication and details
    path('login/', views.login_user, name='login_user'),
    path('register/', views.register_user, name='register_user'),
    path('user-details/', views.user_details, name='user_details'),
    path('update-user-details/', views.update_user_details, name='update_user_details'),
    path('change-password/', views.ChangePassword, name='change-password'),

    # Payment status
    path('update-payment-status/', views.update_payment_status, name='update_payment_status'),
    path('get-payment-status/', views.get_payment_status, name='get_payment_status'),
    
    #videoplayer url
    path('view_courses_details/',views.course_list_view, name='course_list_view')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.AVATAR_URL, document_root=settings.AVATAR_ROOT)