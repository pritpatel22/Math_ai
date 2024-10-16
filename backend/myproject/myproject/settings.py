from datetime import timedelta
import os
from pathlib import Path  # type: ignore
from mongoengine import connect  # Should return True if the directory exists

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECRET_KEY = 'django-insecure-=j+^gq91(6zx^dac1yx(c2x^b#==7c6))!c86sbumdi7d0(r4j'
DEBUG = True
ALLOWED_HOSTS = []
# AUTH_USER_MODEL = 'myapp.User'


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'embed_video',
    'myapp',
]

YOUTUBE_API_KEY='AIzaSyCsV-GeRkesktOK4s95oEV01K8V96Qstb8'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'myapp', 'templates/admin')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
# import logging
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',],
}
OPENAI_API_KEY = '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'

WOLFRAMALPHA_API_KEY = 'VRWQT4-64J8GTAWJW'
SECRET_KEY = '1029384756'
# logger = logging.getLogger(__name__)
# logger.info(f'DATABASES configuration: {DATABASES}')
# # Remove or leave DATABASES setting empty if using MongoDB only
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'your_db_name',
#         'USER': 'kunj167',
#         'PASSWORD': 'kunj@167',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',  # Or 'django.db.backends.postgresql'
#         'NAME': BASE_DIR / 'db.sqlite3',  # For SQLite, or specify your PostgreSQL details
#     }
# }


# AUTH_USER_MODEL = 'myapp.user1'

# MongoDB connection settings
connect(
    db="MyDataBase",  # Replace with your database name
    host="mongodb://localhost:27017/MyDataBase",  # Replace with your MongoDB URI
    # username="kunj167",  # Replace with your MongoDB username (if applicable)
    # password="kunj@167",  # Replace with your MongoDB password (if applicable)
)



AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

AUTHENTICATION_BACKENDS = [
    'myapp.backends.UsernameOrEmailBackend',  # Use the correct path to your custom backend
    'django.contrib.auth.backends.ModelBackend',  # Ensure default backend is also included
]



LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

AVATAR_URL = '/api/avatar/'  # URL for accessing avatar images
AVATAR_ROOT = os.path.join(BASE_DIR, 'avatars')  # Directory for avatar images



DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "D:\\Python\\kunj\\myproject167.json"

# settings.py

# Use cached sessions instead of database sessions
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}


# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'error.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'ERROR',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['file', 'console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
}
