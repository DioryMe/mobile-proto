# Mobile proto

## Server

```
heroku git:remote -a mobile-proto-server
git subtree push --prefix apps/mobile-server heroku main
```

## Infra

```
aws-vault exec ****** -- yarn workspace infra deploy
```
