# Mobile proto

## Deploy

Run `scripts/deploy-rc.sh`

1. Prepare Heroku-compatible version in own branch (e.g. remove jwkToPem.default)
2. Run Deploy workflow in Github Action

## Infra

```
aws-vault exec ****** -- yarn workspace infra deploy
```
