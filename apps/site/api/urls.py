from django.conf.urls import patterns, url
from django.conf.urls import include
from localground.apps.site.api import views
from localground.apps.site import models
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns

entities = ['audio', 'photos', 'map-images']

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'photos', views.PhotoViewSet)
router.register(r'audio', views.AudioViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
#router.register(r'markers', views.MarkerViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^$', views.api_root),
    #url(r'^projects/(?P<pk>[0-9]+)/attach/$',
    #    views.AttachElement.as_view(), name='photos-attach'),
    url(r'^', include(router.urls[1:])), # a hack to include both ViewSets and views on the front page
    
        
    #url(r'^', views.api_root),
)

urlpatterns += format_suffix_patterns(patterns('',
    url(r'^(?P<group_name_plural>markers|views)/(?P<group_id>[0-9]+)/(?P<entity_name_plural>%s)/$' % '|'.join(entities), views.RelatedMediaList.as_view(), name='related-media-list'),
    url(r'^(?P<group_name_plural>markers|views)/(?P<group_id>[0-9]+)/(?P<entity_name_plural>%s)/(?P<id>[0-9]+)/$' % '|'.join(entities), views.RelatedMediaInstance.as_view(), name='related-media-detail'),
    url(r'^projects/(?P<pk>[0-9]+)/$', views.ProjectInstance.as_view(), name='project-detail'),
    url(r'^projects/$', views.ProjectList.as_view(), name='project-list'),
    url(r'^markers/(?P<pk>[0-9]+)/$', views.MarkerInstance.as_view(), name='marker-detail'),
    url(r'^markers/$', views.MarkerList.as_view(), name='marker-list'),
))


