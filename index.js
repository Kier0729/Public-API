import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.opendota.com/api";
var currYear = "";
var x = "";
var result;
var homePro;
var homeProLength;
var ign;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Making a custom middleware(currentYear) to get the current year
function currentYear(req, res, next){
    const year = new Date();
    currYear = year.getFullYear();
    
    next();
}

// mounting/using the currentYear middleware
app.use(currentYear);

// displays set of first 15 pro players (Home Page)
app.get("/", async (req, res) => {
    x = 0; // index 0 
        try{
        result = await axios.get(API_URL+"/proPlayers");
        homePro = result.data;
        
                res.render("index.ejs",{
                currYear,
                homePro,
                x
            });
               
        } catch (error) {
            console.log(error.message);
        }     
  });

// display the next 15 pro players
  app.get("/next", async (req, res) => {
    x = x + 15;
    try{
        result = await axios.get(API_URL+"/proPlayers");
        homePro = result.data;
        res.render("index.ejs",{
            currYear,
            homePro,
            x
        });
        
    } catch (error) {
        console.log(error.message);
    }
});

// displays the previous 15 pro players
app.get("/prev", async (req, res) => {
    if (x >= 15){ // logical condition to check if the current value of x/index is = or > 15, if 
                  // true proceed below to deduct 15 and show the previous 15 players
    x = x - 15;
    try{
        result = await axios.get(API_URL+"/proPlayers");
        homePro = result.data;
        res.render("index.ejs",{
            currYear,
            homePro,
            x
        });
        
    } catch (error) {
        console.log(error.message);
    }
} else {
    res.redirect("/"); // if x is < 15 just redirect to home page.
}
});

// POST /search get the ign from personaName inside the search.ejs
app.post("/search", async (req, res) => {
    ign = req.body["personaName"];
    // check if user inputs ign(personaName) in search.ejs
    if(ign){
        x = 0;
        try{
        result = await axios.get(API_URL+"/search?q="+ign);
        homePro = result.data;
        homeProLength = result.data.length;
        
                res.render("partials/search.ejs",{
                currYear,
                homePro,
                x,
                homeProLength
            });
               
        } catch (error) {
            console.log(error.message);
        }
} else{ // if user didnt enter ign(personaName) render the search.ejs and past the currYear for the footer
    res.render("partials/search.ejs",{
        currYear
    });
    }
  });
// GET /serch render the search.ejs and past the currYear for the footer
app.get("/search", async (req, res) => {
  
    res.render("partials/search.ejs",{
        currYear
    });
  });

  // next page button of the search.ejs
  app.get("/nextSearch", async (req, res) => {
    
    x = x + 15; // increment x by 15
    if (x < (homeProLength)){ // if x < homeProLength 
    try{
        result = await axios.get(API_URL+"/search?q="+ign);
        homePro = result.data;
        res.render("partials/search.ejs",{
            currYear,
            homePro,
            x,
            homeProLength
        });
        
    } catch (error) {
        console.log(error.message);
    }
} else {
    x = x - 15; // if x is > homeProLength decrement it by 15 to revert it to its current value
    try{
        result = await axios.get(API_URL+"/search?q="+ign);
        homePro = result.data;
        res.render("partials/search.ejs",{
            currYear,
            homePro,
            x,
            homeProLength
        });
        
    } catch (error) {
        console.log(error.message);
    } 
}
});

// prev button for search.ejs
app.get("/prevSearch", async (req, res) => {
    if (x >= 15){ // logical condition to check if the current value of x/index is = or > 15, if 
                  // true proceed below to deduct 15 and show the previous 15 players
    x = x - 15;
    try{
        result = await axios.get(API_URL+"/search?q="+ign);
        homePro = result.data;
        res.render("partials/search.ejs",{
            currYear,
            homePro,
            x,
            homeProLength
        });
        
    } catch (error) {
        console.log(error.message);
    }
} else { // if x is < 15 just render partials/search.ejs and past the default/starting value of currYear, 
         // homePro, x, homeProLength
    try{
        result = await axios.get(API_URL+"/search?q="+ign);
        homePro = result.data;
        res.render("partials/search.ejs",{
            currYear,
            homePro,
            x,
            homeProLength
        });
        
    } catch (error) {
        console.log(error.message);
    }
}
});


app.get("/contact", async (req, res) => {        
                res.render("partials/contact.ejs",{
                currYear,    
            });     
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });