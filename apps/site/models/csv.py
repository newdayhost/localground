from django.contrib.gis.db import models
from datetime import datetime
from django.contrib.auth.models import User
from django.conf import settings
from localground.apps.site.models import (
    BaseMedia,
    StatusCode,
    BaseUploadedMedia,
    UploadSource,
    BaseExtents,
    Project)

class CSVFile(BaseUploadedMedia):
    csv_file_path = models.CharField(max_length=255)
    dest_table = models.CharField(max_length=255)
    user = models.ForeignKey(User, related_name="csv")
    