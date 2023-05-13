from rest_framework import status
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action as detail_route, \
  api_view, permission_classes, authentication_classes
from django_filters.rest_framework import DjangoFilterBackend
from app.page.models import *
from app.page.api.serializers import *
from app.page.models import *
from utils.token import TokenAuthentication


@api_view(['GET'])
#@authentication_classes([authentication.BaseAuthentication])
@permission_classes([permissions.AllowAny])
def GetPage(request, type):
  print('type', type)
  
  try:
    page = Page.objects.filter(code=type)
    serialize = PageSerializer(page, many=True)

    return Response({
      'results': serialize.data[0]
    })
  except Exception as e:

    return Response({
      'results': False
    })