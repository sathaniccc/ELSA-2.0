# VPS Deploy
## Docker
```bash
docker build -t elsa .
docker run -d --name elsa -p 3000:3000 --restart=always --env-file .env elsa
```
## PM2
```bash
npm i -g pm2
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```
