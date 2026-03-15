class UserController {

  static loginPage(req, res) {
    res.writeHead(200);
    res.end("Login page");
  }

}

module.exports = UserController;