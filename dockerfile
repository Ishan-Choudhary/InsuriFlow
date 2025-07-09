#STARTING FROM NODE BASE IMAGE
FROM node:22 
#SETTING WORKING DIRECTORY AS APP
WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm install
COPY ./src/ /app

EXPOSE 3000

CMD ["npm", "run", "dev"]

# DB_HOST=db
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=357159
# DB_NAME=insurfolio_dev
#
# JWT_SECRET=secret-jwt
