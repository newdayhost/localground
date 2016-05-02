from rest_framework import generics
from localground.apps.site.models import CSVFile
from localground.apps.site.api.serializers import CSVSerializer
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
import sys
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import GEOSGeometry
from urllib import unquote
from rest_framework.decorators import api_view

class CSVList(QueryableListCreateAPIView):
    serializer_class = CSVSerializer
    model = CSVFile

    def get_queryset(self):
        return CSVFile.objects.all()


