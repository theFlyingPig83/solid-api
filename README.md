# General Info
This project uses sequelize as ORM and also uses a Postgres database
### `make sure you have postgres on your machine`
### `the database config can be found under the path /database/config.json`
### `CHANGE YOUR POSTGRES USER AND PASSWORD IF NEEDED`

# POSTMAN DOC
There is a postman collection under the path /PostmanCollection/Back-End Challenge.postman_collection.json
Use it for testing if needed

## Running the project
### run the following commands in the given order
### `npm run dev:db:create` will create a new database
### `npm run dev:db:migrate` will create the database structure
### `npm run dev:db:drop` will drop the database
### `npm start` will start the server on port 5050

## Running the tests
### `npm run test` will run the unit tests
### `npm run test:cov` will generate the test coverage
