var express = require("express");
const axios = require("axios");
var router = express.Router();

// API URLS
require("dotenv").config();
const API_KEY = process.env.TMDB_KEY;
const BASEURL = "http://api.themoviedb.org/3";
const NOWPLAYINGURL = `${BASEURL}/movie/now_playing?api_key=${API_KEY}`;
const IMAGEURL = "http://image.tmdb.org/t/p/w300";

//MIDDLEWARE
// SEND POSTER URL TO CLIENT
router.use((req, res, next) => {
  res.locals.posterURL = IMAGEURL;
  next();
});

//LOADING MOVIE ERROR CHECKER
router.use((req, res, next) => {
  res.locals.actor = null;
  if (req.query.loadingError === "true") {
    res.locals.movieError =
      "Sorry, we were unable to load the movie. Please try again later";
  } else {
    res.locals.movieError = null;
  }
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  axios
    .get(NOWPLAYINGURL)
    .then((response) => {
      res.render("index", {
        title: "Movie Fan",
        data: response.data.results,
        reqError: null,
      });
    })
    .catch((e) => {
      // console.log(e.response.data.status_message);
      res.status(500).render("index", {
        title: "Movie Fan",
        data: {},
        reqError:
          "Sorry we were unable to load movies. Please check you connection and try again later",
      });
    });
});

/* GET single movie page */
router.get("/movie/:id", (req, res, next) => {
  const movieURL = `${BASEURL}/movie/${req.params.id}?api_key=${API_KEY}&language=en-US`;
  axios
    .get(movieURL)
    .then((response) => {
      res.render("single-movie", {
        data: response.data,
        imdb_url: `https://www.imdb.com/title/${response.data.imdb_id}/`,
      });
    })
    .catch((e) => {
      res.redirect("/?loadingError=true");
    });
});

/* POST search  */
router.post("/search", (req, res, next) => {
  const cat = req.body.category;
  const searchTerm = encodeURIComponent(req.body.searchTerm);
  const searchURL = `${BASEURL}/search/${cat}?query=${searchTerm}&api_key=${API_KEY}`;

  console.log(searchURL);

  axios
    .get(searchURL)
    .then((response) => {
      if (cat === "person") {
        const data = response.data.results[0].known_for;
        const actorURL = `${BASEURL}/person/${response.data.results[0].id}?api_key=${API_KEY}&language=en-US`;
        axios
          .get(actorURL)
          .then((actorRes) => {
            res.render("index", {
              title: req.body.searchTerm,
              data,
              reqError: null,
              actor: actorRes.data,
            });
          })
          .catch((e) => {
            res.status(500).render("index", {
              title: ":( Search failed",
              data: {},
              reqError:
                "Something went wrong with this search! Please try again later",
            });
          });
      } else {
        res.render("index", {
          title: req.body.searchTerm,
          data: response.data.results,
          reqError: null,
        });
      }
    })
    .catch((e) => {
      res.status(500).render("index", {
        title: ":( Search failed",
        data: {},
        reqError:
          "Something went wrong with this search! Please try again later",
      });
    });
});

/* GET handle any invalid get request */
router.get("*", (req, res, next) => {
  // console.log(e.response.data.status_message);
  res.status(404).render("404", {
    message:
      "404! Ooops, we don't have what you are looking for! Maybe try something else?",
  });
});

module.exports = router;
