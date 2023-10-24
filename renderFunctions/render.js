import query from "../queryFunctions/query.js";
import frontEnd from "../frontEndFunctions/frontEnd.js";

import pgPromise from "pg-promise";
import "dotenv/config";
const connectionString = process.env.DATABASE_URL;
const pgp = pgPromise();
const db = pgp(connectionString);

const queryFunctions = query(db);
const frontEndFunctions = frontEnd()

export default function render() {
  let chosenDay = [];

  async function signUp(req, res, next) {
      try {
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
        let confirm = req.body.confirm_password;

        let msg = frontEndFunctions.signUpMessage(name, role, password, confirm)
        let msg2 = frontEndFunctions.signUpMessage2(name, role, password, confirm)

        await queryFunctions.signUp(name, role, password, confirm);
        
        res.render("signup", {msg, msg2});
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
    async function admin(req, res, next) {
      try {
        let name = await queryFunctions.displayWaiter();
        //console.log(name)
        const noOfWaiters = [];

        for (const day in name) {
          if (name.hasOwnProperty(day)) {
            const waiters = name[day];
            noOfWaiters.push(waiters.length);
          }
        }

        const colors = [];

        for (let i = 0; i < noOfWaiters.length; i++) {
          const element = noOfWaiters[i];

          if (element == 3) {
            colors.push("enoughWaiter");
          } else if (element > 3) {
            colors.push("fewWaiter");
          } else if (element < 3) {
            colors.push("moreWaiter");
          }
        }

        let color = colors;
        
        //console.log(color)
        res.render("admin", { name, color });
      } catch (error) {
        next(error);
      }

    }

  async function enter(req, res, next) {
    const username = req.body.username;
      const password = req.body.password;
      
      let role = await queryFunctions.login(username, password)
    //console.log(role)
   let invalidUsername = frontEndFunctions.loginMessage()

    if (username && password && role == 'waiter') {
      res.redirect(`/choosedays/${username}`);
    } else if (username && password && role == "admin") {
        res.redirect(`/days/${username}`);
    } else if(username && password && role == null){
      res.render("login", {invalidUsername});
    }
  }

  async function chooseDays(req, res, next) {
    try {
      const username = req.params.username;

      // let loginSuccess = frontEndFunctions.loginSuccessMessage();


      let daysFromDb = await queryFunctions.keepButtonsChecked(username);

      // console.log(daysFromDb);
      let daysChecked = [];
      for (let i = 0; i < daysFromDb.length; i++) {
        const element = daysFromDb[i].day;
        daysChecked.push(element);
      }

      //console.log(daysChecked);

      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const preprocessedData = daysOfWeek.map((day) => ({
        day,
        checked: daysChecked.includes(day),
      }));

      //console.log(preprocessedData);

      res.render("choosedays", { username, preprocessedData});
    } catch (error) {
      next(error);
    }
  }

  async function chosenDays(req, res, next) {
    const days = req.body.days;
    //console.log(days);
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
      const showButton = true;

      res.render("confirmdays", { username, chosenDay, showButton });
    } catch (error) {
      next(error);
    }
  }

  async function confirmDaysPost(req, res, next) {
    try {
      const username = req.params.username;
      queryFunctions.confirmDays(chosenDay, username);
      let confirmMessage = frontEndFunctions.confirmDaysMessage()

      const showButton = false;
      
      res.render("confirmdays", { confirmMessage, showButton });
    } catch (error) {
      next(error);
    }
  }

  async function clear(req, res, next) {
    try {
       const username = req.params.username;
      queryFunctions.clearWaiters()
      let clearSuccess = frontEndFunctions.resetDaysMessage()

      res.render("admin", { clearSuccess });
    } catch (error) {
      next(error)
    }
  }

  return {
    signUp,
    signUp2,
    login,
    admin,
    enter,
    chooseDays,
    chosenDays,
    confirmDays,
    confirmDaysPost,
    clear
  };
}
