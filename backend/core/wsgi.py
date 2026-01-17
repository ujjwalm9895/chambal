"""
WSGI config for Chambal Sandesh project.
"""

import os
from django.core.wsgi import get_wsgi_application

# Use production settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings_production')

application = get_wsgi_application()
