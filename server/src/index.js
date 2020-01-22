require('dotenv').config();
// Express App Setup
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid/v4');
// Config
const config = require('./config');
// Initialization
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Postgres client
const { Pool } = require('pg');
const pgClient = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDatabase,
  password: config.pgPassword,
  port: config.pgPort
});
pgClient.on('error', () => console.log('Lost Postgres connection'));
//Create table
pgClient
  .query(
    `
  CREATE TABLE IF NOT EXISTS employees (
    id uuid,
    employee_id integer NOT NUll,
    employee_name TEXT NOT NUll,
    PRIMARY KEY (id)
  )
`
  )
  .catch(err => console.log(err));

// Populate Table with Test Data
pgClient.query(`INSERT INTO employees (id, employee_id, employee_name) VALUES 
($1, $2, $3)`,
  [uuid(), 1, "George Foreman"]
)
pgClient.query(`INSERT INTO employees (id, employee_id, employee_name) VALUES 
($1, $2, $3)`,
  [uuid(), 2, "Samuel Jackson"]
)
pgClient.query(`INSERT INTO employees (id, employee_id, employee_name) VALUES 
($1, $2, $3)`,
  [uuid(), 3, "Jack Black"]
)
// Express route handlers
app.get('/test', (req, res) => {
  res.send('Working!');
});
// Get all employees
app.get('/v1/employees', async (req, res) => {
  const employees = await pgClient.query('SELECT * FROM employees');
  res.status(200).send(employees.rows);
});
// Get a single todo item
app.get('/v1/employees', async (req, res) => {
  const employee_name = req.params.employee_name;
const employees = await pgClient
    .query('SELECT * FROM employee WHERE employee_name = $1', [employee_name])
    .catch(e => {
      res
        .status(500)
        .send(`Encountered an internal error when fetching employee with name ${employee_name}`);
    });
res.status(200).send(employees.rows);
});
// Create an employee
app.post('/v1/employees?', async (req, res) => {
  console.log(req.body)
  const id = uuid();
  const employee_id = req.body.employee_id;
  const employee_name = req.body.employee_name;
  const employee = await pgClient
    .query(
      `INSERT INTO employees (id, employee_id, employee_name) VALUES 
    ($1, $2, $3)`,
      [id, employee_id, employee_name]
    )
    .catch(e => {
      res
        .status(500)
        .send(`Encountered an internal error when creating the employee ${req.body.employee_id}`, );
    });
res.status(201).send(`Employee created with ID:`);
});
// // Update a todo item
// app.put('/v1/items/:id', async (req, res) => {
//   const id = req.params.id;
//   const { item_name, complete } = req.body;
// await pgClient
//     .query(
//       `
//     UPDATE items SET item_name = $1, complete = $2 WHERE id = $3
//   `,
//       [item_name, complete, id]
//     )
//     .catch(e => {
//       res
//         .status(500)
//         .send('Encountered an internal error when updating an item');
//     });
// res.status(200).send(`Item updated with ID: ${id}`);
// });
// Delete a todo item
app.delete('/v1/employees/:id', async (req, res) => {
  const id = req.params.id;
await pgClient.query('DELETE FROM employees WHERE id = $1', [id]).catch(e => {
    res.status(500).send('Encountered an internal error when deleting an employee');
  });
res.status(200).send(`Employee deleted with ID: ${id}`);
});
// Server
const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));