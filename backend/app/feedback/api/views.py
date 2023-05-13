from rest_framework import status
from rest_framework import viewsets, generics, authentication, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action as detail_route, \
  api_view, permission_classes, authentication_classes
from django_filters.rest_framework import DjangoFilterBackend
from app.feedback.models import *
from app.feedback.api.serializers import *
from app.feedback.models import *
from utils.token import TokenAuthentication


class FeedbackCreate(generics.CreateAPIView):
  permission_classes = [permissions.AllowAny]
  authentication_classes = [TokenAuthentication]
  #search_fields = ["name"]

  queryset = Feedback.objects.all()
  serializer_class = FeedbackSerializer
  paginate_by = 20

  def get_serializer_context(self):
     return {'user': self.request.user}

  
  def create(self, request, *args, **kwargs):
    try:
      question = Questions.objects.get(pk=request.data.get('question'))
      data = request.data
      data['question'] = question
      Feedback.objects.create(**data)
    except Exception as e:
      serializer = FeedbackSerializer(data=request.data)
      serializer.is_valid(raise_exception=True)
      print('feedback error', e)
    
    
    return Response({
      'results': True
    })

@api_view(['GET'])
#@authentication_classes([authentication.BaseAuthentication])
@permission_classes([permissions.AllowAny])
def GetQuestion(request):
  questions = Questions.objects.all()
  data = QuestionSerializer(questions, many=True)

  return Response({
    'results': data.data
  })