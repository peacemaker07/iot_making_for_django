from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from django.views.generic import TemplateView

decorators = [login_required, ]


@method_decorator(decorators, name='dispatch')
class Top(TemplateView):

    template_name = 'index.html'
