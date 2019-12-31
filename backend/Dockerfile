FROM python:3.8-buster

ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get -y install gcc subversion zlib1g-dev libbz2-dev postgresql

EXPOSE 9000/tcp

COPY ./ /simstatus/backend
WORKDIR /simstatus/backend

RUN pip install pipenv && pipenv install --deploy --ignore-pipfile
RUN pipenv run python manage.py migrate

CMD pipenv run gunicorn -b 0.0.0.0:9000 -w 2 -t 300 simuhead.wsgi:application
