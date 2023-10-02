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

    async function enter(req, res, next) {

        const username = req.body.username;
        const password = req.body.password;

        if (username, password) {
          res.redirect(`/choosedays/${username}`);
        } else {
          res.redirect("/login");
        }
    }

    async function chooseDays(req, res, next) {
        try {
            const username = req.params.username;

            res.render("choosedays", {username})
        } catch (error) {
            next(error)
        }
    }

    async function chosenDays(req, res, next) {
        const days = req.body.days;
        console.log(days)
        const username = req.params.username

        if (days) {
            res.redirect(`/confirmdays/${username}`)
        } else {
            res.redirect(`/choosedays/${username}`);
        }
    }

    async function confirmDays(req, res, next) {
        try {
            const username = req.params.username;

            res.render("confirmdays", {username})
        } catch (error) {
            next(error)
        }
    }
    
    return {
        signUp,
        login,
        enter,
        chooseDays,
        chosenDays,
        confirmDays
        
    }
}