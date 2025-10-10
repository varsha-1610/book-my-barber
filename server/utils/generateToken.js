import jwt from "jsonwebtoken";

//shop
const createToken = (res, data) => {
  const token = jwt.sign(
    { data },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // 1 day
  );

  // Set cookie properly
  res.cookie("abhi", token, {
    httpOnly: true,       // cannot be accessed by JS
    secure: false,        // true in production with HTTPS
    sameSite: "lax",      // allows sending cookie from frontend
    maxAge: 60 * 60 * 1000
  });
};

const getToken = (req) => {
  if (!req.cookies || !req.cookies.abhi) return null; // unauthorized
  return req.cookies.abhi;
};


//user

const createTokenForUser = (res, data) => {
  let token = jwt.sign(
    { data, exp: Math.floor(Date.now() / 1000) * (60 * 60) },
    process.env.JWT_SECRET
  );

  const expiration = new Date(new Date().getTime() + 3600000);
  res.set(
    "Set-Cookie",
    `user=${token};httpOnly:false;SameSite=Strict;Expires=${expiration.toUTCString()}`
  );
};

  const getTokenForUser = (req) => {
    let cookieHeaderValue = req.headers.cookie;
    let token = null;

    if (cookieHeaderValue) {
      let cookies = cookieHeaderValue.split(";");

      for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.trim().split("=");

        if (cookieName === "user") {
          token = cookieValue;
          return token;
          break;
        }
      }
    }
  };






//admin



    
const createTokenForAdmin = (res, data) => {
  let token = jwt.sign(
    { data, exp: Math.floor(Date.now() / 1000) * (60 * 60) },
    process.env.JWT_SECRET
  );

  const expiration = new Date(new Date().getTime() + 3600000);
  res.set(
    "Set-Cookie",
    `admin=${token};httpOnly:false;SameSite=Strict;Expires=${expiration.toUTCString()}`
  );
};

const getTokenForAdmin = (req) => {
  let cookieHeaderValue = req.headers.cookie;
  let token = null;

  if (cookieHeaderValue) {
    let cookies = cookieHeaderValue.split(";");

    for (let cookie of cookies) {
      let [cookieName, cookieValue] = cookie.trim().split("=");

      if (cookieName === "admin") {
        token = cookieValue;
        return token;
        break;
      }
    }
  }
};


    
    
    export {createToken,getToken,createTokenForAdmin,getTokenForAdmin,createTokenForUser,getTokenForUser};


    
    // const generateToken = (res,userId) => {
    //     const token = jwt.sign({userId},process.env.JWT_SECRET,{
    //         expiresIn : "30d"
    //     });
    
    //     res.cookie("jwt",token,{
    //         httpOnly : true,
    //         secure: process.env.NODE_ENV !=="development",
    //         sameSite:"strict",
    //         maxAge: 30 * 24 * 60 * 1000
    
    //     })
    // } 