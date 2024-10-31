'use strict'

import path from 'node:path';
import autoload from '@fastify/autoload';
import { format } from 'date-fns';
import Fastify from 'fastify';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//export default async function (fastify, opts) {
async function build(fastify, opts) {
  if (fastify == null) fastify = Fastify(opts);

  // Place here your custom code!

  // Do not touch the following lines
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(autoload, {
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

  return fastify;
}

export default build;
export const options = {};

