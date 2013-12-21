from django.db import models


class Message(models.Model):
    user = models.CharField(max_length=16)
    content = models.CharField(max_length=250)
    created = models.DateTimeField(auto_now_add=True)
