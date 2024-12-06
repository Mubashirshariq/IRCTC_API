const dotenv=require("dotenv")


dotenv.config();

function authorizeRoleWithApiKey(role) {
    return (req, res, next) => {
      const apiKey = req.headers["x-api-key"];
      if (!apiKey) {
        return res.status(401).json({ error: "API key is missing" });
      }
  
      if (apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).json({ error: "Invalid API key" });
      }
      if (!req.user || !req.user.role) {
        return res.status(403).json({ error: "User is not authenticated or role is missing" });
      }
  
      if (req.user.role !== role) {
        return res.status(403).json({ error: "Access denied. Insufficient permissions." });
      }
  
      next();
    };
  }
  
  module.exports = authorizeRoleWithApiKey;
  