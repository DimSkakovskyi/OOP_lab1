const AuthController = require('../controllers/AuthController');
const AccountController = require('../controllers/AccountController');
const PaymentController = require('../controllers/PaymentController');
const AdminController = require('../controllers/AdminController');

function registerRoutes(router) {
  router.register('GET', '/login', AuthController.showLoginPage);
  router.register('POST', '/login', AuthController.login);
  router.register('POST', '/logout', AuthController.logout);

  router.register('GET', '/accounts', AccountController.listUserAccounts);
  router.register('GET', '/account', AccountController.showAccountDetails);
  router.register('POST', '/accounts/block', AccountController.blockAccount);

  router.register('POST', '/payments/create', PaymentController.createPayment);
  router.register('POST', '/topup/create', PaymentController.createTopUp);

  router.register('GET', '/admin/accounts', AdminController.listAllAccounts);
  router.register('POST', '/admin/accounts/unblock', AdminController.unblockAccount);
}

module.exports = registerRoutes;