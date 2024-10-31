'use strict'

import { expect } from 'chai'
import Fastify from 'fastify';
import fs from 'fs';
import build from '../app.js';

describe('Integration Tests', function () {
  let app;

  before(async function () {
    app = await build(Fastify());
  });

  after(async function () {
    await app.close();
  });

  it('should create the customer database', async function () {
    
    await app.inject({
      method: 'GET',
      url: '/customers/1'
    });

    const databaseExists = fs.existsSync('customer.db');

    expect(databaseExists).to.be.true;
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
});