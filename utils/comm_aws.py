import json
import requests
from datetime import datetime, timedelta

from django.conf import settings
from iot_making_auth.models import AccessToken
from iot_making_auth.utils import is_token_expired
from utils.unix_time import UnixTime


class CommAws:

    base_url = f'{settings.API_GATEWAY_URL}/{settings.API_GATEWAY_STAGE}'

    def req_day(self, device_id, target_date):

        target_date_str = target_date.strftime('%Y-%m-%d')
        datetime_from = datetime.strptime(target_date_str + ' 00:00:00', '%Y-%m-%d %H:%M:%S')
        datetime_to = datetime.strptime(target_date_str + ' 23:59:59', '%Y-%m-%d %H:%M:%S')

        unix_time_from = UnixTime.date_time2unix_time(datetime_from)
        unix_time_to = UnixTime.date_time2unix_time(datetime_to)

        payload = {'device_id': device_id, 'from': unix_time_from, 'to': unix_time_to}
        return self.request_get(self.base_url + '/environment/range', payload)

    def req_iot_devices(self):

        return self.request_get(self.base_url + '/iot_devices', {})

    def request_get(self, url, payload):

        access_token_obj = AccessToken.objects.all().order_by('-created').first()
        if not access_token_obj:
            AccessToken.create_access_token()
            access_token_obj = AccessToken.objects.all().order_by('-created').first()

        res = self._requests(url, payload, access_token_obj.access_token)

        if res.ok:
            return res

        json_dict = json.loads(res.text)
        if is_token_expired(json_dict):
            AccessToken.create_access_token()
            access_token_obj = AccessToken.objects.all().order_by('-created').first()

        res = self._requests(url, payload, access_token_obj.access_token)

        return res

    def _requests(self, url, payload, access_token):

        headers = {'authorization': f'Bearer {access_token}'}
        res = requests.get(url, headers=headers, params=payload)

        return res


