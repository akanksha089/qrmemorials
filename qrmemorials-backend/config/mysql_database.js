  //  const mysql = require("mysql2/promise");
  //  const dotenv = require("dotenv");
  //  dotenv.config({ path: "backend/config/config.env" });

  //  const mysqlPool = mysql.createPool({
  //    host: "localhost",
  //    user: "root",
  //    password: "",
  //    database: "nodejs",
  //    waitForConnections: true,
  //    connectionLimit: 10,
  //    queueLimit: 0,
  //  });
  //  module.exports = mysqlPool;


  const mysql = require("mysql2/promise");
  const dotenv = require("dotenv");
  dotenv.config({ path: "backend/config/config.env" });

  const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0,
    connectTimeout: 10000, 
    ssl: {
      rejectUnauthorized: false
    }

  });
  async function testConnection() {
    try {
      const connection = await mysqlPool.getConnection();
      console.log("Database connected successfully!");
      connection.release(); 
    } catch (err) {
      console.error("Database connection error: ", err.message);
    }
  }

  testConnection();

  module.exports = mysqlPool;


