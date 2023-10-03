import query from "../queryFunctions/query.js";
import pgPromise from "pg-promise";
import "dotenv/config";
const connectionString = process.env.DATABASE_URL;
const pgp = pgPromise();
const db = pgp(connectionString);

const queryFunctions = query(db);

export default function render() {
  let chosenDay = [];

  async function signUp(req, res, next) {
      try {
        //   let name = req.body.username
        //   let role = req.body.role
        //   let password = req.body.password  
          
        //   await queryFunctions.signUp(name, role, password);
          
      res.render("signup");
    } catch (error) {
      next(error);
    }
  }

    async function signUp2(req, res, next) {
      try {
        let name = req.body.username;
        let role = req.body.role;
        let password = req.body.password;

        await queryFunctions.signUp(name, role, password, password);

        res.redirect("/");
      } catch (error) {
        next(error);
      }
    }

  async function login(req, res, next) {
    try {
      res.render("login");
    } catch (error) {
      next(error);
    }
  }

  async function enter(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if ((username, password)) {
      res.redirect(`/choosedays/${username}`);
    } else {
      res.redirect("/login");
    }
  }

  async function chooseDays(req, res, next) {
    try {
      const username = req.params.username;

      res.render("choosedays", { username });
    } catch (error) {
      next(error);
    }
  }

  async function chosenDays(req, res, next) {
    const days = req.body.days;
    console.log(days);
    const username = req.params.username;

    if (days) {
      chosenDay = days;
      res.redirect(`/confirmdays/${username}`);
    } else {
      res.redirect(`/choosedays/${username}`);
    }
  }

  async function confirmDays(req, res, next) {
    try {
      const username = req.params.username;

      res.render("confirmdays", { username, chosenDay });
    } catch (error) {
      next(error);
    }
  }

  return {
      signUp,
      signUp2,
    login,
    enter,
    chooseDays,
    chosenDays,
    confirmDays,
  };
}
