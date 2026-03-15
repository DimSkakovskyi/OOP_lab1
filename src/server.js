const http = require('http');
const Router = require('./routing/Router');

const router = new Router();

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});