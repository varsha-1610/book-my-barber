import jwt from "jsonwebtoken";

const getData = (token) => {
  if (!token) {
    throw new Error("Unauthorized"); // ❌ Throw an error instead of using res
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.data; // return the data
  } catch (error) {
    console.log(error);
    throw new Error("Unauthorized"); // ❌ Throw error for controller to handle
  }
};

export { getData };
