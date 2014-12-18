from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
import simplejson as json
from localground.apps.site.models import Project


@login_required()
def show_chart_viewer(request):
    context = RequestContext(request)
    return render_to_response('charts/chart_viewer.html', context)

@login_required()
def show_chart_editor(request):
    context = RequestContext(request)
    return render_to_response('charts/chart_editor.html', context)
