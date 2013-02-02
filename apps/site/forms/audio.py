#!/usr/bin/env python
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm
from localground.apps.site.models import Audio
        
class AudioForm(ModelForm):
    class Meta:
        from django import forms
        from localground.apps.site.widgets import PointWidget, PointWidgetHidden, \
                                            TagAutocomplete, CustomDateTimeWidget
        model = Audio
        fields = ('id', 'project', 'source_scan', 'source_marker', 'name',
                  'created_timestamp', 'attribution', 'description', 'point', 'tags')
        widgets = {
            'id': forms.HiddenInput,
            'point': PointWidgetHidden(), #PointWidget(map_width=300, map_height=200),
            'description': forms.Textarea(attrs={'rows': 3}), #any valid html attributes as attrs
            'source_scan': forms.HiddenInput,
            'created_timestamp': CustomDateTimeWidget,
            'source_marker': forms.HiddenInput,
            'tags': TagAutocomplete()
        }