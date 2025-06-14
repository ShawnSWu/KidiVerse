# Docker Comprehensive Guide

Welcome to this **comprehensive** guide about **Docker** — the containerization platform that is revolutionizing software development and deployment.

---

## Table of Contents

1. [Introduction](#introduction)
2. [What is Docker?](#what-is-docker)
3. [Key Concepts](#key-concepts)
4. [Docker Installation](#docker-installation)
5. [Basic Docker Commands](#basic-docker-commands)
6. [Dockerfile Explained](#dockerfile-explained)
7. [Docker Compose](#docker-compose)
8. [Advanced Topics](#advanced-topics)
9. [Resources](#resources)

---

### Introduction

Docker enables developers to package applications into containers—standardized executable components combining application source code with the operating system libraries and dependencies required to run that code in any environment.

---

#### What is Docker?

> Docker is an open platform for developing, shipping, and running applications.

- Allows **containerization** of applications.
- Supports **microservices architecture**.
- Provides **portability** and **consistency** across environments.

---

##### Key Concepts

| Concept     | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| Container   | Lightweight, standalone, executable package of software                     |
| Image       | Read-only template used to create containers                                |
| Dockerfile  | Text file with instructions to build a Docker image                         |
| Registry    | Repository to store and distribute Docker images (e.g., Docker Hub)         |
| Volume      | Persistent storage independent of container lifecycle                       |

---

###### Docker Installation

``` bash
# On Ubuntu
sudo apt update
sudo apt install docker.io

# On Mac & Windows
# Download from https://www.docker.com/products/docker-desktop


Docker Compose
Docker Compose allows you to define and run multi-container Docker applications.

Example docker-compose.yml:

```yaml
version: '3'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
  db:
    image: mysql:5.7
    environment:
      - MYSQL_ROOT_PASSWORD=secret
```