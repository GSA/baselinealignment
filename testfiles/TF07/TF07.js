//This function show the submission successfully when user insert both first name and last name, else give them error message.
function submitForm()
{
    let fname = document.getElementById("fname");
    let lname = document.getElementById("lname");
    let audio = new Audio('../assets/audio/alert-bell.wav');
    if((fname.value.length > 0) && (lname.value.length > 0))
        document.getElementsByClassName("page-contents")[0].innerHTML = `<p>Thank You ${fname.value}, we will review your application shortly.</p>`;
    else if(document.title == '07.3-1-fail-2')
    {
        document.getElementById("alert-notification").innerHTML = "Error! cannot submit the form.";
        audio.play();
    }
    else
    {
        audio.play();
    }
}