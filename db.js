var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");

var dbConn = mongodb.MongoClient.connect(
  process.env.MONGODB_URI ||
    "mongodb://user:password123@ds019633.mlab.com:19633/heroku_dtl69fwz"
);

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "src/components/contact.js")));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("src/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "build", "index.html"));
  });
}
app.post("/post-feedback", function(req, res) {
  console.log("something");
  dbConn.then(function(db) {
    delete req.body._id; // for safety reasons
    db.collection("feedbacks").insertOne(req.body);
  });
  res.write("<html><body>");
  res.write("Data received:\n" + JSON.stringify(req.body));
  res.write("You will be redirected shortly to the home page");
  res.write(
    "<script>setTimeout(function(){ window.location.href = 'https://goku-portfolio.herokuapp.com'; }, 3000);</script>"
  );
  res.write("</body></html>");
  res.send();
  //  res.sendFile("src/components/contact.js");
});
// app.get("/landingPage", function(req, res) {
//   res.sendFile(__dirname + "src/components/contact.js");
// });

app.listen(process.env.PORT || 2000, process.env.IP || "0.0.0.0");
