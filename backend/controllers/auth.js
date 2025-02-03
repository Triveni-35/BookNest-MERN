import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10); //Generates a random salt with a length of 10 rounds.
    const hash = bcrypt.hashSync(req.body.password, salt);
//Hashes the password using the generated salt. This makes it difficult to reverse-engineer the password, even if the hash is exposed.
    const newUser = new User({
      ...req.body, //This spreads all the properties from the request body into the new user object 
      password: hash, //password is overridden with the hashed password (hash) instead of the plain-text password provided in req.body
    });

    await newUser.save(); //Saves the newly created user into the database 
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    /*
    payload of the token contains the user's id and isAdmin status. This helps identify the user and 
    determine if they are an admin.
The secret key used to sign the token is fetched from the environment variables (process.env.JWT).
The token is used for subsequent authenticated requests.
*/
    const { password, isAdmin, ...otherDetails } = user._doc;//extracts all properties of the user document, excluding password and isAdmin.
    res
      .cookie("access_token", token, {
        httpOnly: true,
      }) /*
      stores the JWT in a cookie named access_token with the httpOnly flag.
       This makes the token inaccessible from JavaScript (providing security against XSS attacks). */
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
