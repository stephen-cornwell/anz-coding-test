'use strict'

const path = require('node:path');
const AutoLoad = require('@fastify/autoload');
const { format } = require('date-fns');
const fastifyPrintRoutes = require("fastify-print-routes");

// Pass --options via CLI arguments in command to enable these options.
const options = {}

module.exports = async function (fastify, opts) {
  await fastify.register(fastifyPrintRoutes, { colors: true });
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })

  // Global error handler for errors not managed within the application.
  fastify.setErrorHandler(function (error, request, reply) {
    this.log.error(error)

    reply.status(500).send({
      "fault": {
        "code": "internalError",
        "httpStatus": 500,
        "message": "An internal error was encountered processing the request",
        "serverDateTime": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
        "failures": [error.message]
      }
    });
  })
}

module.exports.options = options
