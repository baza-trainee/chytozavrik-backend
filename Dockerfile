FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir /app

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

CMD bash -c "python manage.py collectstatic --no-input && \
    python manage.py migrate && \
    gunicorn -c gunicorn.conf.py chytozavrik.wsgi:application"
