const express = require('express');
const morgan = require('morgan')
const fs = require('fs')
const app = express();
const url = require('url');

//express.static built-in middleware function in Express.

app.use(express.static(__dirname + '/public'));



//JSON object containing data about your top 10 movies.

let topMovies = [

    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino'
      },
      {
        title: 'Inception',
        director: 'Christopher Nolan'
      },
      {
        title: 'Se7en',
        director: 'David Fincher'
      },
      {
        title: 'Inception',
        director: 'Ridley Scott'
      },
      {
        title: '3 Idiots',
        director: 'Rajkumar Hirani'
      },
      {
        title: 'Dangal',
        director: 'Clint Eastwood'
      },
      {
        title: 'Gran Torino',
        director: 'Christopher Nolan'
      },
      {
        title: 'Black Friday',
        director: 'Anurag Kashyap'
      },
      {
        title: 'Talvar',
        director: 'Meghna Gulzar'
      },
];

// GET route located at the endpoint “/” that returns a default textual response of your choosing.

app.get('/', (req,resp)=>{
    resp.send('Welcome to my movie Collection!')
  
  })


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

//error-handling middleware function that will log all application-level errors to the terminal.

app.use((error, req, res, next) => {
    console.error(error.stack); // log an error
    res.send(`Something Broke`) // Renders an error page to user!
   });


}).listen(8081)
console.log('My first node server is running on the port 8080.')