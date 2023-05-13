from rest_framework.pagination import PageNumberPagination


#Пагинация
class LargeResultsSetPagination(PageNumberPagination):
  page_size = 1000
  page_size_query_param = 'page_size'
  max_page_size = 10000


class DefaultResultsSetPagination(PageNumberPagination):
  page_size = 30
  page_size_query_param = 'page_size'
  max_page_size = 30


class ResultsSetPaginationTen(PageNumberPagination):
  page_size = 10
  page_size_query_param = 'page_size'
  max_page_size = 10