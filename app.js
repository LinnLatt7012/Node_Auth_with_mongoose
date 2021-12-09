var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    User                    = require('./models/user'),
    LocalStrategy           =require('passport-local');
    passportLocalMongoose   =require("passport-local-mongoose");

mongoose.connect('mongodb://localhost:27017/unth_demo_app', {useNewUrlParser: true, useUnifiedTopology: true});


var app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

app.use(require("express-session")({
    secret: "BTS is the best boy band",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                            Routes                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res){
    res.render("home");
});
app.get("/secret",isloggedIn,function(req, res){
    res.render("secret");
})
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({username: username}),password, function(err,user){
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate("local")(req,res,function(){
               res.redirect("secret");
            })
        }
    })
   
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logOut();
    res.redirect('/');
})

function isloggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(8080, function(){
    console.log("Started Server");
})