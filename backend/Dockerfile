FROM python:3.7-buster

ENV PYTHONUNBUFFERED 1

RUN apt-get install gcc subversion zlib1g-dev libbz2-dev

EXPOSE 8000/tcp

COPY ./ /simstatus/backend
WORKDIR /simstatus/backend

RUN pip install pipenv && pipenv install --deploy --ignore-pipfile
RUN pipenv run python manage.py migrate

CMD pipenv run gunicorn -b 0.0.0.0:8000 -w 2 simuhead.wsgi:application
