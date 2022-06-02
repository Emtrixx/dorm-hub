# dorm-hub

## Requirements
- node
- npm
- vue-cli
- mongoDB
  
If you want to use Docker
- docker
- docker-compose
  
## First steps
  
In both the server and client folder run 
```
npm install 
```
before starting the first time or if dependencies change.

In the server folder run 
```
npm run dev
```
to start dev environment, by default the back-end will be reachable under localhost:8081.

For seeding the DB:

Have mongoDB running and in the server folder run
```
node seeds/index.js
```

In the client folder rename .env.dev to .env, so the client nows where to reach the backend and run 
```
npm run serve
```
to start dev environment. The site will be reachable under localhost:8082 by default. 


## Docker
If you want to use docker to check if the deployment works you can run
```
docker-compose up --build
```
and test if everything ist working correctly.

For seeding the DB inside the mongo container uncomment the seed section in the docker-compose.yml before executing.