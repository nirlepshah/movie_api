const express = require('express');
const morgan = require('morgan')
const fs = require('fs')
const app = express();

//Import mongoose library and model.js

const mongoose = require('mongoose');

const Models = require('./models');

//body-parser imported

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//express.static built-in middleware function in Express.
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));


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

const Movies = Models.Movie;
const Users = Models.User;


mongoose.connect('mongodb://localhost:27017/myMovieDB', { useNewUrlParser: true, useUnifiedTopology: true })
  
  // GET route located at the endpoint “/”
  app.get('/', (req,resp)=>{
  resp.send('Welcome to my movie Collection!')
  })

//Returns a JSON list of movies.
  app.get('/movies', (req, res) => {
    res.json(topMovies);
});

 // GET route located at the endpoint “/documentation.html”
 app.get("/documentation", (req, resp) => {
  resp.sendFile("/public/documentation.html", { root: __dirname });
});

//Returns a JSON with data about a single movie by title to the user.
app.get("/movies/:title", (req, res) => {
  console.log(req.params);

  const found = topMovies.some(
    (movieTitle) => movieTitle.title === req.params.title
  );

  if (found) {
    res.status(200).json(
      topMovies.find((myMovie) => {
        return myMovie.title === req.params.title;
      })
    );
  } else res.send("Title not found");
});

//Returns a JSON data with movies of that genre.
app.get("/genres/:genre", (req, res) => {
  console.log(req.params.genre);

  res.status(200).json(
    topMovies.filter((movieGenre) => {
      return movieGenre.genre === req.params.genre;
    })
  );
});

app.get("/directors/:directorName", (req, res) => {
  console.log(req.params.directorName);
  res.status(200).json(
    topMovies.find((directorName) => {
      return directorName.director.name === req.params.directorName;
    })
  );
});

//Returns a JSON data with all the users.
app.get("/users", (req, res) => {
  res.json(user);
});


//Allow new user to register entering his name, age and UUID assigned automatically.
app.post("/users", (req, res) => {
  const userData = req.body;
  if (!userData.name) {
    const message = `You have not entered "name"`;
    res.status(400).send(message);
  } else {
    userData.id = uuid.v4();
    user.push(userData);
    res.status(201).json(userData);
  }
});

//Returns a text only confirming orginal userName has been changed.

app.put("/users/:name/:new_name", (req, res) => {
  let userName = user.find((guest) => {
    return guest.name === req.params.name;
  });

  if (userName) {
    userName = req.params.new_name;
    res.status(201).send(`${req.params.name} you have successfuly updated your username`);
  } else {
    res.status(404).send(`Original name does not exist`);
  }
});

// De-register user
app.delete("/users/:userDeregister", (req, res) => {
  res.send("User has been seccessfully de-registered");
});

//Returns a text confirming movie name that was added successfully.
app.post("/favorites/:addMovie", (req, res) => {
  res.send(
    `New movie: ${req.params.addMovie} has been added successfully added to list of favorite`
  );
});

//Returns a text confirming movie that was removed successfully.
app.delete("/favorites/:removeMovie", (req, res) => {
  res.send(" Movie has been succeffuly deleted from the favourite list");
});

//error-handling middleware function that will log all application-level errors to the terminal.

app.use((error, req, res, next) => {
    console.error(error.stack); // log an error
    res.send(`Something Broke`) // Renders an error page to user!
   });


app.listen(8083)
console.log('My first node server is running on the port 8083.')