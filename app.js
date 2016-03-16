var express = require('express')
    cheerio = require('cheerio')
    request = require('request');
    mysql = require('mysql')

//connection to db
var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Your Password',
    database:'scrapper'
});

con.connect(function(error){
    if(!error){
        console.log('connected to db');
    }
    else{
        console.log('not connected'+error);
    }
});

var app = express()
var url = "";

//how i will proceed
//first get the url from the current tab of the browser
//then scraps the data using  cheerio and parse the useful info
//save into the mysql database

//middleware to perform the scrapping
// function get_url(req,res,next){
//   //the url will be of the current tab
//   url = 'https://www.linkedin.com/in/pransh-tiwari-9aa57988';
//   if(url == ""){
//     res.end('null');
//   }
//   else{
//   next();
//   }
// }

// app.use(get_url)

app.get('/home',function(req,res){
   //var url = 'http://'+req.params.url;
   var url = req.query.url;
   console.log(url);
   var dataArr = [];
   var name = "";
   var location = "";
   var current_Organistaion = "";
   var education = "";
   var industry = "";
   request(url,function(error,response,html){
        //res.end(data);
      //console.log('inside request function');
      if(!error && response.statusCode ==200 ){
         var $ = cheerio.load(html);
         //console.log('cheerio data loaded');

         //for name of the person
         $("#name").filter(function(index){
           var data = $(this);
           name = data.text();
           //console.log(name);   //got it
        });

        //location of the person
        $(".locality").filter(function(index){
           //console.log('searching locality');
           var data = $(this);
           location = data.text();
           //console.log(data.text());  //got it
        });

        $("dd").filter(function(index){
           //console.log('searching locality');
           var data = $(this);
           if(index == 1){
            industry = data.text();
           }
           //console.log(data.text());
          //console.log(industry);  //got it
        });

        //getting organisation
        $("ol").filter(function(index){
           var data = $(this);
           //console.log(index + data.text());  //got it
           if(index == 0){
             current_Organistaion = data.text();
           }
           if(index == 1 || index ==2){
             if(data.text() != 'abcdefghijklmnopqrstuvwxyzmoreBrowse members by country'){
               education = data.text();
             }
           }
          });

         }
       else{
          res.send(error);
       }
       var dataJSON = {
          name:name,
          location:location,
          industry:industry,
          current_organisation:current_Organistaion,
          education:education
       };
      console.log(dataJSON);
      if(dataJSON.name=="" || dataJSON.location=="" || dataJSON.industry=="" || dataJSON.current_organisation=="" || dataJSON.education==""){
        //do nothing
      }
      else{
      //sending data to db
      con.query('INSERT INTO signature SET ?',dataJSON,function(err,res){
        if(err){
          throw err;
        }
        console.log('last insert id:',res.insertId);
      });
    }
   //res.send(dataJSON);
  });
});

app.get('/home',function(req,res){
    console.log(req.query.url);
});

app.listen(3000,function(){
    console.log('listening at port 3000');
});
