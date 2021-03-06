from django.utils.safestring import mark_safe
from django.forms.widgets import TextInput
from django.contrib.auth.models import User
from django.conf import settings


class UserAutocomplete(TextInput):

    def __init__(
            self,
            autocomplete_url=None,
            allow_multiples=True,
            *args,
            **kw):
        self.autocomplete_url = autocomplete_url
        self.allow_multiples = allow_multiples
        if kw.get('autocomplete_url'):
            kw.pop('autocomplete_url')
        super(
            UserAutocomplete,
            self).__init__(
            *args,
            **kw)  # init parent Textarea class

    def render(self, name, value, attrs=None):
        # NOTE: self.form_instance is explicitly passed to widget during form
        #      initialization.  See "/account/forms/permissions.py" for sample.
        user = None
        try:
            user = self.form_instance.instance.owner
        except:
            try:
                user = self.form_instance.instance.user
            except:
                user = None
        username, user_id = '', ''
        if user is not None:
            username = user.username
            user_id = user.id

        if self.autocomplete_url is None:
            self.autocomplete_url = '/profile/get-contacts/json/'
        autocomplete_id = '%s_%s' % (attrs['id'], 'autocomplete')
        autocomplete_name = '%s_%s' % (name, 'autocomplete')
        html = '<input type="text" id="%s" name="%s" value="%s" autocomplete="off" data-provide="typeahead" class="typeahead" />' % \
            (autocomplete_id, autocomplete_name, username)

        js = '''
            <script type="text/javascript">
                //<![CDATA[
                    $('.typeahead').typeahead({
                        source: function (query, process) {
                            return $.getJSON(
                                '%s',
                                { q: query },
                                function (data) {
                                    var newData = [];
                                    $.each(data, function(){
                                        newData.push(this.label);
                                    });
                                    return process(newData);
                                });
                        }
                    });
                //]]>
                </script>
        ''' % self.autocomplete_url

        return mark_safe(html + js)

    def value_from_datadict(self, data, files, name):
        """
        Get user by username:
        """
        #user_id = data.get(name, None)
        username = data.get('%s_%s' % (name, 'autocomplete'), None)
        if username is not None:
            username = username.strip().split(' ')[0]
        try:
            user = User.objects.get(username=username.strip())
            return user.id
        except:
            pass
            return None
