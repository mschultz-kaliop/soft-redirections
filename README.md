# :wrench: Install

### :pencil: CMS

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-cms npm ci
```

- Create an API token (with "Unlimited" for duration and "Read Only" for type) from backoffice settings and copy/paste it in backend .env file (CMS_CDA_TOKEN)
- Create a Webhook with url `http://soft-redirections-backend:8080/handleRedirectionUrl`


----------------------------------
### :factory: Backend

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-backend npm ci
```


----------------------------------
### :art: Frontend

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-frontend npm ci
```


----------------------------------
## :arrow_forward: Start stack

```
docker compose up
```

> 
>**:information_source: NOTE**  
>In case of following error : 
>```
>soft-redirections-frontend      |  ERROR  [nitro] [uncaughtException] listen EADDRINUSE: address already in use /tmp/nitro/worker-99-1.sock
>```
>
> run this command : 
>```
>docker compose up --force-recreate
>```
>


----------------------------------
## :black_joker: Cheat scripts

:information_source: run them from backend container

To mock redirections in database

```
npm run mock
```

To generate Nginx file

```
npm run gen-nginx
```
