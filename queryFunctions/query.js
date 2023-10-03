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

            const userId = await db.oneOrNone(
                "SELECT id FROM users WHERE name = $1",
                [username]
            )

            for (const shiftIdValue of allIds) {
                await db.none(
                  "INSERT INTO usershifts (user_id, shift_id) VALUES ($1, $2)",
                  [userId.id, shiftIdValue]
                );
            }
        }
    }

    return {
        signUp,
        login,
        confirmDays
    }
}