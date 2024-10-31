'use strict'

import { expect } from 'chai'
import sinon from 'sinon';
import Fastify from 'fastify';
import build from '../../app.js';

describe('Customer API Endpoints', function () {
  let app;
  let getByIdStub;
  let createStub;

  before(async function () {
    app = await build(Fastify());
  });

  after(async function () {
    await app.close();
  });

  beforeEach(() => {
    // Stub the methods of the customerdb module
    getByIdStub = sinon.stub(app.customerdb, 'getById');
    createStub = sinon.stub(app.customerdb, 'create');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /customers/:id', function () {
    it('should return a customer when given an existing id', async function () {
      const customer = { employeeId: '1', firstname: 'John', lastname: 'Doe', address: '456 Elm St' }
      getByIdStub.withArgs('1').resolves(customer);

      const response = await app.inject({
        method: 'GET',
        url: '/customers/1'
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);
      expect(payload).to.deep.equal(customer);
    });

    it('should return a 404 when given a non-existing id', async function () {
      getByIdStub.withArgs(99).resolves(null);

      const response = await app.inject({
        method: 'GET',
        url: '/customers/99'
      });

      expect(response.statusCode).to.equal(404);
    });
  });

  describe('POST /customers', function () { 
    it('should create a new customer when given a valid payload', async function () {
      const newCustomer = {
        employeeId: 101,
        firstname: 'Alice',
        lastname: 'Johnson',
        address: '789 Pine St'
      };
      createStub.resolves(newCustomer.employeeId);
      
      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: newCustomer
      });

      expect(response.statusCode).to.equal(201);
    });

    it('should return a bad request with validation errors when given an invalid payload', async function () {
      const newCustomer = {
        employeeId: 'M',
        firstname: null,
        // lastname: '', omitted to test validation
        address: ''
      };
      createStub.resolves(newCustomer.employeeId);
      
      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: newCustomer
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(400);
      expect(payload).to.have.property('fault');
      expect(payload.fault.code).to.equal('badRequest');
      expect(payload.fault.httpStatus).to.equal(400);
      expect(payload.fault.message).to.equal('You have supplied invalid request details');
      expect(payload.fault.failures).to.have.all.members([
        'employeeId must be an integer.', 
        'firstname is required.', 
        'lastname is required.',
        'address is required.'
      ]);
    });
    
    it('should return a server error when customerdb calls fail', async function () {
      // Created in the dummy "production" data in customerdb.js
      const customer = {
        employeeId: 1,
        firstname: 'Alice',
        lastname: 'Johnson',
        address: '789 Pine St'
      };
      createStub.rejects(new Error('DATABASE ERROR'));
  
      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: customer
      });
  
      const payload = JSON.parse(response.payload);
  
      expect(response.statusCode).to.equal(500);
      expect(payload).to.have.property('fault');
      expect(payload.fault.code).to.equal('internalError');
      expect(payload.fault.httpStatus).to.equal(500);
      expect(payload.fault.message).to.equal('An internal error was encountered processing the request');
      expect(payload.fault.failures).to.have.all.members([
        'DATABASE ERROR'
      ]);
    });
  });
});