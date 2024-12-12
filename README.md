## :wrench: Install

### :pencil: CMS

Copy/paste `.env.example` to `.env` and fill values needed


#### Run stack
```
docker-compose run soft-redirections-cms npm ci
```
- Create admin user (script not working for moment, create it from interface manually)
```
./scripts/initData.sh
```
- Create an API token from backoffice settings and copy/paste it in backend .env file (CMS_CDA_TOKEN)

- RAF cms : 
  -  script to init data ?
  - config webhook et voir si on peut les exporter dans le config-sync pour les avoir au setup du projet

### :factory: Backend

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-backend npm ci
```

- RAF backend : 
  - clean code
  - clean typescript

### :art: Frontend

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-frontend npm ci
```

- RAF frontend :
    - design
    - code redirection

## :arrow_forward: Start stack

```
docker compose up
```

> 
>**:bangbang: NOTE**  
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
