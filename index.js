import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.opendota.com/api";
var currYear = "";
app.use(express.static("public"));

// Making a custom middleware(currentYear) to get the current year
function currentYear(req, res, next){
    const year = new Date();
    currYear = year.getFullYear();
    next();
}

// mounting/using the currentYear middleware
app.use(currentYear);

app.get("/", async (req, res) => {

    
        try{
            const result = await axios.get(API_URL+"/proPlayers");
            const homePro = result.data;
            res.render("index.ejs",{
                currYear,
                homePro
            });
            
        } catch (error) {
            console.log(error.message);
        }
        
        
        /*, {
            secret: JSON.stringify(result.data.secret),
            user: JSON.stringify(result.data.username)
        }*/
        // try {
        //     const result = await axios.get(API_URL);
        // } catch (error) {
        // res.render("index.ejs"/*, {
        //     secret: JSON.stringify(error.message)
        // }*/);
        // }
      
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });