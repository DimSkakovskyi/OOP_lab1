// const UserController = require('../controllers/UserController');

function registerRoutes(router) {

  router.register("GET", "/", loginPage);
  router.register("POST", "/login", login);

}

module.exports = registerRoutes;