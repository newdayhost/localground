from django import test
from localground.apps.site.views import forms
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin, ModelMixin
from rest_framework import status
import urllib
		
class UpdateFormTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.form = self.create_form(name="Class Form")
		self.urls = [
			'/profile/forms/%s/' % self.form.id,
			'/profile/forms/%s/embed/' % self.form.id
		]
		self.view = forms.update_form_fields
		
	def test_add_fields(self, **kwargs):
		from localground.apps.site import models
		
		# add field to form:
		new_field_1 = models.Field(col_alias='Field 1', 
			data_type=models.DataType.objects.get(id=1),
			display_width=10,
			ordering=1,
			form=self.form
		)
		new_field_1.save(user=self.user)
		
		# add second field to form:
		new_field_2 = models.Field(col_alias='Field 2', 
			data_type=models.DataType.objects.get(id=4),
			display_width=10,
			ordering=1,
			form=self.form
		)
		new_field_2.save(user=self.user)
		
		self.assertEqual(2, len(self.form.get_fields()))
		
		# query the new form:
		self.assertEqual(len(self.form.get_data()), 0)

		
	def test_add_fields_view(self, **kwargs):
		from localground.apps.site.models import Field
		
		name = 'new name'
		description = 'new d'
		tags = 'a, b, c'
		
		# form should not have any fields:
		self.assertEqual(len(self.form.get_fields()), 0)
		
		# add 2 fields:
		data = {
			'name': name,
			'description': description,
			'tags': tags,
			'field-0-col_alias': 'my first column',
			'field-0-data_type': 1,
			'field-0-is_printable': 'on',
			'field-0-is_display_field': 'on',
			'field-1-col_alias': 'my second column',
			'field-1-data_type': 6,
			'field-1-is_printable': 'on',
		}
		management_form = {
			'field-TOTAL_FORMS': 2,
			'field-INITIAL_FORMS': 0,
			'field-MAX_NUM_FORMS': 1000
		}
		data.update(management_form)
		
		response = self.client.post(self.urls[0],
			data=urllib.urlencode(data),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		
		#successfully redirected
		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		
		# re-query 
		form = models.Form.objects.get(id=self.form.id)
		
		
		# form data should be changed
		self.assertEqual(form.name, name)
		self.assertEqual(form.description, description)
		self.assertEqual(form.tags, tags)
		
		# form should have 2 fields:
		fields = form.get_fields()
		self.assertEqual(len(fields), 2)

		'''
		from django.db import connection, transaction
		cursor = connection.cursor()
		
		# there should be a new table created with both fields present:
		for field in fields:
			#if an exception isn't thrown, it works
			a = cursor.execute('select %s from %s' % (field.col_name, field.form.table_name))		
		'''
		