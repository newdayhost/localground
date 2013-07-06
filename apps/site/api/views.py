from localground.apps.site.api import serializers
from localground.apps.site.api.permissions import IsOwnerOrReadOnly
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site.models import Photo, Audio, Project, Marker, EntityGroupAssociation
from django.contrib.auth.models import User, Group
from rest_framework import generics, renderers, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import django_filters
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import status
from localground.apps.site.lib.helpers import get_timestamp_no_milliseconds

class AuditCreate(object):
    
    def pre_save(self, obj):
        '''
        For database inserts
        '''
        from localground.apps.site.models import ObjectAuthority
        obj.owner = self.request.user
        obj.last_updated_by = self.request.user
        obj.timestamp = get_timestamp_no_milliseconds()
        
class AuditUpdate(object):
    def pre_save(self, obj):
        '''
        For database updates
        '''
        from localground.apps.site.models import ObjectAuthority
        obj.last_updated_by = self.request.user
        obj.timestamp = get_timestamp_no_milliseconds()



@api_view(('GET',))
@permission_classes((IsOwnerOrReadOnly, ))
def api_root(request, format=None):
    return Response({
        'photos': reverse('photo-list', request=request, format=format),
        'audio': reverse('audio-list', request=request, format=format),
        'projects': reverse('project-list', request=request, format=format),
        'users': reverse('user-list', request=request, format=format),
        'groups': reverse('group-list', request=request, format=format),
        'markers': reverse('marker-list', request=request, format=format)
    })

class PhotoViewSet(viewsets.ModelViewSet, AuditUpdate):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action. 
    """
    queryset = Photo.objects.select_related('project', 'owner').all()
    serializer_class = serializers.PhotoSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)

        
class AudioViewSet(viewsets.ModelViewSet, AuditUpdate):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Audio.objects.select_related('project', 'owner').all()
    serializer_class = serializers.AudioSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
    
class MarkerList(generics.ListCreateAPIView, AuditCreate):
    serializer_class = serializers.MarkerSerializerCounts
    permission_classes = (IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)

    paginate_by = 100
    
    def get_queryset(self):
        return Marker.objects.get_objects_with_counts(self.request.user)
    
    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
          
        
class MarkerDetail(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    queryset = Marker.objects.select_related('owner').all() #.prefetch_related('photos', 'audio', 'marker_set')
    permission_classes = (IsOwnerOrReadOnly,)
    serializer_class = serializers.MarkerSerializer
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        
class ProjectList(generics.ListCreateAPIView, AuditCreate):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)

    paginate_by = 100
    
    def get_queryset(self):
        user = self.request.user
        return Project.objects.select_related('owner').filter(owner=user)
    
    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
        obj.access_authority = ObjectAuthority.objects.get(id=1)
    
class ProjectDetail(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    queryset = Project.objects.select_related('owner').all() #.prefetch_related('photos', 'audio', 'marker_set')
    permission_classes = (IsOwnerOrReadOnly,)
    serializer_class = serializers.ProjectDetailSerializer
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
    
    
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    
class AttachItemView(generics.ListCreateAPIView, AuditCreate):
    queryset = EntityGroupAssociation.objects.all()
    serializer_class = serializers.AssociationSerializer

    '''
    def get(self, request, pk, format=None, *args, **kwargs):
        from localground.apps.site.models import Base
        object_name_plural = kwargs.get('object_name_plural')
        cls = Base.get_model(model_name_plural=object_name_plural)
        #o = self.get_object(object_name_plural, pk)
        objects = self.queryset.filter(group_type=cls.get_content_type(), group_id=pk)
        serializer = serializers.AssociationSerializer(objects)
        return Response(serializer.data)

    def post(self, request, pk, format=None, *args, **kwargs):
        serializer = serializers.AssociationSerializer(data=request.DATA)
        if serializer.is_valid():
            self.pre_save(serializer.object)
            self.object = serializer.save(force_insert=True)
            self.post_save(self.object, created=True)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED,
                            headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    '''
    
    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
        
        from localground.apps.site.models import Base
        pk = self.kwargs.get('pk')
        object_name_plural = self.kwargs.get('object_name_plural')
        cls = Base.get_model(model_name_plural=object_name_plural)
        setattr(obj, 'group_type', cls.get_content_type())
        setattr(obj, 'group_id', pk)