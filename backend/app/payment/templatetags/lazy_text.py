from django import template

register = template.Library()

@register.filter
def lazy_text(value):
  return str(value).replace("\n", "<br/>") 