from django.urls import path

from web.views import Top

app_name = 'web'
urlpatterns = [
    path('', Top.as_view(), name='top'),
]
