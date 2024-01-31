let submitText = "";
function submitForm()
{
    console.log(document.getElementById("fname").value);
    document.getElementsByClassName("page-contents")[0].innerHTML = `<p>${document.getElementById("fname").value} ${document.getElementById("lname").value} your application will be reviewed shortly.</p>`;
}