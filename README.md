# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).


## Assumptions

The customer schema provided contains an "employeeId", but the email accompanying it refers to customer and customer id. For the purposes of this test I have assumed "employeeId" to be the primary key for a customer. In a real world scenario I would clarify this requirement before proceeding. 


## Process

The application was boostrapped with fastify-cli. 

## Error handling.

Endpoints are allowing unhandled errors to bubble up to a global error handler configured in app.js. 