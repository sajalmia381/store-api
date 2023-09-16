
# Deployment Store-Api App
## Create Docker Store-Api Network
```sh
docker network create store-network
```
## Build Docker Images
```sh
docker-compose -f docker-compose.api-deploy.yml build
```
## Up docker images
```sh
docker-compose -f docker-compose.api-deploy.yml up -d

docker-compose -f docker-compose.api-deploy.yml up --no-deps -d node-app
```
## Up docker images
```sh
docker-compose -f docker-compose.api-deploy.yml down -v
```


## Check deployment
```sh
docker ps
```

## Check deployment images
```sh
docker images
```

## Get Limits log
```sh
docker logs --tail 50 --follow --timestamps store-mongo
```