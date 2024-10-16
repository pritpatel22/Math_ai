# db_connection.py
import mongoengine as me
from django.conf import settings

def connect_to_db():
    try:
        me.connect(
            db=settings.MONGODB_SETTINGS['db'],
            username=settings.MONGODB_SETTINGS.get('username'),
            password=settings.MONGODB_SETTINGS.get('password'),
            host=settings.MONGODB_SETTINGS.get('host'),
            port=settings.MONGODB_SETTINGS.get('port'),
        )
        print("Successfully connected to MongoDB.")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

def disconnect_from_db():
    try:
        me.disconnect()
    except Exception as e:
        print(f"Error disconnecting from MongoDB: {e}")
        raise
