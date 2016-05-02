# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0015_csvfile'),
    ]

    operations = [
        migrations.AddField(
            model_name='csvfile',
            name='user',
            field=models.ForeignKey(related_name='csv', default=None, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
