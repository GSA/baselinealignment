let alertNotfication;
//This function show the submission successfully when user insert the correct date format and the date is valid.
function submitDateForm()
{
    let currDate = document.getElementById("currDate");
    console.log(currDate.value.length);
    let dateCheck = new Date(currDate.value);
    //Everything is correct
    if((currDate.value.length == 10) && (dateCheck != "Invalid Date"))
    {
        document.getElementsByClassName("page-contents")[0].innerHTML = `<p>${currDate.value} is the date you inserted.</p>`;
    }
    //Either date is invalid or format is invalid (Lack of detail explaination).
    else if(document.title == "10.6-all-fail-1")
    {
        alertNotfication.innerHTML = "Error: Failed due to error in date field.";
    }
    else if((currDate.value.length == 10) && (dateCheck == "Invalid Date"))
    {
        alertNotfication.innerHTML = "Error: Date you insert is invalid.";
    }
    else 
    {
        alertNotfication.innerHTML = "Error: Date must be in the format of MM/DD/YYYY.";
    }

}
//This function show the submission successfully when user insert both first name and last name.
function submitForm()
{
    let fname = document.getElementById("fname");
    let lname = document.getElementById("lname");
    if((fname.value.length > 0) && (lname.value.length > 0))
        document.getElementsByClassName("page-contents")[0].innerHTML = `<p>Thank You ${fname.value}, we will review your application shortly.</p>`;
    else 
    {
        alertNotfication.innerHTML = "Error in required field";
    }
}
window.onload = function ()
{
    alertNotfication = document.getElementById("alert-notification");
    //Show the warning if user have capslock on.
    if(document.title == "10.6-all-pass-2")
    {
        document.addEventListener('keyup', (e) => {
            if (e.getModifierState('CapsLock')) 
            {
                alertNotfication.innerHTML = "Warning: CAPS LOCK turned on";
            } else 
            {
                alertNotfication.innerHTML = "";
                console.log("Caps Lock is off");
            }
        });
    }
}