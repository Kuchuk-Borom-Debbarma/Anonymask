export class ConstEnvNames {
  static readonly DB_HOST = 'DB_HOST';
  static readonly DB_USERNAME = 'DB_USERNAME';
  static readonly DB_PWD = 'DB_PWD';
  static readonly DB_NAME = 'DB_NAME';

  static readonly GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID';
  static readonly GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET';
  static readonly GOOGLE_SCOPES = 'GOOGLE_SCOPES';
  static readonly GOOGLE_REDIRECT_URI = 'GOOGLE_REDIRECT_URI';
  static readonly JWT_SECRET = 'JWT_SECRET';
  static readonly JWT_ALGO = 'HS256';
  static readonly JWT_EXPIRES_IN = 'JWT_EXPIRES_IN';

  // Private constructor to prevent instantiation
  private constructor() {}
}
