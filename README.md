(This is a backup branch of the original 'main' branch right before the DevOps project started.)
# Application of SOLID Principles in a Node.js API

This project demonstrates the application of SOLID principles in a Node.js API.

## General Info
This project uses Sequelize as the ORM and a PostgreSQL database.

- Make sure you have PostgreSQL installed on your machine.
- The database configuration can be found under the path `/database/config.json`.
- Change the PostgreSQL username and password if needed.

## Features
- Implementation of SOLID principles
- Unit tests using Mocha
- High test coverage

## Postman Documentation
There is a Postman collection available under the path `/PostmanCollection/Back-End Challenge.postman_collection.json`. You can use it for testing purposes if needed.

## Running the Project
To run the project, follow these steps:

1. Run the following commands in the given order:
   - `npm run dev:db:create` to create a new database.
   - `npm run dev:db:migrate` to create the database structure.
   - `npm run dev:db:drop` to drop the database.
   - `npm start` to start the server on port 5050.

## Running the Tests
To run the tests, use the following commands:
- `npm run test` to run the unit tests.
- `npm run test:cov` to generate the test coverage.

This project can be used as a reference for developers looking to develop other applications following the SOLID principles in a Node.js environment.

## Front-End Integration
This API can be integrated with the following frontend:

[SOLID-UI](https://github.com/GRenkel/solid-ui)

Make sure to integrate this API with the frontend to enable full functionality.