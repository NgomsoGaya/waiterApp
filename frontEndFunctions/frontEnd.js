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
        //display meassage for successful sign up
        if ((username && role && password && confirmpassword)) {
            if (password !== confirmpassword) {
                return 'The provided passwords do not match'
            }
        }
    }
    function signUpMessage2(username, role, password, confirmpassword) {
      //display meassage for successful sign up
      if (username && role && password && confirmpassword) {
        if (password == confirmpassword) {
          return "You have signed up successfully.";
        }
      }
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
        signUpMessage2,
        confirmDaysMessage,
        resetDaysMessage
    }
}