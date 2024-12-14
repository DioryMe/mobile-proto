## Mobile-proto-server

## Run

Start redis:

```
docker run --name redis-local -p 6379:6379 -d redis
```

Start server:

```
yarn start:dev
```

## Endpoints

Diograph:

http://localhost:3000/room/diograph

Content:

http://localhost:3000/room/content?cid=bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji&mime=video/mp4

Thumbnail:

http://localhost:3000/room/thumbnail?dioryId=5456c2c3-4a69-4d80-bd2f-caa9945cff71

## Server deploy

```
# Deploying a subtree to Heroku doesn't work this simple...
heroku git:remote -a mobile-proto-server
git subtree push --prefix apps/mobile-server heroku main
```

Gives error:

```
$ git subtree push --prefix apps/mobile-server heroku main
git push using:  heroku main
To https://git.heroku.com/***.git
 ! [rejected]        1f8688cd13a886c624cbe24b7e9994eaa7f49336 -> main (non-fast-forward)
error: failed to push some refs to 'https://git.heroku.com/***.git'
```

Solution

```
git subtree split --prefix apps/mobile-server -b heroku-deploy
git checkout heroku-deploy
git cherry-pick 020b4a1
git push heroku heroku-deploy:main --force
```
