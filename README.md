## :wrench: Install

### :pencil: CMS

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-cms npm ci
```
- Create admin user by executing next script in cms docker container
```
./scripts/initData.sh
```
- Create an API token from backoffice settings and copy/paste it in backend .env file (CMS_CDA_TOKEN)
- Create a Webhook "Unlimited" and "Read Only" with url `http://localhost:8080/...` 

- RAF cms : 
  -  script to init data ?


----------------------------------
### :factory: Backend

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-backend npm ci
```

- RAF backend : 
  - clean code
  - clean typescript


----------------------------------
### :art: Frontend

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-frontend npm ci
```

- RAF frontend :
    - design
    - code redirection


----------------------------------
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
