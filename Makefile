init: down build run
	sleep 1
	python manage.py migrate
	python manage.py runserver
	@echo "Init done, containers running"

build:
	docker compose build

down:
	docker compose down

run:
	docker compose up -d

prod: down build run

clean:
	sudo find . | grep -E "(__pycache__|\.pyc|\.pyo$$)" | xargs sudo rm -rf

dev:
	python manage.py runserver
