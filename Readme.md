#### for prod:

- from **frontend/next.config.js** change `hostname` variable
    ```py
        ...
        protocol: 'http',
        hostname: 'backendhost',
        pathname: '**',
        ...
    ```
- add `.env` file to root path and write variables from `.env_example` file with your credentials.
- add **frontend/**`.env` file and write variables from `.env_example` file with your credentials.
- add **backend/**`.env` file and write variables from `.env_example` file with your credentials.

## fix it
- add one global `.env` environment file or fix docker-compose.yml env variables from different `.env` files 
- hostname: 'backendhost' - use environment variable
- documents is not work if change filestorage binary to local
- auth requsts not work if change localhost to backend_app container_name in **frontend/**`.env` file and work if add public server url but request timeout is so long.
    ```
    NEXT_PUBLIC_SERVER_URL=http://localhost:8000/api/v1
    ```