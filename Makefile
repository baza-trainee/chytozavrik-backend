.PHONY: prod frontend_build frontend_export build run down clean drop_db backup auto_backup restore stop_backup

BACKUP_COMMAND := * * * * * cd "$(PWD)" && python3 scripts/backup.py

prod: down build run

build:
	docker compose build

down:
	docker compose down

run:
	docker compose up -d

clean:
	sudo find . | grep -E "(__pycache__|\.pyc|\.pyo$$)" | xargs sudo rm -rf

drop_db: down
	if docker volume ls -q | grep -q "$$(basename "$$(pwd)")_postgres_chytozavryk"; then \
		docker volume rm $$(basename "$$(pwd)")_postgres_chytozavryk; \
	fi
	sudo rm -rf ./media

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
	if [ -d frontend.tar.xz ]; then \
		sudo rm -rf frontend.tar.xz; \
	fi
	docker cp frontend_app_chytozavryk:frontend_app/.next .
	tar -cJvf frontend.tar.xz .next

frontend_export:
	if [ -d frontend/.next ]; then \
		sudo rm -rf frontend/.next; \
	fi
	tar -xJvf frontend.tar.xz -C frontend/
