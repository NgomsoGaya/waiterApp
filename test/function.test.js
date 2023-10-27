import assert from "assert";
import query from "../queryFunctions/query.js";
import frontEnd from "../frontEndFunctions/frontEnd.js"
import pgPromise from "pg-promise";
const pgp = pgPromise();

// Use a separate test database
const testConnectionString =
  process.env.test_connection_string ||
  "postgres://ysbapcaq:S_SA4t8KHJP_hUxibA_GPnebTvXOCEEg@ella.db.elephantsql.com/ysbapcaq";

const db = pgp(testConnectionString);

describe("Testing my waiter Web App", function () {
  this.timeout(20000);

  describe("Testing my back end functions", function () { 

  it("Should allow a signed up waiter to add days", async function () {
    try {
      let queryFunction = query(db);

      await queryFunction.signUp("zig", "waiter", "2222", "2222")

      // Log in the waiter
      const role = await queryFunction.login("zig", "2222");
    
      //submit the days of your choice
      await queryFunction.confirmDays(
        ["Monday", "Tuesday", "Wednesday"],
        "zig"
      );

      // Check if working days have been added successfully
      const selectedDays = await queryFunction.keepButtonsChecked("zig");
       const selectedDayNames = selectedDays.map((day) => day.day);

      assert.deepEqual(selectedDayNames, ["Monday", "Tuesday", "Wednesday"]);
    } catch (err) {
      console.log(err);
    }
  });

  it("Should allow admin to clear the schedule successfully", async function () {
    try {
      let queryFunction = query(db);

      //sign up the waiter.
      await queryFunction.signUp("coinz", "waiter", "2222", "2222");

      // Log in the waiter
      await queryFunction.login("coinz", "2222");

      // Confirm working days
      await queryFunction.confirmDays(
        ["Monday", "Tuesday", "Wednesday"],
        "coinz"
      );

      //login the admin
      await queryFunction.login("ngomso", "2023");

      // Clear the schedule
      await queryFunction.clearWaiters();

      // Check if the schedule has been cleared successfully
      const selectedDays = await queryFunction.keepButtonsChecked("coinz");

      assert.deepEqual(selectedDays, []);
    } catch (err) {
      console.log(err);
    }
  });
    
    it("Should allow a signed up waiter to edit work days", async function () {
      try {
        let queryFunction = query(db);

        await queryFunction.signUp("dawg", "waiter", "2222", "2222");

        // Log in the waiter
        const role = await queryFunction.login("dawg", "2222");

        //submit the days of your choice
        await queryFunction.confirmDays(
          ["Monday", "Tuesday", "Wednesday"],
          "dawg"
        );

        //submit different days
        await queryFunction.confirmDays(
          ["Tuesday", "Wednesday", "Thursday"],
          "dawg"
        );

        // Check if working days have been added successfully
        const selectedDays = await queryFunction.keepButtonsChecked("dawg");
        const selectedDayNames = selectedDays.map((day) => day.day);

        assert.deepEqual(selectedDayNames, ["Tuesday", "Wednesday", "Thursday"]);
      } catch (err) {
        console.log(err);
      }
    });

    it("Should allow admin to see all the waiters who picked days", async function () {
      try {
        let queryFunction = query(db);

        //sign up a the waiter.
        await queryFunction.signUp("bino", "waiter", "2222", "2222");

        // Log in the waiter
        await queryFunction.login("bino", "2222");

        // Confirm working days
        await queryFunction.confirmDays(
          ["Monday", "Tuesday", "Wednesday"],
          "bino"
        );

        //login the admin
        await queryFunction.login("ngomso", "2023");

        // view the waiters working each day
        const viewEveryWaiter = await queryFunction.displayWaiter();

        assert.deepEqual(viewEveryWaiter, {
          fridayWaiter: [],
          mondayWaiter: [
            {
              name: "bino",
            },
          ],
          sartudayWaiter: [],
          sundayWaiter: [],
          thursdayWaiter: [
            {
              name: "dawg",
            },
          ],
          tuesdayWaiter: [
            {
              name: "dawg",
            },
            {
              name: "bino",
            },
          ],
          wednesdayWaiter: [
            {
              name: "dawg",
            },
            {
              name: "bino",
            },
          ],
        });
      } catch (err) {
        console.log(err);
      }
    });
    
  })
  
  describe("Testing frontEnd functions", function () {
    const {
      loginMessage,
      signUpMessage,
      signUpMessage2,
      confirmDaysMessage,
      resetDaysMessage,
    } = frontEnd();

    it("Should return 'Invalid name or password' for loginMessage when inputs are missing", function () {
      const message = loginMessage();
      assert.strictEqual(message, "Invalid name or password.");
    });

    it("Should return 'The provided passwords do not match' for signUpMessage when passwords don't match", function () {
      const message = signUpMessage(
        "username",
        "role",
        "password1",
        "password2"
      );
      assert.strictEqual(message, "The provided passwords do not match");
    });

    it("Should return 'You have signed up successfully.' for signUpMessage2 when all inputs are provided and passwords match", function () {
      const message = signUpMessage2(
        "username",
        "role",
        "password",
        "password"
      );
      assert.strictEqual(message, "You have signed up successfully.");
    });

    it("Should return 'You have updated your working shifts successfully!' for confirmDaysMessage", function () {
      const message = confirmDaysMessage();
      assert.strictEqual(
        message,
        "You have updated your working shifts successfully!"
      );
    });

    it("Should return 'You have cleared the schedule successfully!' for resetDaysMessage", function () {
      const message = resetDaysMessage();
      assert.strictEqual(
        message,
        "You have cleared the schedule successfully!"
      );
    });
  });

});
