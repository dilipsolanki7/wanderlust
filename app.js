if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
//console.log(process.env.secret)

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error",(err)=>{
    console.log("Error in Mongo session store",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));               //required for req.body
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

/* app.get("/demouser", async (req,res)=>{
    let fakeUser = new User({
        email: "user@gmail.com",
        username : "user123"
    });
    let registeredUser = await User.register(fakeUser, "Mypassword");
    res.send(registeredUser);
}); */

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);



main()
    .then( ()=>{ 
        console.log("connection successful") ;
    })
    .catch( (err) => console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}



/* app.get("/testlisting", async (req,res)=>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 820,
        location: "California,USA",
        country: "USA"
    });

    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
}); */

// app.get("/",(req,res)=>{
//     res.send("Working root");
//     //res.redirect("https://en.wikipedia.org/wiki/Airbnb");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));

});

app.use((err,req,res,next)=>{
    // res.send("Something went wrong");
    /* let {statuscode=500,message="something went wrong"}= err;
    res.status(statuscode).send(message); */
    res.render("./listings/error.ejs",{err});
});

app.listen(port,()=>{
    console.log("server is listening on port 8080");
});


