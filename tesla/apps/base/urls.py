from django.conf.urls import patterns, url
from django.views.generic.base import TemplateView

urlpatterns = patterns(
    '',
    # Signup, signin and signout
    url(r'^$',
        TemplateView.as_view(template_name="home.html"),
        name='home'),
)
