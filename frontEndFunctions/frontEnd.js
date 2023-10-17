export default function frontEnd() {
   
    function loginMessage() {
        //if name don't exist display error message
        return 'Invalid name or password.'
        //if password don't match display error message
    }

    function loginSuccessMessage() {
        return 'You have been logged in successfully.'
    }

    function signUpMessage(username, role, password, confirmpassword) {
        //if name already exist display error message

        //if password don't match display error message

        //display meassage for successful sign up
    }

    function confirmDaysMessage() {
        //on confirm display a message that says 'work days have been added successfully'
        return 'You have updated your working shifts successfully!'
    } 

    function resetDaysMessage() {
        //when an admin clears the table display a success message
        return 'You have cleared the schedule successfully!'
    }


    return {
        loginMessage,
        loginSuccessMessage,
        signUpMessage,
        confirmDaysMessage,
        resetDaysMessage
    }
}