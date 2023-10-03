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

    return {
        signUp,
        login
    }
}