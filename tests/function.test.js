import assert from "assert";
import query from "../queryFunctions/query.js";
import pgPromise from "pg-promise";
//import { db } from "../index.js";
const pgp = pgPromise();
const connectionString =
  process.env.connection_string ||
  "postgres://amcyzkfm:RrgsaVEp4w-VugGH3YQjQbQKHeuwQJuP@dumbo.db.elephantsql.com/amcyzkfm";

const db = pgp(connectionString);

describe("Testing my waiter Web App", function () {
  this.timeout(20000);

  beforeEach(async function () {
    try {
        await db.none("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
         await db.none("TRUNCATE TABLE usershifts RESTART IDENTITY CASCADE");
    } catch (err) {
      console.log(err);
      throw err;
    }
  });

  it("Should allow a signed up waiter to add days", async function () {
    try {
      
      assert.deepEqual("", );
    } catch (err) {
      console.log(err);
    }
  });
    
  it("Should allow a signed up waiter to edit their working days", async function () {
    try {
      
      assert.deepEqual(" ", );
    } catch (err) {
      console.log(err);
    }
  });
  it("should allow the admin to see who is working for each day", async function () {
    try {
     
      assert.deepEqual("", );
    } catch (err) {
      console.log(err);
    }
  });
  it("Should allow the admin to delete all waiters for the week", async function () {
    try {

      assert.deepEqual("", );
    } catch (err) {
      console.log(err);
    }
  });
    
  it("Should display a message for successful sign up", async function () {
    try {

      assert.deepEqual("", );
    } catch (err) {
      console.log(err);
    }
  });
  it("Should display a message for successful login", async function () {
    try {

      assert.deepEqual("", );
    } catch (err) {
      console.log(err);
    }
  });
  it("Should display an errror message on sign up with an existing name", async function () {
    try {

      assert.deepEqual("", );
    } catch (err) {
      console.log(err);
    }
  });
  it("Should display an error message for a login with incorrect cridentials", async function () {
    try {
      
      assert.deepEqual("", );
    } catch (err) {
      console.log(err);
    }
  });
});