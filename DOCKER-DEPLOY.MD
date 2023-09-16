https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose

<!-- Mongo restore data from local machine database -->

```
docker exec -i store-mongo /usr/bin/mongodump --username root --password gCrm4Q8V8e --authenticationDatabase admin --db store-api --out ./dump

docker exec -i store-mongo /usr/bin/mongorestore --username root --password gCrm4Q8V8e --authenticationDatabase admin --db store-api ./dump/store-api
```
