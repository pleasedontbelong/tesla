from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.response import Response
from rest_framework.views import APIView
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator


class SerializedResponse(APIView):
    """
    Provides methods to serialize and create a response object for an object
    or list of objects
    """
    paginate_by = 10
    paginator_class = Paginator

    # @method_decorator(csrf_exempt)
    # def dispatch(self, request, *args, **kwargs):
    #     # Initialize request before extending other ViewClass or else
    #     # TokenAuthentication won't work
    #     if 'HTTP_AUTHORIZATION' in request.META:
    #         request = self.initialize_request(request, *args, **kwargs)
    #         self.request = request
    #     return super(SerializedResponse, self).dispatch(request, *args, **kwargs)

    def get_list_response(self, items, serializer):
        """
        Return a Response object for a serialized list of elements
        """
        return self._get_serialized_response(items, serializer, True)

    def get_object_response(self, item, serializer):
        """
        Return a Response object for a serialized object
        """
        return self._get_serialized_response(item, serializer, False)

    def get_paginated_response(self, items, serializer):
        """
        Return a response object with a serialized list ob objects
        """
        serializer = self._get_paginated_serializer(items, serializer)
        return Response(serializer.data)

    def _get_serialized_response(self, items, serializer, many):
        """
        Serialize a list of items (objects) and initialize the response object
        """
        serializer = serializer(items, context={'request': self.request}, many=many)
        return Response(serializer.data)

    def _get_paginated_serializer(self, items, paginated_serializer,
                                  paginate_by=None):
        """
        Returns a serializer for a paginated list of objects
        """

        per_page = paginate_by or self.paginate_by

        if not per_page:
            raise AttributeError("PaginatedViewSet needs 'paginate_by' to be "
                                 "passed as a class attribute or parameter of "
                                 "the function.")

        paginator = self.paginator_class(items, per_page)

        page = self.request.QUERY_PARAMS.get('page')

        try:
            objects = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            objects = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999),
            # deliver last page of results.
            objects = paginator.page(paginator.num_pages)

        serializer_context = {'request': self.request}
        return paginated_serializer(objects, context=serializer_context)
