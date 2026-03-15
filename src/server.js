const http = require('http');
require('dotenv').config();
const pool = require('./config/db');
const Router = require('./routing/Router');

const router = new Router();

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

pool.query('SELECT NOW()')
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));

server.listen(3000, () => {
  console.log("Server running on port 3000");
});