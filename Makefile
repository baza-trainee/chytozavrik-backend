init: down build run
	sleep 1
	python manage.py migrate
	python manage.py runserver
	@echo "Init done, containers running"

prod: down build run

build:
	docker compose build

down:
	docker compose down

run:
	docker compose up -d

clean:
	sudo find . | grep -E "(__pycache__|\.pyc|\.pyo$$)" | xargs sudo rm -rf

dev:
	python manage.py runserver
