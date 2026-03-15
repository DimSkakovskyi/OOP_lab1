class Router {

  constructor() {
    this.routes = [];
  }

  // adding new route to the router. 
  // Example: method:"GET", path:"/login", handler:loginPage
  register(method, path, handler) {
    this.routes.push({ method, path, handler });
  }

  handle(req, res) {

    // r - element of the array
    const route = this.routes.find(r =>
      r.method === req.method &&
      r.path === req.url
    );

    if (route) {
      route.handler(req, res);
    }
    else {
      res.writeHead(404);
      res.end("404 Not Found");
    }

  }
}

module.exports = Router;