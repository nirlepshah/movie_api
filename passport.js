// import passport, passport-local, models.js and passport-jwt

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

  //integrating Mongoose with User collection and declaring JWTStrategy and ExtractJWT variables
  
let Users = Models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

  //Define LocalStrategy

passport.use(new LocalStrategy(
{
  usernameField: 'Username',
  passwordField: 'Password'
},
 (username, password, callback) => 
{
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => 
{
    if (error) {
      console.log(error);
      return callback(error);
	      }
    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username or password.'});
    }

    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, {message: 'Incorrect password.'});
    }
    console.log('finished');

    return callback(null, user);
  });
}));

//Define JWTStrategy

passport.use(new JWTStrategy(
{
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
},  (jwtPayload, callback) =>  {
    return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));

