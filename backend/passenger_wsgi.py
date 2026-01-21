import os
import sys

# Set up the path to the backend directory
sys.path.insert(0, os.path.dirname(__file__))

# Point to the Django application
from core.wsgi import application
