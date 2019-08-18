import logging
from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from api.serializers import RequestGetDaySerilizer, EnvironmentSerializer, IoTDeviceSerializer
from utils.comm_aws import CommAws

logger = logging.getLogger(__name__)


class IoTDevicesAPIView(views.APIView):

    # permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):

        comm_aws = CommAws()
        res = comm_aws.req_iot_devices()
        res.raise_for_status()
        if not res.ok:
            logger.error(res.json())
            return Response(status=status.HTTP_404_NOT_FOUND, data=[])

        json_data = res.json()
        serializer = IoTDeviceSerializer(json_data, many=True)

        return Response(status=status.HTTP_200_OK, data=serializer.data)


class EnvironmentGetDayAPIView(views.APIView):

    # permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):

        params = request.GET

        request_serializer = RequestGetDaySerilizer(data=params)
        if not request_serializer.is_valid():
            logger.debug("is_valid")
            return Response(status=status.HTTP_400_BAD_REQUEST, data=[])

        device_id = request_serializer.validated_data.get('device_id')
        day = request_serializer.validated_data.get('day')
        comm_aws = CommAws()
        res = comm_aws.req_day(device_id, day)
        if not res.ok:
            logger.error(res.json())
            return Response(status=status.HTTP_404_NOT_FOUND, data=[])

        json_data = res.json()
        # logger.debug(json_data)
        serializer = EnvironmentSerializer(json_data, many=True)

        return Response(status=status.HTTP_200_OK, data=serializer.data)
