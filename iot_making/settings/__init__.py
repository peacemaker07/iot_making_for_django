import os


env = os.getenv('ENV')
github_run_id = os.getenv('GITHUB_RUN_ID')
if env == 'heroku':
    from .heroku import *
elif github_run_id:
    from .github import *
else:
    from .local import *
