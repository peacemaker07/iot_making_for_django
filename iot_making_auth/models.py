from django.db import models
from django.conf import settings

from auth0.v3.authentication import GetToken


class AccessToken(models.Model):

    access_token = models.CharField('アクセストークン', max_length=1000)
    created = models.DateTimeField(auto_now_add=True, verbose_name="レコード生成日時")
    updated = models.DateTimeField(auto_now=True, verbose_name="レコード更新日時")

    @classmethod
    def create_access_token(cls):

        domain = settings.AUTH0_DOMAIN
        client_id = settings.AUTH0_CLIENT_ID
        client_secret = settings.AUTH0_CLIENT_SECRET
        api_audience = settings.API_AUDIENCE

        get_token = GetToken(domain)
        token = get_token.client_credentials(client_id, client_secret, api_audience)

        cls.objects.create(
            access_token=token['access_token'],
        )
