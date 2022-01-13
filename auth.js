const jwtSecret = 'your_jwt_secret'; //same key used in the JWTStrategy

const jwt = require('jsonwebtoken'), // importing jsonwebtoaken library 
  passport = require('passport'); // importing passport library

require('./passport'); // Importing local passport file

//Defining authentication logic

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // Username encoded in the JWT
    expiresIn: '7d', // Specifies token will expire in 7 days
    algorithm: 'HS256' // Algorithm used to “sign” or encode the values of the JWT
  });
}

//post Login 


module.exports = (router) => {
  router.post('/login', (req, res) => {
     (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}