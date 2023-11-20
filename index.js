import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.opendota.com/api";
var currYear = "";
var x = "";
var result;
var homePro;

app.use(express.static("public"));

// Making a custom middleware(currentYear) to get the current year
function currentYear(req, res, next){
    const year = new Date();
    currYear = year.getFullYear();
    
    next();
}

// mounting/using the currentYear middleware
app.use(currentYear);

// displays set of 15 pro players
app.get("/", async (req, res) => {

    x = 0;
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
    if (x >= 15){
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
    res.redirect("/");
}

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });