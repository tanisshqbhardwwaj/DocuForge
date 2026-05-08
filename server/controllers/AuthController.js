const AuthService = require("../services/AuthService");

class AuthController {
  static async signup(req, res) {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json(result);
    } catch (err) {
      res
        .status(err.message.includes("exists") ? 409 : 400)
        .json({ error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

  static getProfile(req, res) {
    try {
      const user = AuthService.getProfile(req.userId);
      res.json(user);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static updateOrg(req, res) {
    try {
      const user = AuthService.updateOrg(req.userId, req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
