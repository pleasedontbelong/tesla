from messages.models import Message

from .mixins import SerializedResponse
from .serializers import MessageSerializer

from rest_framework import generics


class MessagesView(SerializedResponse, generics.ListAPIView):
    """
    List of website projects for a defined username.
    """
    serializer_class = MessageSerializer

    def list(self, request, user, last_seen_id):
        if last_seen_id:
            messages = Message.objects.filter(pk__gt=last_seen_id).exclude(user=user).order_by('-created')
        else:
            messages = Message.objects.exclude(user=user).order_by('-created')[:5]
        return self.get_list_response(messages,
                                      MessageSerializer)


class MessagesCreateView(SerializedResponse, generics.CreateAPIView):
    """
    List of website projects for a defined username.
    """
    serializer_class = MessageSerializer

    def post(self, *args, **kwargs):
        return super(MessagesCreateView, self).post(*args, **kwargs)
