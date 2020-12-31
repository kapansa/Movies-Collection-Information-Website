require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.post("/movie", (req, res) => {
    
    let chunks = [];
    const movie_id = req.body.movie_id;
    const url = "https://api.themoviedb.org/3/movie/" + movie_id + "?api_key=" + process.env.API_KEY + "&language=en-US";

    https.get(url, (response) => {

        response.on('data', (data) =>{
            chunks.push(data);
        }).on('end', () =>{
            const information = Buffer.concat(chunks);
            const movieDetails = JSON.parse(information);
            res.render("moviedetails.ejs", {movie: movieDetails}); 
        });

    });

});

app.get("/", (req, res) =>{
    res.render("index.ejs", {movies: "movies"});
});

app.post("/movies", (req, res) => {

    let chunks = [];
    const movie = req.body.movie;
    const url = process.env.URL + "api_key=" + process.env.API_KEY + "&language=en-US&query=" + movie;

    https.get(url, (response) => {

        response.on('data', (data) =>{
            chunks.push(data);
        }).on('end', () =>{
            const information = Buffer.concat(chunks);
            const movieDetails = JSON.parse(information);
            res.render("movies.ejs", {movies: movieDetails.results});
        });

    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}...`);
});