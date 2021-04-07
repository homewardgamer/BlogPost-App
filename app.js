//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');
mongoose.connect("mongodb+srv://admin-aditya:test123@cluster0.hmlzu.mongodb.net/blogDB", {
  useNewUrlParser: true
});
const postSchema = new mongoose.Schema({
  title: String,
  blog: String
});
const Post = mongoose.model("Post", postSchema);



const homeStartingContent = "Hola,Peeps! If you are on this website either you are a friend of mine or just a random traveller going through every Website on the internet(Don't try unless you are stuck in a space time continuum for an eternity).I have made this website to showcase my personal opinions which dosen't matter anyways.Okay so the main thing is I can't just keep Lorem Ipsum here so I have to write some random shit here, so bear with me please. So yeah as I was saying if you are here take some time to browse around.Look for some hidden features and report any bug to me,I will even give you the admin passcode :-).";
const aboutContent = "My name is Aditya Verma, I am a full stack developer. I am currently a first year Student at IIIT Allahabad.";
const contactContent = "Contact Me or get in touch or whatever with me on various platforms given below at the footer or end of the webpage";

const app = express();
// var arr=[];
// var head=[];
var passcode = "nothing!";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));




app.get('/', (req, res) => {

  Post.find(function (err, arr) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        arr: arr,
      });

    }
  });



});
app.get('/about', (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  });
});
app.get('/contact', (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get('/compose', (req, res) => {
  res.render("compose")
});


app.post('/', (req, res) => {
  var p = req.body.pass;
  if (p == passcode) {
    const h = req.body.head;
    const b = req.body.data;
    const p = new Post({
      title: h,
      blog: b
    })
    p.save();
  }

  res.redirect('/');
})
app.get("/post/:title", (req, res) => {
  Post.find(function (err, arr) {
    if (err) {
      console.log(err);
    } else {


      for (var i = 0; i < arr.length; i++) {
        if (_.lowerCase(req.params.title) === _.lowerCase(arr[i].title)) {

          var x = arr[i].title;
          var y = arr[i].blog;
          res.render('post', {
            x: x,
            y: y
          });
        }
      }
    }
  });



});


app.get("/delete", (req, res) => {
  Post.find((err, arr) => {
    if (err) {
      console.log(err);
    } else {
      res.render('del', {
        arr: arr

      });
    }

  });

});
app.post("/delete", (req, res) => {

  if (req.body.pass == passcode) {
    const del = req.body.select;
    Post.deleteOne({
      _id: del
    }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted");
      }
    });
  }
  res.redirect('/');

});


let port =process.env.PORT;
if(port==null||port==""){
    port=3000;
}
app.listen(port);

