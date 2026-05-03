const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'docuforge_secret_key_2026';

class AuthService {
  static async signup(userData) {
    const { email, password } = userData;
    
    const existing = UserRepository.findByEmail(email);
    if (existing) {
      throw new Error('An account with this email already exists');
    }

    const password_hash = await bcrypt.hash(password, 12);
    const userId = UserRepository.create({ ...userData, password_hash });
    
    const user = UserRepository.findById(userId);
    const token = this.generateToken(user);
    
    return { token, user: this.sanitizeUser(user) };
  }

  static async login(email, password) {
    const user = UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { token, user: this.sanitizeUser(user) };
  }

  static getProfile(userId) {
    const user = UserRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return this.sanitizeUser(user);
  }

  static updateOrg(userId, orgData) {
    UserRepository.updateOrganization(userId, orgData);
    const user = UserRepository.findById(userId);
    return this.sanitizeUser(user);
  }

  static generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  }

  static sanitizeUser(user) {
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = AuthService;
