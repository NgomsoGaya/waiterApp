export default function query(db) {

    async function signUp(username, role, password, confirm) {
      if (username && role && password && confirm) {
        // Check if the username already exists in the database
        const existingUser = await db.oneOrNone(
          "SELECT * FROM users WHERE name = $1",
          username
        );

        if (existingUser) {
          // Username already exists, handle the error or return an appropriate message
          return "Username already exists";
        } else if (password === confirm) {
          // Insert the new user into the database
          await db.none(
            "INSERT INTO users (name, password, role) VALUES ($1, $2, $3)",
            [username, password, role]
          );
          return "Sign-up successful";
        }
      }
      return "Sign-up failed"; // Return a general failure message
    }

    async function login(username, password) {
        let role = null

        if (username && password) {
            
            const user = await db.oneOrNone(
                "SELECT role FROM users WHERE name = $1 AND password= $2",
                 [username, password] 
            )

            if (user) {
                role = user.role;
            }
        }
        return role
    }

    const userId = []

   async function confirmDays(arrayOfDays, username) {
     if (arrayOfDays && username) {
       // Fetch the current shift IDs for the user
       const existingShifts = await db.manyOrNone(
         "SELECT shift_id FROM usershifts WHERE user_id = (SELECT id FROM users WHERE name = $1)",
         [username]
       );

       // Convert the result to an array of shift IDs
       const existingShiftIds = existingShifts.map((shift) => shift.shift_id);

       // Iterate through the existingShiftIds and check if they are not in arrayOfDays
       for (const shiftId of existingShiftIds) {
         if (!arrayOfDays.includes(shiftId)) {
           // If the shift_id is not in arrayOfDays, remove it from usershifts
           await db.none(
             "DELETE FROM usershifts WHERE user_id = (SELECT id FROM users WHERE name = $1) AND shift_id = $2",
             [username, shiftId]
           );
         }
       }

       // Fetch and insert new shifts
       for (const day of arrayOfDays) {
         const shiftId = await db.oneOrNone(
           "SELECT id FROM shifts WHERE day = $1",
           [day]
         );
         if (shiftId) {
           // Check if the combination already exists
           const combinationExists = await db.oneOrNone(
             "SELECT user_id, shift_id FROM usershifts WHERE user_id = (SELECT id FROM users WHERE name = $1) AND shift_id = $2",
             [username, shiftId.id]
           );

           if (!combinationExists) {
             // Insert the new combination
             await db.none(
               "INSERT INTO usershifts (user_id, shift_id) VALUES ((SELECT id FROM users WHERE name = $1), $2)",
               [username, shiftId.id]
             );
           }
         }
       }
     }
   }
  
  function getDayName(day) {
    const daysOfWeek = [
      "mondayWaiter",
      "tuesdayWaiter",
      "wednesdayWaiter",
      "thursdayWaiter",
      "fridayWaiter",
      "saturdayWaiter",
      "sundayWaiter",
    ];
    return daysOfWeek[day - 1];
  }

  async function displayWaiter() {
      const schedule = {};
      for (let day = 1; day <= 7; day++) {
        const result = await db.any(
          `
      SELECT users.name
      FROM users
      INNER JOIN usershifts ON users.id = usershifts.user_id
      WHERE usershifts.shift_id = $1
    `,
          [day]
        );
        schedule[getDayName(day)] = result;
      }
      return schedule;
  }

  async function clearWaiters() {
    await db.none("DELETE FROM usershifts")
  }
  
  async function keepButtonsChecked(userName) {
    //on login go to database and see which days the logged in person selected
    try {
      // Query to select the days for a given user name
      const query = `
     SELECT shifts.day
     FROM users
     JOIN usershifts ON users.id = usershifts.user_id
     JOIN shifts ON usershifts.shift_id = shifts.id
     WHERE users.name = $1 `;

      // Execute the query with the user's name as a parameter
      const selectedDays = await db.manyOrNone(query, [userName]);

      return selectedDays;
    } catch (error) {
      throw error;
    }
  }
    return {
        signUp,
        login,
        confirmDays,
        displayWaiter,
        clearWaiters,
        keepButtonsChecked
    }
};