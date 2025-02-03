import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; //Extracts the token from the request cookies.
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  } //If no token is found, it triggers a 401 Unauthorized error.

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};
/*
This function verifyToken ensures that the user making a request is authenticated by checking the presence
 and validity of a JWT token.
jwt.verify(token, process.env.JWT, (err, user) => {...}): Verifies the token using the secret key 
defined in the environment variable JWT.
err: If the token is invalid, it triggers a 403 Forbidden error.
req.user = user;: Attaches the decoded user information from the token to the req object for downstream
 access.
next();: If the token is valid, it allows the request to proceed to the next middleware or route handler.
*/
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
/*
verifyUser, is a middleware that checks if a user is authorized to perform a specific operation in a backend API. 
It ensures that the user either owns the account they are accessing or has administrative privileges.
verifyToken function to first check if the user is authenticated by verifying their JWT token.
If the token is valid, it attaches the decoded user data (including the user ID and admin status) to req.user.
Compares the authenticated user's ID (req.user.id) with the ID provided in the request parameter (req.params.id).
If the IDs match, it means the user is accessing their own account, so authorization is granted.
Alternatively, if the user has isAdmin: true, they are also granted access regardless of the ID match.
*/
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
/*
First, it calls the verifyToken middleware to authenticate the user by verifying their JWT token.
If the token is valid, req.user will contain the user's information, including the isAdmin property.
Checks whether the authenticated user has the isAdmin flag set to true.
If the user is an admin, the request proceeds to the next middleware or route handler by calling next()
If req.user.isAdmin is false, it returns a 403 Forbidden error, indicating the user lacks administrative privileges.
*/