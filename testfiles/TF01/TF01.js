let emailDiv, emailCb, emailInput, submitButton;
window.onload = function()
{
    emailDiv = document.getElementById("email-div");
    emailDiv.style.display = "none";
    emailCb = document.getElementById("email-checkbox");
    emailCb.tabIndex = -1;
    emailInput = document.getElementById("email");
    emailInput.tabIndex = -1;
    submitButton = document.getElementById("submit-button");
    submitButton.tabIndex = -1;
    document.addEventListener("keydown", function(event) 
    {
        // Check if the pressed key is "Shift" and "a" at the same time
        if (event.shiftKey && event.ctrlKey) 
        {
            emailCb.tabIndex = 0;
          emailInput.tabIndex = 0;
          submitButton.tabIndex = 0;
        }
    });
}

//This function display/hide email-div according to the checkbox.
function displayEmail()
{
    if(emailCb.checked == true)
    {
        emailDiv.style.display = "block";
    }
    else
    {
        emailDiv.style.display = "none";
    }
}
//This function show the submission successfully when user insert both first name and last name, else give them error message.
function submitForm()
{
    document.getElementsByClassName("page-contents")[0].innerHTML = `<p>Thank You, we will review your application shortly.</p>`;
}
