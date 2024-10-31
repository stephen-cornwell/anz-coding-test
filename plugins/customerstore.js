'use strict'

const fp = require('fastify-plugin');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

// CUstomer database plugin.

module.exports = fp(async function (fastify, opts) {
  // Initialize and open SQLite database
  const db = await sqlite.open({
    filename: './customer.db',
    driver: sqlite3.Database
  });

  // Create the customers table if it does not exist
  await db.exec('DROP TABLE IF EXISTS customers');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      employeeId INTEGER PRIMARY KEY,
      firstname TEXT,
      lastname TEXT,
      address TEXT
    )
  `);

  // Encapsulate database operations to allow for mocking in tests.
  const customerdb = {
    async create(customer) {
      const { employeeId, firstname, lastname, address } = customer;
      try {
          const result = await db.run(
              `INSERT INTO customers (employeeId, firstname, lastname, address)
                VALUES (?, ?, ?, ?)`,
              employeeId, firstname, lastname, address
          );
          
          return result.lastID;
      } catch (error) {
          fastify.log.error(`Error creating customer: ${error.message}`);
          throw error;
      }
    },

    async getById(employeeId) {
        try {
            return await db.get(
                'SELECT * FROM customers WHERE employeeId = ?',
                employeeId
            );
        } catch (error) {
            fastify.log.error(`Error retrieving customer: ${error.message}`);
            throw error;
        }
    }
  };

  // Initialize some dummy "production" data.
  await customerdb.create({ employeeId: 1, firstname: 'Adam', lastname: 'Smith', address: '123 Main St' });
  await customerdb.create({ employeeId: 2, firstname: 'Bob', lastname: 'Jones', address: '456 Elm St' });
  await customerdb.create({ employeeId: 3, firstname: 'Charlie', lastname: 'Brown', address: '789 Oak St' });
  await customerdb.create({ employeeId: 4, firstname: 'David', lastname: 'Johnson', address: '101 Oak St' });
  await customerdb.create({ employeeId: 5, firstname: 'Eve', lastname: 'Williams', address: '202 Pine St' });
  await customerdb.create({ employeeId: 6, firstname: 'Frank', lastname: 'Miller', address: '303 Cedar St' });


  // Decorate Fastify instance with the customerdb object
  fastify.decorate('customerdb', customerdb);

  // Close the database on server shutdown
  fastify.addHook('onClose', async (instance, done) => {
      await db.close();
      done();
  });
});