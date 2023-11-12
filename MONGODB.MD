## Mongo Compass
```
mongodb://root:gCrm4Q8V8e@3.7.68.106:27017
```

## Dump server DB

```shell
mongodump --host=storerestapi.com --port=27017 --username=root --authenticationDatabase=admin --out=/opt/backup/mongodump-2022-03-24

# NOt workable
mongodump -db=klovercloud-cost-management-security-server --host="mongodb://root:KuUQdSchulgdjZWQ@116.202.169.133:27035/?authSource=admin" --out=./backup/mongodump-202-10-24


```
## mongodb Restore to server db

```shell
mongorestore mongodb://root:gCrm4Q8V8e@3.7.68.106:27017 /opt/backup/mongodump-2022-03-24
```

## Access docker mongo container
```shell
docker exec -it store-api bash/sh
```
## Access mongosh from docker
```shell
mongosh -u root -p hello123
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