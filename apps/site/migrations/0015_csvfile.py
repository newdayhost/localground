# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields
from django.conf import settings
import localground.apps.lib.helpers


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0014_auto_20160420_1907'),
    ]

    operations = [
        migrations.CreateModel(
            name='CSVFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution', models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('csv_file_path', models.CharField(max_length=255)),
                ('dest_table', models.CharField(max_length=255)),
                ('last_updated_by', models.ForeignKey(related_name='site_csvfile_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(related_name='csvfile+', to='site.Project')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
