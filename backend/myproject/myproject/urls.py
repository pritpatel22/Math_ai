from django.urls import path, include
# from myapp.admin import admin  # Import your custom AdminSite

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/', include('myapp.urls')),
    path('', include('myapp.urls')),# Ensure this matches the `api/` prefix in your request
]
