import os
import sys

# Add project directory to Python path
sys.path.append(os.path.dirname(__file__))

# Set Django settings module
os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "core.settings"   # ⚠️ change if your settings path is different
)

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
