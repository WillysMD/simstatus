# Simstatus

Web inteface to easily manage Simutrans servers.

## Setup

For now you need a database server up and running. I have only tested PostgreSQL so that's what I recommend. But it should also work with MySQL/MariaDB.

You must have [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

Clone this repository, then make a copy of `backend/.env.example` named `.env` and set all the variables according to your setup.

You also need to setup a Docker network named `nginx.docker` to enable networking between Docker containers. You can use this command`docker network create nginx.docker`.

Then run `docker-compose up -d` to build the docker images for the first time and start them. This might take a while depening on you server's specs.

When an update is available, simply run `git pull && docker-compose up -d --build`.

The app will be running on port `8001`.

## Background

The goal of this project was mainly for me to get some hands on experience with Angular and more in depth knowledge of Django.
