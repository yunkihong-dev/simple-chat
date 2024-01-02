
 module.exports = {
  // 개발용, 로컬
  development: {
    username: "root",
    password: "12345678",
    database: "chatApp",
    host: "localhost",
    dialect: "mysql" 
  },
  // 테스터서버 DB
  test: {
    username: "root",
    password: "12345678",
    database: "chatApp",
    host: "localhost",
    dialect: "mysql" 
  },
  // 배포용 DB
  production: {
    username: "root",
    password: "12345678",
    database: "chatApp",
    host: "localhost",
    dialect: "mysql" 
  }
 }