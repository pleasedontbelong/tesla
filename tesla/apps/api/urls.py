from django.conf.urls import patterns, url, include

import views

from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = patterns(
    '',
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
)

urlpatterns += format_suffix_patterns(patterns(
    '',

    url(r'^messages/create$',
        views.MessagesCreateView.as_view(),
        name='message-create'),
    url(r'^messages/list/(?P<user>[^/]+)/(?P<last_seen_id>[0-9]*)$',
        views.MessagesView.as_view(),
        name='message-list'),
))
