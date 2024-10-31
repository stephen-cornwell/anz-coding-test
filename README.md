# ANZ Coding Test : Customer API
This project was bootstrapped with Fastify-CLI.

## Overview

The application was bootstrapped with fastify-cli. 

#### Data storage
Sqlite, stored on the file system (customers.db in the root).

Data access is via the customerdb plugin. The plugin initializes some dummy data to make evaluating the test easier. 

#### Error handling.

Endpoints are allowing unhandled errors to bubble up to a global error handler configured in app.js. 

#### Assumptions

The customer schema provided contains an "employeeId", but the email accompanying it refers to customer and customer id. For the purposes of this test I have assumed "employeeId" to be the primary key for a customer. In a real world scenario I would clarify this requirement before proceeding. 

# Run

The application was build on Node v20.18.0

From the root directory run:
```console 
npm install
```
To install packages. 

Then:
```console
npm run start
```
The app will start listening at [http://localhost:3000](http://localhost:3000).

Customer endpoints are available at [http://localhost:3000/customers/](http://localhost:3000/customers/) as per the swagger spec.

## Test

Using Mocha, Chai and Sinon.

Testing is not exhaustive, but meant to be indicative of understanding the tools. 

Run all tests:
```console
npm run test
```
Run unit tests:
```console
npm run test:unit
````
Run integration tests:
````console
npm run test:int
````