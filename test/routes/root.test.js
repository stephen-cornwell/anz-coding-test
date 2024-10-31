'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const { build } = require('../helper')

test('default root route', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/'
  })
  assert.deepStrictEqual(JSON.parse(res.payload), { root: true })
})

// inject callback style:
//
// test('default root route', (t) => {
//   t.plan(2)
//   const app = await build(t)
//
//   app.inject({
//     url: '/'
//   }, (err, res) => {
//     t.error(err)
//     assert.deepStrictEqual(JSON.parse(res.payload), { root: true })
//   })
// })



const chai = require('chai');
const chaiHttp = require('chai-http');
const fastify = require('fastify');
const customerstore = require('../../plugins/customerstore'); 

// Configure Chai to use chai-http for HTTP assertions
chai.use(chaiHttp);
const { expect } = chai;

// Initialize Fastify instance and register the plugin
const app = fastify();
app.register(customerstore);

describe('Application root', function () {
    // Start the Fastify server before running tests
    before(async function () {
      try {
        app.log.level = 'debug'
        await app.listen({ port: 3001 }); // Specify port for testing
      } catch (err) {
        console.error("Error starting Fastify server:", err);
      }
    });

    // Close the Fastify server after all tests are done
    after(async function () {
        await app.close();
    });

    describe('GET /', async function () {
        it('should return 200', async function () {
            const res = await chai.request(app.server).get('/');

            expect(res).to.have.status(200);
        });
    });
});
