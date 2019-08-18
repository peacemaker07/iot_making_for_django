from datetime import datetime

from rest_framework import serializers


class RequestGetDaySerilizer(serializers.Serializer):

    device_id = serializers.CharField(max_length=50, required=True)
    day = serializers.DateField(required=True)


class EnvironmentSerializer(serializers.Serializer):

    temp = serializers.SerializerMethodField()
    device_id = serializers.SerializerMethodField()
    humi = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()
    send_time = serializers.SerializerMethodField()
    loudness = serializers.SerializerMethodField()
    air_quality = serializers.SerializerMethodField()
    lux = serializers.SerializerMethodField()

    def get_temp(self, data):
        return data.get('temp')

    def get_device_id(self, data):
        return data.get('imsi')

    def get_humi(self, data):
        return data.get('humi')

    def get_timestamp(self, data):
        return data.get('timestamp')

    def get_send_time(self, data):
        timestamp = data.get('timestamp')
        if not timestamp:
            return ''
        return datetime.fromtimestamp(int(timestamp / 1000))

    def get_loudness(self, data):
        return data.get('loudness')

    def get_air_quality(self, data):
        return data.get('air_quality')

    def get_lux(self, data):
        return data.get('lux')
