class Router {
  constructor() {
    this.routes = [];
  }

  register(method, path, handler) {
    this.routes.push({ method, path, handler });
  }

  handle(req, res) {
    const pathname = new URL(req.url, 'http://localhost:3000').pathname;

    const route = this.routes.find(
      (r) => r.method === req.method && r.path === pathname
    );

    if (route) {
      route.handler(req, res);
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      res.end('404 Not Found');
    }
  }
}

module.exports = Router;