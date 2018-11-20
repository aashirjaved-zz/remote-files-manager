const http = require('http');
const fs = require('fs');
const express = require('express');
var cors = require('cors')
const Router = express.Router;
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000

app.use(cors())
app.get('/', function(req, res) {
    var directoryData = [];
    fs.readdir(__dirname + "/uploads", (err, files) => {
        for(let i=0;i <files.length;i++){   
            returnFileStats(files[i]).then((data)=>{
                directoryData.push({
                    name:files[i],
                    stats:data
                })
                if(i===files.length-1 && directoryData.length===files.length){
                    res.send(directoryData);
              }   
            })

        }
    }); 
});
    app.get('/download/:filename/:extension', function(req, res) {
        let filename= req.params.filename
        let extension = req.params.extension    
        res.sendFile(__dirname + "/uploads/"+filename+"."+extension);
    
});
    app.get('/delete/:filename/:extension',function(req,res) {
        let filename = req.params.filename;
        let extension = req.params.extension;
        fs.access(__dirname + "/uploads/" + filename + "." + extension, error => {
            if (!error) {
                fs.unlink(__dirname + "/uploads/" + filename + "." + extension, function (error) {
                    if(!error){
                        res.send({status:"Success"})
                    }
                    else
                    {
                        res.status(401).send(error)
                    }
                });
            } else {
                res.status(401).send(error)
            }
        })
    });
    // res.csv([
    //   ["a", "b", "c"]
    // , ["d", "e", "f"]
    // ]);

app.use('/upload-csv', router);


function startServer() {
    server.listen(port,"0.0.0.0", function () {
      console.log('Express server listening on ', port);
    });
  }
  setImmediate(startServer);
  function returnFileStats(filename){
      return new Promise ((resolve,reject)=>{
        fs.stat(__dirname + "/uploads/"+filename,function(err,stats){
          if(!err){
              resolve(stats)
          }
          else
          {
              reject(err)
          }
        });
      });
    }
