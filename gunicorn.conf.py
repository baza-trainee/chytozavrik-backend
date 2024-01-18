from multiprocessing import cpu_count
import os

bind = f"0.0.0.0:{os.getenv('BACKEND_PORT', default=8000)}"
worker_class = "gthread"
workers = cpu_count() * 2 + 1
threads = 2
loglevel = "debug"
