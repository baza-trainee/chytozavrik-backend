.PHONY: prod frontend_build frontend_export build run down clean drop_db backup auto_backup restore stop_backup

BACKUP_COMMAND := * * * * * cd "$(PWD)" && python3 scripts/backup.py

prod: down
	docker compose up -d --build

build:
	docker compose build

down:
	docker compose down

run:
	docker compose up -d

prod: down build run

clean:
	sudo find . | grep -E "(__pycache__|\.pyc|\.pyo$$)" | xargs sudo rm -rf
	rm 

drop_db: down
	docker volume rm $$(basename "$$(pwd)")_postgres_chytozavryk
	docker volume rm $$(basename "$$(pwd)")_redis_chytozavryk

auto_backup:
	@if crontab -l ; then \
		crontab -l > mycron ; \
	else \
		touch mycron ; \
	fi
	@echo '$(BACKUP_COMMAND)' >> mycron
	@crontab mycron
	@rm mycron
	@echo "Backup script added to cron"

stop_backup:
	crontab -l | grep -v '$(BACKUP_COMMAND)' | crontab -

backup:
	python3 scripts/backup.py
	@echo "Backup complete"

restore:
	python3 scripts/restore.py

frontend_build:
	docker cp frontend_app_chytozavryk:frontend_app/.next .
	tar -cJvf frontend.tar.xz .next

frontend_export:
	tar -xJvf frontend.tar.xz -C frontend/
