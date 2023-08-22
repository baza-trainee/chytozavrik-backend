#!/usr/bin/env bash
# exit on error
set -o errexit

# create a virtual environment named 'venv'
python3 -m venv venv

# activate the virtual environment.
source venv/bin/activate

# upgrade pip in the virtual environment
pip install --upgrade pip

# install requirements in the virtual environment
pip install -r requirements.txt


python manage.py collectstatic --no-input
python manage.py migrate
python manage.py create_children_avatars
