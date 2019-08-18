from .base import *
import iot_making.secret as secret


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = secret.SECRET_KEY

# auth0
AUTH0_DOMAIN = secret.AUTH0_DOMAIN
AUTH0_CLIENT_ID = secret.AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET = secret.AUTH0_CLIENT_SECRET
API_AUDIENCE = secret.API_AUDIENCE

# aws
API_GATEWAY_URL = secret.API_GATEWAY_URL
API_GATEWAY_STAGE = 'dev'
