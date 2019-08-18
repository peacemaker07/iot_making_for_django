import os


env = os.getenv('ENV')
if env == 'heroku':
    from .heroku import *
else:
    from .local import *
