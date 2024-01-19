import os

bind = f"0.0.0.0:{os.getenv('BACKEND_PORT', default=8000)}"
worker_class = "gthread"
workers = 2
loglevel = "debug"
