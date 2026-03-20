require('dotenv').config();

const http = require('http');
const Router = require('./routing/Router');
const registerRoutes = require('./routing/routes');
const pool = require('./config/db');

const router = new Router();
registerRoutes(router);

pool.query('SELECT NOW()')
  .then(() => console.log('DB connected'))
  .catch((err) => console.error('DB connection error:', err));

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});