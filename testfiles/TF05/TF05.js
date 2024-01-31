let submitText = "";
function submitForm()
{
    console.log(document.getElementById("fname").value);
    document.getElementsByClassName("page-contents")[0].innerHTML = `<p>${document.getElementById("fname").value} ${document.getElementById("lname").value} your application will be reviewed shortly.</p>`;
}
window.onload = function ()
{

    if(document.title == "05.1-1-fail-1")
    {
        var dropdown = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("click", function() 
            {
                var dropdownContent = this.nextElementSibling;
                if (dropdownContent.style.display === "flex") 
                {
                    dropdownContent.style.display = "none";
                } 
                else 
                {
                    dropdownContent.style.display = "flex";
                }
                this.classList.toggle("active");
            });
            }
    }
    else if(document.title == "05.1-2-fail-1")
    {
        var dropdown = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("click", function() 
            {
                var dropdownContent = this.nextElementSibling;
                if (dropdownContent.style.display === "flex") 
                {
                    this.ariaExpanded = "true";
                    dropdownContent.style.display = "none";
                } 
                else 
                {
                    this.ariaExpanded = "false";
                    dropdownContent.style.display = "flex";
                }
                this.classList.toggle("active");
            });
            }
    }
    else if(document.title == "05.1-2-pass-1")
    {
        var dropdown = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("click", function() 
            {
                var dropdownContent = this.nextElementSibling;
                if (dropdownContent.style.display === "flex") 
                {
                    this.ariaExpanded = "false";
                    dropdownContent.style.display = "none";
                } 
                else 
                {
                    this.ariaExpanded = "true";
                    dropdownContent.style.display = "flex";
                }
                this.classList.toggle("active");
            });
            }
    }
}