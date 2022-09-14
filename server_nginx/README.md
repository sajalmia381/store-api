## Install nginx in ubuntu
```bash
sudo apt install nginx
```

## Deploy nginx server file **
Put default and storeApi file in site-available directory
  ### Edit files
  ```bash
  sudo nano /etc/nginx/sites-available/default
  sudo nano /etc/nginx/sites-available/storeApi
  ```
  
## Check NGINX config
```bash
sudo nginx -t
```

## Restart NGINX
sudo service nginx restart

# Add SSL with LetsEncrypt
```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Only valid for 90 days, test the renewal process with
certbot renew --dry-run
```

## Alternative
```bash
sudo apt install certbot python3-certbot-nginx
```

Now visit https://yourdomain.com and you should see your Node app