const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;  // Default 
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;  // Default 

module.exports = {
    JWT_ADMIN_PASSWORD: JWT_ADMIN_PASSWORD,  // Default: 'admin'
    JWT_USER_PASSWORD: JWT_USER_PASSWORD,  // Default: 'user'
}