const express = require('express');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const pdf = require('pdf-parse');
const app = express();
const PORT = 3001;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));

app.get('/', (req, res, next)=>{
    if(req.query.file == undefined){
        res.render('partials/text',{text: "no file given"});  
    }
    try{
        let dataBuffer = fs.readFileSync(req.query.file);
        pdf(dataBuffer).then(function(data) {
        
            // number of pages
            console.log(data.numpages);
            // number of rendered pages
            console.log(data.numrender);
            // PDF info
            console.log(data.info);
            // PDF metadata
            console.log(data.metadata); 
            // PDF.js version
            // check https://mozilla.github.io/pdf.js/getting_started/
            console.log(data.version);
            // PDF text
            res.render('partials/text',{text: data.text.replace(/(\r\n|\n|\r)/g,"<br>")});    
        });
    }
    catch(err){
        res.render('partials/text',{text: "An error occurred while parsing"});  
    }
    
});
/*
app.get('/', (req, res, next)=>{
  res.send({text: fs.readFileSync("text.txt", 'utf8').toString()})
});*/