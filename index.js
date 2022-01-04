const express = require('express');
const morgan = require('morgan')
const fs = require('fs')
const app = express();

//import express-validator
const { check, validationResult } = require('express-validator');

//Import mongoose library and model.js

const mongoose = require('mongoose');

const Models = require('./models');

//body-parser imported

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import uuid library
const uuid = require("uuid");

//express.static built-in middleware function in Express.
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

// Import CORS library

const cors = require('cors');
app.use(cors());

// Import passport library 
  const passport = require('passport');
require('./passport');
let auth = require('./auth')(app);


// Integrating Mongoose with a API

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myMovieDB', { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connect('process.env.CONNECTION_URI', { useNewUrlParser: true, useUnifiedTopology: true });

// middleware to add timestamp of the request
let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  console.log(req.requestTime);
  next();
};

app.use(
  morgan("common", {
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
  })
);
  
  
  app.use(requestTime);
  
  // GET route located at the endpoint “/”
  app.get('/', (req,resp)=>{
  resp.send('Welcome to my movie Collection!')
  })
   // GET route located at the endpoint “/documentation.html”
 app.get("/documentation", (req, resp) => {
  resp.sendFile("/public/documentation.html", { root: __dirname });
});

// Return a list of ALL movies to the user
app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find().then((movie)=>{
res.status(200).json(movie)
  }).catch((err)=>{
    res.status(500).send('Error' + err);
  })
  });


// Get data about specific movie.

app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title:req.params.Title}).then((movies)=>{
    res.json(movies)
  }).catch((err)=>{console.log(err)
    res.status(500).send('Error' + err);
  })
});

// Get data about a genre (description) by name/title.
app.get("/genres/:genre", passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({"Genre.Name":req.params.genre}).then((movies)=>{
    res.status(200).json(movies.Genre)
  }).catch((err)=>{
    console.error(err);
    res.status(500).send('Error' + err);
  })
});

// Return data about Movie Director.
app.get("/directors/:directorName",passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({"Director.Name":req.params.directorName}).then((movies)=>{
    res.status(200).json(movies.Director);
  }).catch((err)=>{
    console.error(err);
    res.status(500).send('Error' + err);
});
});

//Get data about all users
app.get("/users", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find().then((users)=>{
    res.status(201).json(users);
  }).catch((err)=>{console.error(err);
    res.status(500).send('Error' + error);})
  });
  

// Add new user
app.post('/users', [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
//Variable to store hashed password
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' Already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
  });

// Allow users to update their user information

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {$set:
   {
       Username: req.body.Username,
       Password: req.body.Password,
       Email: req.body.Email,
       Birthday: req.body.Birthday
   }
},

{ new: true},
(err, updatedUser) => {
   if(err) {
       console.error(err);
       res.status(500).send('Error' + err);
   } else {
       res.json(updatedUser);
   }
   });
})


//Allow user to add movie to list of favorites
app.post('/users/:Username/movies/:id',passport.authenticate('jwt', { session: false }),  (req, res) => {
  var favMovie = req.params.id;
  console.log(favMovie);
  Users.findOneAndUpdate({Username: req.params.Username}, {
      $addToSet: {FavouriteMovies: req.params.id}
  },
  { new: true},
 (err, updatedUser) => {
     if (err) {
         console.error(err);
         res.status(500).send('Error' + err);
     } else {
         res.json(updatedUser);
     }
 });
});



//Allow user to remove movie from list of favorites
app.delete('/users/:Username/movies/:id', passport.authenticate('jwt', { session: false }),  (req, res) => {

  Users.findOneAndUpdate({Username: req.params.Username}, {
      $pull: {FavouriteMovies: req.params.id}
  },
  { new: true},
 (err, updatedUser) => {
     if (err) {
         console.error(err);
         res.status(500).send('Error' + err);
     } else {
         res.json(updatedUser);
     }
 });
});


//Allow existing users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



//error-handling middleware function that will log all application-level errors to the terminal.

app.use((error, req, res, next) => {
    console.error(error.stack); // log an error
    res.send(`Something Broke`) // Renders an error page to user!
   });

   const port = process.env.PORT || 8083;
   app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
   });
app.listen(8083)
