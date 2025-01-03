## :wrench: Install

### :pencil: CMS

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-cms npm ci
```

- Create an API token from backoffice settings and copy/paste it in backend .env file (CMS_CDA_TOKEN)
- Create a Webhook "Unlimited" and "Read Only" with url `http://soft-redirections-backend:8080/handleRedirectionUrl`


----------------------------------
### :factory: Backend

Copy/paste `.env.example` to `.env` and fill values needed

#### Run stack
```
docker-compose run soft-redirections-backend npm ci
```

- RAF backend : 
  - nginx conf generation


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
