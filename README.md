# Northcoders House of Games API

## Background

During the north coders course we were tasked with building an API for the purpose of accessing application data programmatically. The intention here is to mimick the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.
The database is PSQL and we interact with it using [node-postgres](https://node-postgres.com/)

Project time: 1 week

## Setting up the project

You must have node.js installed (17.0.1)
You must have psql installed (12.9)

Clone this repo by clicking the green 'code' link at the top of this page, copy your prefered link or download the code.

Once Cloned / downloaded, you will need to install the packages:
``npm install``

You will need to create _two_ `.env` files for this project: `.env.test` and `.env.development`.
Into each, add `PGDATABASE=nc_games_test` and `PGDATABASE=nc_games` respectivly.
You will also need to add `PGPASSWORD=` followed by the password you selected during the PSQL setup.

Create the databases:
``npm run setup-dbs``

Seed the databases:
``npm run seed``

start the api:
``npm start``

## Running Tests

You can run the tests using Jest commands:
``npm test app``
tests may take upto 40 seconds to complete.

## Connecting to the Api

you can connect to the API using thunder client / insomnia / postman using localhost:9090/api

## Live Version

[On Heroku](https://nc-project-1.herokuapp.com/api)
