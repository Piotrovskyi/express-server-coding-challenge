# Express server coding challenge

## Pre-requisites
1. Install Docker and docker compose
```sh
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```
2. Or you will need node:18 to run app locally

## Fast start with docker (recommended)
1. Copy `.env.example` to `.env`
2. Run `docker compose up -d`
3. App will be up and running on port 3000
4. Postman collection is in the root of the repo
Startup script run migrations and seed automatically

## Fast start local
1. Copy `.env.example` to `.env`
2. You will need locally installed Postgres database v14 (https://www.postgresql.org/docs/14/tutorial-install.html)
3. `npm install`
4. `npm run sequelize -- db:migrate`
5. `npm run sequelize -- db:seed:all`
6. `npm run start`

## Environment vars
| Name| Description| Default Value|
| - | - | - |
|NODE_ENV|node env variable|"development"|
|PORT|web server port|3000|
|DATABASE_TYPE|database type|"postgres"|
|DATABASE_HOST|db host|"localhost"|
|DATABASE_PORT|db port|5432|
|DATABASE_USERNAME|db username|username|
|DATABASE_PASSWORD|db password|password|
|DATABASE_NAME|db name|"postgres"|

## Testing
The tests are written in Jest and supertest
Automated tests are running in `github actions`

### Running tests using NPM Scripts

```sh
npm run test -- --coverage
```

## ESLint
ESLint is a code linter that helps catch minor code quality and style issues.

### ESLint rules
All rules are configured through .eslintrc.json

### Running ESLint
```sh
npm run lint
```
