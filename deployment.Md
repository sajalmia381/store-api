
# Deployment Store-Api App
## Build Docker Images
```sh
docker-compose -f docker-compose.api-deploy.yml build
```
## Up docker images
```sh
docker-compose -f docker-compose.api-deploy.yml up -d

docker-compose -f docker-compose.api-deploy.yml up --no-deps -d node-app
```

## Check deployment
```sh
docker ps
```

## Check deployment images
```sh
docker images
```