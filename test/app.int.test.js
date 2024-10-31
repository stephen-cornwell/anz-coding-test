'use strict'

import { expect } from 'chai'
import Fastify from 'fastify';

import build from '../app.js';

describe('Integration Tests', function () {
  let app;

  before(async function () {
    app = await build(Fastify());
  });
  
  after(async function () {
    await app.close();
  });

  it('should be able to read from the customer database', async function () {
    const customer = { employeeId: 1, firstname: 'Adam', lastname: 'Smith', address: '123 Main St' };

    const response = await app.inject({
      method: 'GET',
      url: '/customers/1'
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).to.equal(200);
    expect(payload).to.deep.equal(customer);
  });

  it('should be able to write to the customer database', async function () {
    const customer = { employeeId: 1000, firstname: 'Adam', lastname: 'Smith', address: '123 Main St' };

    const response = await app.inject({
      method: 'POST',
      url: '/customers',
      payload: customer
    });

    expect(response.statusCode).to.equal(201);
  });

  it('should return a server error when customerdb calls fail', async function () {
    // Created in the dummy "production" data in customerdb.js
    const existingCustomer = {
      employeeId: 1,
      firstname: 'Alice',
      lastname: 'Johnson',
      address: '789 Pine St'
    };

    const response = await app.inject({
      method: 'POST',
      url: '/customers',
      payload: existingCustomer
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).to.equal(500);
    expect(payload).to.have.property('fault');
    expect(payload.fault.code).to.equal('internalError');
    expect(payload.fault.httpStatus).to.equal(500);
    expect(payload.fault.message).to.equal('An internal error was encountered processing the request');
    expect(payload.fault.failures).to.have.all.members([
      'SQLITE_CONSTRAINT: UNIQUE constraint failed: customers.employeeId'
    ]);
  });
});