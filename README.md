![Python Version](https://img.shields.io/badge/python-3.11-blue.svg)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/docker-blue.svg)](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04)
[![Docker-compose](https://img.shields.io/badge/docker-compose-orange.svg)](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-22-04)
![Linux (Ubuntu)](https://img.shields.io/badge/linux-ubuntu-green.svg)

## Installation

To run the project, you will need [Docker](https://www.docker.com/) installed. Follow these steps to install and run the project:

1. Create a new folder for your project.

2. Open the project in an IDE

3. Initialize Git

    ```
    git init
    ```
4. Add the remote repository
    ```
    git remote add origin https://github.com/baza-trainee/chytozavrik-backend.git
    ```
5. Sync with the remote repository

    ```
    git pull origin dev
    ```
## Starting the Django project

1. create the configuration file `.env` for the database and user data from the example `.env_example`
2. Creating migrations.
```
python manage.py makemigrations
```
3. Update the database using migrations.
```
python manage.py migration
```
4. Create a super user and add it to the database.
```
python manage.py createsuperuser --noinput
```
#### The method for creating a super user has been changed. Now the superuser authorization data is passed to the `.env` file.
```
...
DJANGO_SUPERUSER_EMAIL = example@example.com
DJANGO_SUPERUSER_PASSWORD = example
...
```
5. Starting project
```
python manage.py runserver
```
For ease of development, creating containers, applying migrations and running the project was placed in the `Makefile` and can be run with the command
```
make init
```
If the project needs to be restarted, then a shortened project startup command was created in which the `python manage.py runserver` was placed.
```
make dev
```