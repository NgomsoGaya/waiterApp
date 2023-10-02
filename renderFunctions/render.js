export default function render() {

    async function signUp(req, res, next) {
        try {
            res.render("signup")
        } catch (error) {
           next(error) 
        }
    }

    async function login(req, res, next) {
        try {
            res.render("login")
        } catch (error) {
            next(error)
        }
    }

    async function chooseDays(req, res, next) {
        try {
            res.render("choosedays")
        } catch (error) {
            next(error)
        }
    }

    async function confirmDays(req, res, next) {
        try {
            res.render("confirm")
        } catch (error) {
            next(error)
        }
    }
    
    return {
        signUp,
        login,
        chooseDays,
        confirmDays
        
    }
}