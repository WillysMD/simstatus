FROM python:3.7

ENV PYTHONUNBUFFERED 1

RUN apt-get install gcc subversion zlib1g-dev libbz2-dev

EXPOSE 8000/tcp

COPY ./ /django
COPY Pipfile /django
COPY Pipfile.lock /django
WORKDIR /django

RUN pip install pipenv && pipenv install --deploy --ignore-pipfile --dev
RUN pipenv run python manage.py migrate

CMD pipenv run gunicorn -b 0.0.0.0:8000 -w 2 -n simstatus simuhead.wsgi:application --reload
