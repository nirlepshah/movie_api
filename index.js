const express = require('express');
const app = express();
const http = require('http');
const url = require('url');

//express.static built-in middleware function in Express.

app.use(express.static(__dirname + '/public'));

http.createServer((req,resp)=>{
let requestURL = url.parse(request.url,true)
if(requestURL.pathname == "/documentation.html"){
    resp.writeHead(200, {'Content-Type':'text/plain'});
    resp.end("Documentation on the bookclub API\n");
}

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

// let myLogger = (req, res, next) => {
//     console.log(req.url);
//     next();
//   };
  

  let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.requestTime)
    next();
  };


  app.use(morgan('common', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}));

  app.use(requestTime);
  
  app.get('/', (req,resp)=>{
  resp.send('Welcome to my movie Collection!')
  

})

resp.end("Welcome to my book club\n");
}).listen(8081)
console.log('My first node server is running on the port 8080.')