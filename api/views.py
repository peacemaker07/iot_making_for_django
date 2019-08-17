import logging
from rest_framework import views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from api.serializers import RequestGetDaySerilizer, EnvironmentSerializer
from utils.comm_aws import CommAws

logger = logging.getLogger(__name__)


class EnvironmentGetDayAPIView(views.APIView):

    # permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):

        params = request.GET

        request_serializer = RequestGetDaySerilizer(data=params)
        if not request_serializer.is_valid():
            logger.debug("is_valid")
            return Response(status=status.HTTP_400_BAD_REQUEST, data=[])

        imsi = request_serializer.validated_data.get('imsi')
        day = request_serializer.validated_data.get('day')
        comm_aws = CommAws()
        res = comm_aws.req_day(imsi, day)
        if not res.ok:
            logger.error(res.json())
            return Response(status=status.HTTP_404_NOT_FOUND, data=[])

        json_data = res.json()
        # logger.debug(json_data)
        serializer = EnvironmentSerializer(json_data, many=True)

        return Response(status=status.HTTP_200_OK, data=serializer.data)
