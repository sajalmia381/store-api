
## Deployment Store-Api App
```sh
docker-compose -f docker-compose.api-deploy.yml up -d

docker-compose -f docker-compose.api-deploy.yml up --no-deps -d store-api // not work
```

## Check deployment
```sh
docker ps
```

## Check deployment images
```sh
docker images
```