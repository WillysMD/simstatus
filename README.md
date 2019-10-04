# Simstatus

Web inteface to easily manage Simutrans servers.

## Setup

You need a database server up and running. I have only tested PostgreSQL so that's what I recommend. But it should also work with MySQL/MariaDB.

You also need to install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

Clone this repository, then make a copy of the `backend/.env.example` file and set all the variables according to your setup.

Then run `docker-compose up` to build the docker images and start them. This might take a while depening on you server's specs.

When an update is available, simply run `git pull && docker-compose up --build`.

## Background

The goal of this project was mainly for me to get some hands on experience with Angular and more in depth knowledge of Django.
