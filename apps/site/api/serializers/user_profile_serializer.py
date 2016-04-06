__author__ = 'zmmachar'
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields
from django.contrib.auth.models import User
from localground.apps.site.models.permissions import ObjectAuthority

class UserProfileSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.UserProfile
        fields = (
            'url',
            'id',
            'user',
            'first_name',
            'last_name',
            'email_announcements',
            'default_view_authority',
            'default_location',
            'contacts',
            'date_created',
            'time_stamp')
        depth = 1

    id = serializers.IntegerField(
        label='id',
        read_only=True)
    email_announcements = serializers.NullBooleanField(
        required=False,
        label='email_announcements')
    default_location = fields.GeometryField(
        required=False,
        allow_null=True,
        label='default_location')
    time_stamp = serializers.DateTimeField(required=False, label='time_stamp')
    user = serializers.HyperlinkedRelatedField(
        label='user',
        view_name='user-detail',
        read_only=True)
    first_name = serializers.SlugRelatedField(
        required=False,
        label='first_name',
        slug_field='first_name',
        queryset=User.objects.all(),
        source='user')
    last_name = serializers.SlugRelatedField(
        required=False,
        label='last_name',
        slug_field='last_name',
        queryset=User.objects.all(),
        source='user')
    contacts = serializers.RelatedField(
        many=True,
        label='contacts',
        read_only=True)
    date_created = serializers.DateTimeField(
        required=False,
        label='date_created')
    default_view_authority = serializers.ChoiceField(
        choices=map(lambda x: (x.name, x.name),ObjectAuthority.objects.all()),
        required=False,
        label='default_view_authority')

    # def restore_object(self, attrs, instance=None):
    #     """
    #     Given a dictionary of deserialized field values, either update
    #     an existing model instance, or create a new model instance.
    #     """
    #     if instance is not None:
    #         instance.id = attrs.get('id', instance.id)
    #         instance.email_announcements = attrs.get(
    #             'email_announcements',
    #             instance.email_announcements)
    #         instance.default_location = attrs.get(
    #             'default_location',
    #             instance.default_location)
    #         instance.time_stamp = attrs.get('time_stamp', instance.time_stamp)
    #         instance.user = attrs.get('user', instance.user)
    #         #instance.contacts = attrs.get('contacts', instance.contacts)
    #         instance.date_created = attrs.get(
    #             'date_created',
    #             instance.date_created)
    #         instance.default_view_authority = attrs.get(
    #             'default_view_authority',
    #             instance.default_view_authority)
    #         return instance
    #     return models.UserProfile(**attrs)
    def update(self, instance, validated_data):
        instance.id = validated_data.get('id', instance.id)
        instance.email_announcements = validated_data.get(
            'email_announcements',
            instance.email_announcements)
        instance.default_location = validated_data.get(
            'default_location',
            instance.default_location)
        instance.time_stamp = validated_data.get('time_stamp', instance.time_stamp)
        instance.user = validated_data.get('user', instance.user)
        instance.date_created = validated_data.get(
            'date_created',
            instance.date_created)
        instance.default_view_authority = ObjectAuthority.objects.get(name=validated_data.get('default_view_authority', instance.default_view_authority))
        instance.save()
        instance.user.first_name = validated_data.get('first_name')
        instance.user.last_name = validated_data.get('last_name')
        instance.user.save()
        return instance
    def create(self, validated_data):
        return models.UserProfile.objects.create(**validated_data)


