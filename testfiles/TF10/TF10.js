let alertNotfication;
//This function show the submission successfully when user insert the correct date format and the date is valid.
function submitDateForm()
{
    let currDate = document.getElementById("date");
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
        alertNotfication.innerHTML = "Form error";
    }
    else if((currDate.value.length == 10) && (dateCheck == "Invalid Date"))
    {
        alertNotfication.innerHTML = "Error: Date you insert is invalid.";
    }
    else if(document.title != "10.6-ic-dna-2")
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
    {
        //Check captilization
        if((fname.value !== fname.value.toLowerCase())&&(lname.value !== lname.value.toLowerCase()))
        {
            alertNotfication.innerHTML = "Error: Username and Password contain upper case character(s).";
        }
        else if(fname.value !== fname.value.toLowerCase())
        {
            alertNotfication.innerHTML = "Error: Username contain upper case character(s).";
        }
        else if(lname.value !== lname.value.toLowerCase())
        {
            alertNotfication.innerHTML = "Error: Password contain upper case character(s).";
        }
        else
        {
            document.getElementsByClassName("page-contents")[0].innerHTML = `<p>Thank You ${fname.value}, we will review your application shortly.</p>`;
        }
    }
    else if(document.title == "10.6-all-pass-2")
    {
        //Both username and password are not inserted.
        if((fname.value.length == 0)&&(lname.value.length == 0))
        {
            alertNotfication.innerHTML = "Username and Password are required.";
        }
        //Username is not inserted.
        else if(fname.value.length == 0)
        {
            alertNotfication.innerHTML = "Username is required; please input user name.";
        }
        //Password is not inserted
        else if(lname.value.length == 0)
        {
            alertNotfication.innerHTML = "Password is required; please input your password.";
        }
    }
    else 
    {
        alertNotfication.innerHTML = "Form error";
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