var http = require('http');
var MongoClient = require('mongodb').MongoClient;

http.createServer(
                  function (req, res) {
                  res.writeHead(200, {'Content-Type': 'application/json'});

                  if (req.url.match("\/process\/{0,1}"))
                  {
                    var duration = Math.floor(15+5*Math.random());
                    setTimeout(function(){
                      var result = {
                        'date': (new Date()).toISOString(),
                        'method': req.method,
                        'headers': req.headers,
                        'path': req.url,
                        'query':'',
                        'body':'',
                        'duration': duration
                      };

                      MongoClient.connect("mongodb://localhost:27017/",
                        function(err, db)
                        {
                          if (err){
                            console.log("Cannot connect to mongodb");
                          }
                          else{
                            db.db("mydb").collection("projectData").insertOne(result,
                              function(err, res)
                              {
                                if (err){
                                  console.log("Could not insert data");
                                }
                              });
                          }
                          db.close();
                        }
                      );

                      res.end(JSON.stringify(result));
                    },
                    duration*1000);
                  }
                  //process end-point definition END

                  else if (req.url.match("\/stats\/p=\\d{1,}"))
                  {
                    var minutes = parseInt(req.url.split("=")[1]);
                    var end = new Date();
                    var start = new Date(end);
                    start.setMinutes(end.getMinutes()-minutes);

                    MongoClient.connect("mongodb://localhost:27017/",
                    function(err, db)
                    {
                      if (err) throw err;
                      db.db("mydb").collection("projectData")
                      .aggregate(
                                  [
                                    {
                                      $match:
                                            {
                                              'date':
                                                    {
                                                      $gte:start.toISOString(),
                                                      $lte:end.toISOString()
                                                    }
                                            }
                                     },
                                     {
                                       $group:
                                              {
                                                "_id":"$method",
                                                AVG_RESPONSE_TIME:
                                                                {
                                                                  "$avg":"$duration"
                                                                },
                                                NO_OF_REQUESTS:
                                                              {
                                                                "$sum":1
                                                              }
                                                }
                                      }
                                  ]
                      )
                      .toArray(
                        function(err, result) {
                          if (err) throw err;
                          res.end(JSON.stringify(
                            {
                              "startdate": start,
                              "enddate": end,
                              "data":result
                            }
                          ));
                          db.close();
                        })});
                  }
                  //stats end-point definition END

                  else{
                    res.end(JSON.stringify(
                      {
                        'path': req.url,
                        'body':'Invalid Path'
                      })
                    );
                  }
}).listen(8000);
console.log('Server running at http://localhost:8000/');
