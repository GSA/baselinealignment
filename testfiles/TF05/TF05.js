let submitText = "", pageContentList;
function submitForm()
{
    document.getElementsByClassName("page-contents")[0].innerHTML = `<p>${document.getElementById("fname").value} ${document.getElementById("lname").value} your application will be reviewed shortly.</p>`;
}
window.onload = function ()
{
    pageContentList = document.getElementById("tc_code").children;
    //Does not contain Aria-exapanded.
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
    //Does contain Aria-exapanded but mislabel.
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
    //Does contain Aria-exapanded and function properly.
    else if((document.title == "05.1-2-pass-1")||(document.title == "05.1-3-pass-1"))
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
    //Does contain Aria-exapanded but dissapear once it expan
    else if(document.title == "05.1-3-fail-1")
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
                    this.removeAttribute('aria-expanded');
                    dropdownContent.style.display = "flex";
                }
                this.classList.toggle("active");
            });
            }
    }
    //Aria expand does not change its status when the user expands the dropdown (wrong accessible name when expanded).
    else if(document.title == "05.1-3-fail-2")
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
                    dropdownContent.style.display = "flex";
                }
                this.classList.toggle("active");
            });
            }
    }
}
function changePage(page)
{
    for(let i = 1; i < pageContentList.length; i++)
    {
        pageContentList[i].style.display = (page == pageContentList[i].id) ? "block" : "none";
    }
}