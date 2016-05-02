from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields
from django.contrib.auth.models import User

class CSVSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.CSVFile
        fields = (
            'csv_file_path',
            'dest_table',
            'project',
            'user')

    csv_file_path = serializers.CharField()
    dest_table = serializers.CharField()
    project = serializers.HyperlinkedRelatedField(
        view_name='project',
        read_only=True)
    user = serializers.HyperlinkedRelatedField(
        label='user',
        view_name='user-detail',
        read_only=True)
