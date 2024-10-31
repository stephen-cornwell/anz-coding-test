'use strict'

import { format } from 'date-fns';

function createBadRequestResponse(errors) {
  return {
    fault: {
      code: "badRequest",
      httpStatus: 400,
      message: "You have supplied invalid request details",
      serverDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
      failures: errors
    }
  };
}

export default async function (fastify, _opts) {

  fastify.get('/customers/:id', async (request, reply) => {
    const { id } = request.params;

    // Validate
    if (!Number.isInteger(parseInt(id))) {
      return reply.status(400).send(createBadRequestResponse(['Customer id must be an integer']));
    }
    
    // Retrieve customer.
    const customer = await fastify.customerdb.getById(id);

    if (!customer) return reply.status(404).send();

    reply.send(customer);
  });

  fastify.post('/customers', async (request, reply) => {
    const { employeeId, firstname, lastname, address } = request.body;

    // Validate. 
    // Note: I'm aware of the schema based validation, but given the time contraints I've opted for manual validation 
    // to keep this simple. I expect there is a better way to tie schema validation to custom error reqponses. 
    const errors = [];
    if (!Number.isInteger(employeeId)) errors.push('employeeId must be an integer.');
    if (!firstname) errors.push("firstname is required.");
    if (!lastname) errors.push("lastname is required.");
    if (!address) errors.push("address is required.");
    if (errors.length) {
      return reply.status(400).send(createBadRequestResponse(errors));
    }

    // Store customer.
    await fastify.customerdb.create({ employeeId, firstname, lastname, address });

    reply.status(201).send();
  });
};