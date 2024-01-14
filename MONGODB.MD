## Mongo Compass
```
mongodb://<USERNAME>:<PASSWORD>@3.7.68.106:27017
```

## Dump server DB

```shell
mongodump --host=storerestapi.com --port=27017 --USERNAME=<USERNAME> --authenticationDatabase=admin --out=/opt/backup/mongodump-2022-03-24

# NOt workable
mongodump -db=<K8s-DEPLOYMENT-SERVICE> --host="mongodb://<USERNAME>:<PASSWORD>@<SERVER-IP>:<DB-EXPOSED-PORT>/?authSource=admin" --out=./backup/mongodump-202-10-24


```
## mongodb Restore to server db

```shell
mongorestore mongodb://<USERNAME>:<PASSWORD>@3.7.68.106:27017 /opt/backup/mongodump-2022-03-24
```

## Access docker mongo container
```shell
docker exec -it store-api bash/sh
```
## Access mongosh from docker
```shell
mongosh -u <USERNAME> -p hello123
```


<!-- Localhost -->
## mongodb Restore to local
```shell
mongorestore --uri=mongodb://localhost:27017/store-api ./store-api
```

## Dump Store Api Database
```sh
mongodump --uri=mongodb://localhost:27017/store-api --out=./backup/db
```


## Dump Store Api Go Database
```sh
mongodump --uri=mongodb://localhost:27017/store-api-go --out=./backup/db
```

<!-- Accees via tunnel -->
```sh
sudo ssh -i ~/Desktop/pem/storeApi.pem ubuntu@ec2-3-7-68-106.ap-south-1.compute.amazonaws.com -L 27044:localhost:27044
```

<!-- Mongo Port forwarn via tunnel -->
```sh
sudo ssh -i ~/Desktop/pem/storeApi.pem ubuntu@ec2-3-7-68-106.ap-south-1.compute.amazonaws.com -L 27044:localhost:27017 -Nf
mongodb://<USERNAME>:<PASSWORD>@localhost:27044/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false
```

<!-- SSH forward Ports -->
```sh
ps aux | grep ssh
kill <id> // kill proccess
kill -9 <id> // Alternative to kill process
```

<!-- Docker mongo restore and dump -->
https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose

<!-- Mongo restore data from local machine database -->

```
docker exec -i store-mongo /usr/bin/mongodump --USERNAME <USERNAME> --password <PASSWORD> --authenticationDatabase admin --db store-api --out ./dump

docker exec -i store-mongo /usr/bin/mongorestore --USERNAME <USERNAME> --password <PASSWORD> --authenticationDatabase admin --db store-api ./dump/store-api
```
