python manage.py collectstatic
python manage.py migrate
gunicorn -c gunicorn.conf.py chytozavrik.wsgi:app