import jwt from "jsonwebtoken";
import User from "../modals/userSchema.js";
export const adminMiddleWare = async (req, res, next) => {
  let token;

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
      if (req.user.role === "admin") {
        next();
      } else {
        return res.status(401).json({ error: "You are not admin" });
      }
    } catch (error) {
      // console.log(error);
      return res.status(401).json({ error: "Not authorized" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

//not admin
// eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMzMwOTE1ZWRlMDUzN2U0MTY3ZGQ0YiIsImlhdCI6MTY2NDI4OTA0NSwiZXhwIjoxNjY2ODgxMDQ1fQ.CMcXJYMVk5rfa43KYXOTe9mN85vAOPsgousbUmLhs-E

//admin
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMzMwOGUyYThiZWM2ZjRjNjVhYzI4YyIsImlhdCI6MTY2NDI4OTc3OSwiZXhwIjoxNjY2ODgxNzc5fQ.IqRsg8TqUfq7TvkI9Cg-LcKDpJtInL8Luf9SwJVmKpM
