## Dump server DB

```shell
mongodump --host=storerestapi.com --port=27017 --username=<USERNAME> --authenticationDatabase=admin --out=/opt/backup/mongodump-2022-03-24
```

## mongodb Restore to server db

```shell
mongorestore mongodb://<USERNAME>:hello123@52.66.223.120:27017 /opt/backup/mongodump-2022-03-24
```
