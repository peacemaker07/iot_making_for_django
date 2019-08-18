from .base import *
import django_heroku


DEBUG = False

django_heroku.settings(locals())

# https://stackoverflow.com/questions/52311724/500-error-when-debug-false-with-heroku-and-django
DEBUG_PROPAGATE_EXCEPTIONS = True

SECRET_KEY = os.getenv('SECRET_KEY')

# auth0
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = os.getenv('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = os.getenv('AUTH0_CLIENT_SECRET')
API_AUDIENCE = os.getenv('API_AUDIENCE')

# aws
API_GATEWAY_URL = os.getenv('API_GATEWAY_URL')
API_GATEWAY_STAGE = 'dev'
