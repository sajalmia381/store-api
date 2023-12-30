## SSH -Server
```sh
sudo ssh -i ~/Desktop/pem/storeApi.pem ubuntu@ec2-3-7-68-106.ap-south-1.compute.amazonaws.com
```

# Deployment Store-Api App

## Create Docker Store-Api Network
```sh
docker network create store-network
```

## 01. Build Typescript node app
```sh
npm run build
```

### 02. Build docker image for multipe build architect
```sh
docker buildx use store-builder
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t storerestapi/store-api-node:1.0.0 -f Dockerfile2 --push .
docker buildx imagetools create -t storerestapi/store-api-node:1.0.0 storerestapi/store-api-node:latest
```

## Up docker images
```sh
docker-compose -f docker-compose.api.yml up -d
docker-compose -f docker-compose.api.yml up --no-deps -d node-app
```

## Restart Service
```sh
docker-compose -f docker-compose.api.yml restart node-app --no-deps
```

## Down docker images
```sh
docker-compose -f docker-compose.api.yml down -v
```

## Update Node App
```sh
docker-compose -f docker-compose.api.yml build node-app
docker-compose -f docker-compose.api.yml up --no-deps -d node-app
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


# Resources Doc

## Build Docker Images
```sh
docker-compose -f docker-compose.api.yml build
```

### Build docker image for multipe build architect
```sh
docker buildx ls
docker buildx create --name store-builder
docker buildx use store-builder
docker buildx inspect --bootstrap
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t storerestapi/store-api-node:latest -f Dockerfile2 --push .
docker run --name store-api -d -p 8000:8000 storerestapi/store-api-node:latest:943e28233b51
```