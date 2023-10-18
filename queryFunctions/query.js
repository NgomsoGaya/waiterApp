export default function query(db) {

    async function signUp(username, role, password, confirm) {
        if (username && role && password && confirm) {
            await db.none(
              "INSERT INTO users (name, password, role) VALUES ($1, $2, $3)",
              [username, password, role]
            );
        }
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
        let shiftId = []
        const allIds = []
        if (arrayOfDays && username) {
            for (let i = 0; i < arrayOfDays.length; i++) {
                const element = arrayOfDays[i];
                shiftId.push(await db.any(
                    "SELECT id FROM shifts WHERE day = $1",
                    [element]
                ))
            }
            shiftId.forEach(innerArray => {
                innerArray.forEach(obj => {
                    allIds.push(obj.id)
                })
            })

            userId.push(await db.oneOrNone(
                "SELECT id FROM users WHERE name = $1",
                [username]
            ))

            for (const shiftIdValue of allIds) {
                await db.none(
                  "INSERT INTO usershifts (user_id, shift_id) VALUES ($1, $2)",
                  [userId[0].id, shiftIdValue]
                );
            }
        }
    }
    async function displayWaiter() {
        let schedule = {
          mondayWaiter: await db.any(
            "SELECT users.name FROM users INNER JOIN usershifts ON users.id = usershifts.user_id WHERE usershifts.shift_id = 1"
          ),
          tuesdayWaiter: await db.any(
            "SELECT users.name FROM users INNER JOIN usershifts ON users.id = usershifts.user_id WHERE usershifts.shift_id = 2"
          ),
          wednesdayWaiter: await db.any(
            "SELECT users.name FROM users INNER JOIN usershifts ON users.id = usershifts.user_id WHERE usershifts.shift_id = 3"
          ),
          thursdayWaiter: await db.any(
            "SELECT users.name FROM users INNER JOIN usershifts ON users.id = usershifts.user_id WHERE usershifts.shift_id = 4"
          ),
          fridayWaiter: await db.any(
            "SELECT users.name FROM users INNER JOIN usershifts ON users.id = usershifts.user_id WHERE usershifts.shift_id = 5"
          ),
          sartudayWaiter: await db.any(
            "SELECT users.name FROM users INNER JOIN usershifts ON users.id = usershifts.user_id WHERE usershifts.shift_id = 6"
          ),
          sundayWaiter: await db.any(
            "SELECT users.name FROM users INNER JOIN usershifts ON users.id = usershifts.user_id WHERE usershifts.shift_id = 7"
          ),
        };
      
        return schedule
    }
  
  async function clearWaiters() {
    await db.none("DELETE FROM usershifts")
  }
  
  async function keepButtonsChecked(userName) {
    //on login go to database and see which days the logged in person selected
    try {
      // Query to select the days for a given user name
      const query = `
      SELECT s.day
      FROM users AS u
      JOIN usershifts AS us ON u.id = us.user_id
      JOIN shifts AS s ON us.shift_id = s.id
      WHERE u.name = $1;
    `;

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