require('dotenv').config(); // Ensure this is at the top

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT
  },
  production: {
    use_env_variable: 'DB_URL',
    dialect: 'postgres'
  }
};
