## SSH -Server
```sh
sudo ssh -i ~/Desktop/pem/storeApi.pem ubuntu@ec2-3-7-68-106.ap-south-1.compute.amazonaws.com
```

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

## Down docker images
```sh
docker-compose -f docker-compose.api-deploy.yml down -v
```

## Update Node App
```sh
docker-compose -f docker-compose.api-deploy.yml build node-app
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

## Get Limits log
```sh
docker logs --tail 50 --follow --timestamps store-mongo
```