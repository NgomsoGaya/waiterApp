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
          try {
            const scheduleData = await db.any(`
            SELECT shifts.day, users.name AS waiterName
            FROM shifts
            LEFT JOIN usershifts ON shifts.id = usershifts.shift_id
            LEFT JOIN users ON usershifts.user_id = users.id
        `);

            // Create an object to hold the data for each day
            const schedule = {
              mondayWaiter: null,
              tuesdayWaiter: null,
              wednesdayWaiter: null,
              thursdayWaiter: null,
              fridayWaiter: null,
              saturdayWaiter: null,
              sundayWaiter: null,
            };

            // Populate the schedule object with waiter names
            scheduleData.forEach(({ day, waiterName }) => {
              // Use day.toLowerCase() to match the variable names
              schedule[`${day.toLowerCase()}Waiter`] =
                waiterName || "No Waiter Assigned";
            });

            return schedule;
          } catch (error) {
            throw new Error(`Error fetching schedule data: ${error.message}`);
          } 
    }
    
    return {
        signUp,
        login,
        confirmDays,
        displayWaiter
    }
}