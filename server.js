
const http = require('http')
const fs  = require('fs')
const url = require('url');
const  port = 8080

const server = http.createServer(function(req, resp) {

    let addr = req.url;
    let q = url.parse(addr, true);
    let filePath = ''

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        
        if (err) {
          console.log(err);
        } else {
          console.log('Added to log.');
        }
    
        if(q.pathname.includes('documentation')){
            filePath = (__dirname + '/documentation.html')
        }else{
            filePath ='index.html'
        }
      
  resp.writeHead(200, {'content-Type': 'text/html'})

  fs.readFile(filePath, function(error, data) {
    if(error){
      resp.writeHead(404)
      resp.write('file not found')
    }else{
      resp.write(data)
    }
    resp.end()
   
  })
})
})
server.listen(port, function(error){
if(error){
  console.log('something went wrong!', error)
}else{
  console.log('server is listening at port', port)
}
})


