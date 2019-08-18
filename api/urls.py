from django.urls import path

from .views import IoTDevicesAPIView, EnvironmentGetDayAPIView

app_name = 'api'
urlpatterns = [
    path('iot_devices/', IoTDevicesAPIView.as_view(), name='iot_devices'),
    path('environment/day/', EnvironmentGetDayAPIView.as_view(), name='environment_day'),
]
