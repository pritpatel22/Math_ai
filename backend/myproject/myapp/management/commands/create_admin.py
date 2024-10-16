import re
from django.core.management.base import BaseCommand
from myapp.models import Admin
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Create an admin user'

    def handle(self, *args, **kwargs):
        email = self.get_valid_email()
        first_name = self.get_non_empty_input("Enter admin first name: ")
        last_name = self.get_non_empty_input("Enter admin last name: ")
        mobile_number = self.get_valid_mobile_number()
        password = self.get_valid_password()

        # Log the details to see if all inputs are correct
        logger.debug(f"Creating admin user with email: {email}, name: {first_name} {last_name}")

        # Create the admin user
        admin = Admin(
            email=email,
            first_name=first_name,
            last_name=last_name,
            mobile_number=mobile_number
        )
        
        try:
            # Log the password creation step
            logger.debug(f"Setting password for admin: {email}")
            
            # Use the set_password method to hash and set the password
            
            
            admin.set_password(password)
            
            logger.debug(f"Hashed password for admin: {admin.password}")
            admin.save()
            
            self.stdout.write(self.style.SUCCESS('Successfully created admin user'))
            logger.info(f"Successfully created admin: {admin.username}")
        except Exception as e:
            logger.error(f"Error saving admin user: {str(e)}")
            self.stderr.write(self.style.ERROR(f'Error saving admin user: {str(e)}'))

    def get_valid_email(self):
        while True:
            email = input("Enter admin email: ")
            if re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return email
            else:
                print("Invalid email format. Please try again.")

    def get_non_empty_input(self, prompt):
        while True:
            user_input = input(prompt).strip()
            if user_input:
                return user_input
            else:
                print("This field cannot be empty. Please try again.")

    def get_valid_mobile_number(self):
        while True:
            mobile_number = input("Enter admin mobile number: ").strip()
            if re.match(r"^\+?[1-9]\d{1,14}$", mobile_number):  # Basic regex for international phone numbers
                return mobile_number
            else:
                print("Invalid mobile number format. Please try again.")

    def get_valid_password(self):
        while True:
            password = input("Enter admin password: ").strip()
            if len(password) >= 8:  # Minimum length for the password
                return password
            else:
                print("Password must be at least 8 characters long. Please try again.")
