const dotenv=require("dotenv")
const jwt=require("jsonwebtoken")

dotenv.config();
JWT_SECRET=process.env.JWT_SECRET
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = user;
      next();
    });
  }
  

  module.exports=authMiddleware