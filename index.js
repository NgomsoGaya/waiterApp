//importing several dependencies essential for various aspects of the application.
import express from "express";
import flash from "express-flash";
import session from "express-session";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import "dotenv/config";
import pgPromise from "pg-promise";
import render from "./renderFunctions/render.js";

//setting up the PostgreSQL database connection using the pg-promise library and using an environment variable DATABASE_URL for the connection string.
const connectionString = process.env.DATABASE_URL;
const pgp = pgPromise();
const db = pgp(connectionString);

export { db, connectionString };

//setting up the Express application with Handlebars as the view engine. Handlebars templates are expected to be located in the views directory, and i've also configured partialsDir and layoutsDir.
const handlebarSetup = exphbs.engine({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
});

//Creating an Express Application:
const app = express();

//Setting Up Handlebars as the View Engine:
app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");

//Configuring the Views Directory:
app.set("views", "./views");

//Using express-flash Middleware:
app.use(flash());

//Serving Static Files:
app.use(express.static("public"));
app.use("/frontEndFunctions", express.static("frontEnd"));

//first line is for parsing URL-encoded form data, and the second line is for parsing JSON data. The extended: true option allows for parsing nested objects.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configuring session management using express-session. Sessions are used to maintain user data across requests.
app.use(
  session({
    secret: "waiterApplication",
    resave: false,
    saveUninitialized: true,
  })
);

const mainrender = render();

app.get("/signup", mainrender.signUp);
app.post("/signup", mainrender.signUp2);

app.get("/", mainrender.login);
app.post("/login", mainrender.enter);

app.get("/choosedays/:username", mainrender.restrictAccessToUserRoutes, mainrender.chooseDays);
app.post("/choosedays/:username", mainrender.chosenDays);

app.get("/confirmdays/:username", mainrender.restrictAccessToUserRoutes, mainrender.confirmDays);
app.post("/confirmdays/:username", mainrender.confirmDaysPost);

app.get(
  "/days/:username",
  mainrender.restrictAccessToUserRoutes,mainrender.admin
);
app.post("/admin", mainrender.clear)

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});