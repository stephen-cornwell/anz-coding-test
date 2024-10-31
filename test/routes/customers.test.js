// test/customers.test.js
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

describe('Employee API Endpoints', function () {
    // Start the Fastify server before running tests
    before(async function () {
        await app.listen({ port: 3000 });
    });

    // Close the Fastify server after all tests are done
    after(async function () {
        await app.close();
    });

    // Test for creating a new employee
    describe('POST /customers', function () {
        it('should create a new employee and return the employeeId', async function () {
            const res = await chai.request(app.server)
                .post('/customers')
                .send({
                    employeeId: 1,
                    firstname: 'John',
                    lastname: 'Doe',
                    address: '456 Elm St'
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message', 'Employee created successfully');
            expect(res.body).to.have.property('employeeId', 1);
        });

        it('should return 400 for invalid employee data', async function () {
            const res = await chai.request(app.server)
                .post('/customers')
                .send({
                    // Missing required fields
                    firstname: 'Jane'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Bad Request');
        });

        it('should return 400 for duplicate employeeId', async function () {
            const res = await chai.request(app.server)
                .post('/customers')
                .send({
                    employeeId: 1, // This ID already exists
                    firstname: 'Another',
                    lastname: 'Doe',
                    address: '789 Oak St'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error', 'Employee ID already exists');
        });
    });

    // Test for getting an employee by ID
    describe('GET /customers/:employeeId', function () {
        it('should get an employee by ID', async function () {
            const res = await chai.request(app.server)
                .get('/customers/1');

            expect(res).to.have.status(200);
            expect(res.body).to.include({
                employeeId: 1,
                firstname: 'John',
                lastname: 'Doe',
                address: '456 Elm St'
            });
        });

        it('should return 404 for a non-existing employee', async function () {
            const res = await chai.request(app.server)
                .get('/customers/999'); // ID that doesn't exist

            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error', 'Employee not found');
        });
    });
});



// // test/customer.test.js
// const fastify = require('fastify')();
// const customerstore = require('../../plugins/customerstore'); // Adjust path as needed
// const chai = require('chai'); // Chai for assertions
// const chaiHttp = require('chai-http');
// const expect = chai.expect;

// // Register the SQLite customer plugin with Fastify
// fastify.register(customerstore);

// chai.use(chaiHttp);


// // import { use, expect } from 'chai'
// // import chaiHttp from 'chai-http'
// // const chai = use(chaiHttp)



// describe('Customer API Endpoints', function () {
//     // Start the Fastify server before running tests
//     before(async function () {
//         await fastify.listen({ port: 3000 });
//     });

//     after(async function () {
//         await fastify.close(); // Close the Fastify server after tests
//     });

//     // Test for creating a new customer
//     describe('POST /customers', function () {
//         it('should create a new customer and return a 201', async function () {
//             const response = await supertest(fastify.server)
//                 .post('/customers')
//                 .send({
//                     employeeId: 1,
//                     firstname: 'John',
//                     lastname: 'Doe',
//                     address: '456 Elm St'
//                 });

//             expect(response.status).to.equal(201);
//         });

//         it('should return 400 for invalid customer data', async function () {
//             const response = await supertest(fastify.server)
//                 .post('/customers')
//                 .send({
//                     // Missing required fields
//                     firstname: 'Jane'
//                 });

//             expect(response.status).to.equal(400);
//         });

//         it('should return 400 for duplicate customerId', async function () {
//             const response = await supertest(fastify.server)
//                 .post('/customers')
//                 .send({
//                   employeeId: 1, 
//                     firstname: 'Another',
//                     lastname: 'Doe',
//                     address: '789 Oak St'
//                 });

//             expect(response.status).to.equal(400);
//             expect(response.body).to.have.property('error', 'Customer ID already exists');
//         });
//     });

//     // Test for getting a customer by ID
//     describe('GET /customers/:id', function () {

      
//       it('should chaiHttp', async function () {
//         chai.request(fastify.server).get('/').end((err, res) => {
//           expect(res).to.have.status(200);
//         });
            

//         //expect(response.status).to.equal(200);
//     });


//       it('should get', async function () {
//         chai.request(fastify.server).get('/customer/1').end((err, res) => {
//           expect(res).to.have.status(200);
//         });
            

//         //expect(response.status).to.equal(200);
//     });


//       it('should get a customer by ID', async function () {
//             const response = await supertest(fastify.server)
//                 .get('/customer/1');

//             expect(response.status).to.equal(200);
//             expect(response.body).to.include({
//               employeeId: 1,
//                 firstname: 'John',
//                 lastname: 'Doe',
//                 address: '456 Elm St'
//             });
//         });

//         it('should return 404 for a non-existing customer', async function () {
//             const response = await supertest(fastify.server)
//                 .get('/customer/999'); // ID that doesn't exist

//             expect(response.status).to.equal(404);
//         });
//     });
// });
