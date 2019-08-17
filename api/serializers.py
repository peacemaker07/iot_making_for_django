from rest_framework import serializers


class RequestGetDaySerilizer(serializers.Serializer):

    imsi = serializers.CharField(max_length=50, required=True)
    day = serializers.DateField(required=True)


class EnvironmentSerializer(serializers.Serializer):

    temp = serializers.SerializerMethodField()
    imsi = serializers.SerializerMethodField()
    humi = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()
    loudness = serializers.SerializerMethodField()
    air_quality = serializers.SerializerMethodField()
    lux = serializers.SerializerMethodField()

    def get_temp(self, data):
        return data.get('temp')

    def get_imsi(self, data):
        return data.get('imsi')

    def get_humi(self, data):
        return data.get('humi')

    def get_timestamp(self, data):
        return data.get('timestamp')

    def get_loudness(self, data):
        return data.get('loudness')

    def get_air_quality(self, data):
        return data.get('air_quality')

    def get_lux(self, data):
        return data.get('lux')
