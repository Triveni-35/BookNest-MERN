import User from "../models/User.js";
export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
/*
req: the request object, which contains data like user's ID in the route parameter and updated information in the request body.
res: the response object used to send back the result.
next: a callback function to pass errors to error-handling middleware.
Mongoose's findByIdAndUpdate() method to locate and update the user document with the given ID.
req.params.id: Fetches the user ID from the request parameters.
{ $set: req.body }: Uses the MongoDB $set operator to update the user fields with the values provided in the request body.
{ new: true }: Ensures that the updated document is returned after the operation.
 res.status(200).json(updatedUser);

If the operation is successful, it responds with a status code 200 and the updated user data in JSON format.
catch (err) { next(err); }

If any error occurs during the update operation, it is passed to the next middleware using next(err) for error handling.
*/
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}