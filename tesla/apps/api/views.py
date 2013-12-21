from messages.models import Message

from .mixins import SerializedResponse
from .serializers import MessageSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework import generics


class MessagesView(SerializedResponse, generics.ListAPIView):
    """
    List of website projects for a defined username.
    """
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated, )

    def list(self, request, last_seen_id):
        if last_seen_id:
            messages = Message.objects.filter(pk__gt=last_seen_id)
        else:
            messages = Message.objects.all()
        return self.get_list_response(messages,
                                      MessageSerializer)