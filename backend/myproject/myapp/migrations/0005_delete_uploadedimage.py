# Generated by Django 5.1 on 2024-08-21 06:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0004_uploadedimage_delete_simplemodel'),
    ]

    operations = [
        migrations.DeleteModel(
            name='UploadedImage',
        ),
    ]
