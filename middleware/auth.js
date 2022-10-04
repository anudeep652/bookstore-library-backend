import jwt from "jsonwebtoken";
import User from "../modals/userSchema.js";

export const authorizeUser = async (req, res, next) => {
  let token;
  console.log("hello");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Not authorized" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};
