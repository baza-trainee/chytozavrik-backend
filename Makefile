build:
	docker compose build

down:
	docker compose down

run:
	docker compose up -d

prod: down build run
