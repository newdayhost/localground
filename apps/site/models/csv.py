from django.contrib.gis.db import models
from datetime import datetime
from django.conf import settings
from localground.apps.site.models import (
    BaseMedia,
    StatusCode,
    BaseUploadedMedia,
    UploadSource,
    BaseExtents)

class CSVFile(BaseUploadedMedia):
    csv_file_path = models.CharField(max_length=255)
    dest_table = models.CharField(max_length=255)
