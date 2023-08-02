from rest_framework.response import Response


class CustomResponseMiddleware:
    """
    Middleware class for customizing responses in Django REST Framework.

    This middleware modifies the response object for each incoming HTTP request.
    If the request's path does not start with '/swagger', the middleware updates
    the response body depending on its status code. Successful responses (status
    codes less than 400) will be formatted with a 'success' status and original data.
    Failed responses (status codes 400 or greater) will be formatted with a 'fail'
    status, and the message will contain either the 'detail' field from the original
    data, or all the original data if 'detail' field is not present.

    Attributes:
    get_response: A callable used to get the response for a specific request.

    Methods:
    __call__(self, request): Method to make the middleware class callable.
    It is a special method in Python classes, allows the class instance to
    be called as a function, not a method.
    """

    def __init__(self, get_response):
        """
        Initialize the middleware with a callable to get the response.

        Args:
        get_response: A callable used to get the response for a specific request.
        """
        self.get_response = get_response

    def __call__(self, request):
        """
        Process the request and get the response. If the request's path does not
        start with '/swagger', format the response body.

        Args:
        request: The http request.

        Returns:
        The http response with potentially modified data.
        """
        response = self.get_response(request)

        if not request.path.startswith('/swagger'):
            if isinstance(response, Response):
                if response.status_code < 400:
                    response.data = {
                        'status': 'success',
                        'data': response.data
                    }
                else:
                    message = response.data.pop('detail', None)
                    response.data = {
                        'status': 'fail',
                        'data': {
                            'message': message or response.data,
                        }
                    }
            response._is_rendered = False
            response.render()
        return response
