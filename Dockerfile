FROM node:20.11.1-bullseye

RUN mkdir /api

WORKDIR /api

RUN apt update -y
