from django.urls import path

from .views import EnvironmentGetDayAPIView

app_name = 'api'
urlpatterns = [
    path('environment/day/', EnvironmentGetDayAPIView.as_view(), name='environment_day'),
]
