const express = require('express');
const morgan = require('morgan')
const fs = require('fs')
const app = express();
(bodyParser = require("body-parser")), (uuid = require("uuid"));

//express.static built-in middleware function in Express.

app.use(express.static(__dirname + '/public'));



//JSON object containing data about your top 10 movies.

let topMovies = [
  {
    title: "The Godfather",
    writer: "Mario Puzo",
    genre: "Crime",
    director: {
      name: "Francis Ford Coppola",
      birth: "1939",
      death: "no",
    },
  },
  {
    title: "Pulp Fiction",
    writer: "Quentin Tarantino",
    genre: "Drama",
    director: {
      name: "Quentin Tarantino",
      birth: "1963",
      death: "no",
    },
  },
  {
    title: "Inception",
    writer: "Christopher Nolan",
    genre: "Adventure",
    director: {
      name: "Christopher Nolan",
      birth: "1970",
      death: "no",
    },
  },
  {
    title: "Se7en",
    writer: "Andrew Kevin Walker",
    genre: "Mystery",
    director: {
      name: "David Fincher",
      birth: "1962",
      death: "no",
    },
  },
  {
    title: "A Wednesday",
    writer: "Neeraj Pandey",
    genre: "Action",
    director: {
      name: "Neeraj Pandey",
      birth: "1973",
      death: "no",
    },
  },
  {
    title: "3 Idiots",
    writer: "Rajkumar Hirani",
    genre: "Comedy",
    director: {
      name: "Rajkumar Hirani",
      birth: "1962",
      death: "no",
    },
  },
  {
    title: "Dangal",
    writer: "Piyush Gupta",
    genre: "Biography",
    director: {
      name: "Nitesh Tiwari",
      birth: "1973",
      death: "no",
    },
  },
  {
    title: "Gran Torino",
    writer: "Nick Schenk",
    genre: "Drama",
    director: {
      name: "Clint Eastwood",
      birth: "1930",
      death: "no",
    },
  },
  {
    title: "Once Upon a Time in America",
    writer: "Harry Grey",
    genre: "Crime",
    director: {
      name: "Sergio Leone",
      birth: "1929",
      death: "1989",
    },
  },
  {
    title: "Talvar",
    writer: "Vishal Bhardwaj",
    genre: "Drama",
    director: {
      name: "Meghna Gulzar",
      birth: "1937",
      death: "no",
    },
  },
];

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

// middleware to add timestamp of the request
  let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.requestTime)
    next();
  };


  app.use(morgan('common', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}));

  app.use(requestTime);
  
  // GET route located at the endpoint “/”
  app.get('/', (req,resp)=>{
  resp.send('Welcome to my movie Collection!')
  })

  // GET route located at the endpoint “/movies”
  app.get('/movies', (req, res) => {
    res.json(topMovies);
});

 // GET route located at the endpoint “/documentation.html”
app.get('/documentation.html', (req, resp) =>{
    resp.sendFile('./documentation.html', {root: __dirname});
});

//error-handling middleware function that will log all application-level errors to the terminal.

app.use((error, req, res, next) => {
    console.error(error.stack); // log an error
    res.send(`Something Broke`) // Renders an error page to user!
   });


app.listen(8081)
console.log('My first node server is running on the port 8081.')