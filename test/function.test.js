import assert from "assert";
import query from "../queryFunctions/query.js";
import pgPromise from "pg-promise";
const pgp = pgPromise();

// Use a separate test database
const testConnectionString =
  process.env.test_connection_string ||
  "postgres://ysbapcaq:S_SA4t8KHJP_hUxibA_GPnebTvXOCEEg@ella.db.elephantsql.com/ysbapcaq";

const db = pgp(testConnectionString);

describe("Testing my waiter Web App", function () {
  this.timeout(20000);

  beforeEach(async function () {
    try {
      // Insert test data into the test database
      // await db.none(
      //   "INSERT INTO users (name, password, role) VALUES ($1, $2, $3)",
      //   ["low", "broke", "waiter"]
      // );
      //await db.none("INSERT INTO shifts (day) VALUES ($1)", ["monday"]);
      // Insert more data as needed for your tests.
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

  afterEach(async function () {
    try {
      // await db.none(
      //   "DELETE FROM usershifts WHERE user_id = (SELECT id FROM users WHERE name = $1)",
      //   ["low"]
      // );
      // // Remove the test data from the test database
      // await db.none("DELETE FROM users WHERE name = $1", ["low"]);
      //await db.none("DELETE FROM shifts WHERE day = $1", ["monday"]);
      // Delete more records if needed.
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

  it("Should allow a signed up waiter to add days", async function () {
    try {
      let queryFunction = query(db);

      // No need to sign up the waiter, as test data is already inserted.
      await queryFunction.signUp("low", "waiter", "2222", "2222")
      // Log in the waiter
      const role = await queryFunction.login("low", "broke");
      //assert.equal(role, "waiter");

      //await queryFunction.keepButtonsChecked("pants")
      // Confirm working days
      await queryFunction.confirmDays(
        ["monday", "tuesday", "wednesday"],
        "low"
      );

      // Check if working days have been added successfully
      const selectedDays = await queryFunction.keepButtonsChecked("low");
       const selectedDayNames = selectedDays.map((day) => day.day);

      assert.deepEqual(selectedDayNames, ["monday", "tuesday", "wednesday"]);
    } catch (err) {
      console.log(err);
    }
  });

  // Add more test cases for other functions as needed

  // it("Should clear the schedule successfully", async function () {
  //   try {
  //     let queryFunction = query(db);

  //     // No need to sign up the waiter, as test data is already inserted.

  //     // Log in the waiter
  //     const role = await queryFunction.login("coinz", "broke");
  //     assert.equal(role, "waiter");

  //     // Confirm working days
  //     await queryFunction.confirmDays(
  //       ["monday", "tuesday", "wednesday"],
  //       "coinz"
  //     );

  //     // Clear the schedule
  //     await queryFunction.clearWaiters();

  //     // Check if the schedule has been cleared successfully
  //     const selectedDays = await queryFunction.keepButtonsChecked("coinz");
  //     assert.deepEqual(selectedDays, []);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //});
});
