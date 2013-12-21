from django.conf.urls import patterns, include, url
from django.conf import settings

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += patterns('django.contrib.staticfiles.views',
                            url(r'^static/(?P<path>.*)$', 'serve'),
                            )

urlpatterns += (
    url(r'^api/', include('api.urls')),

    url(r'^', include('base.urls')),
)
