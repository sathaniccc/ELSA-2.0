# Heroku Deploy
```bash
heroku create elsa-2025
heroku buildpacks:add heroku/nodejs
heroku config:set BOT_NAME=ELSA OWNER_NUMBER=91XXXXXXXXXX USE_PAIRING=false
git push heroku main
```
