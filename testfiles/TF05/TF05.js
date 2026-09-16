let submitText = "", pageContentList;
let ratingSlider, ratingOutput
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
    else
    {
        ratingSlider = document.getElementById("icecream-rating");
        ratingOutput = document.getElementById("rating");
        //Does contain Aria-label and function properly.
        if((document.title == "05.4-1-pass-1")||(document.title == "05.4-3-pass-1")||document.title == "05.4-3-fail-1")
            updateRating();
        //Does contain Aria-label but inaccurate.
        else if(document.title == "05.4-1-fail-1")
            updateWrongRating();
    }
}
function changePage(page)
{
    for(let i = 1; i < pageContentList.length; i++)
    {
        pageContentList[i].style.display = (page == pageContentList[i].id) ? "block" : "none";
    }
}
//This function update the rating according to the slider.
function updateRating()
{
    ratingOutput.children[0].innerHTML = `Current rating: ${ratingSlider.value}`;
    ratingOutput.ariaLabel = `Current rating: ${ratingSlider.value}`
}
//This function update the rating according to the slider correclty but not on the aria.
function updateWrongRating()
{
    ratingSlider.ariaValueNow = 11 - ratingSlider.value;
    ratingOutput.children[0].innerHTML = `Current rating: ${ratingSlider.value}`;
    ratingOutput.ariaLabel = `Current rating: ${(11 - ratingSlider.value)}`;
}

function updateContent() {
    const content = document.getElementById("content");
    const notification = document.getElementById("notification");
    
    // Change content and notify user
    content.textContent = "The content has been updated!";
    notification.classList.remove("hidden");
    
    // Change the role of content for accuracy
    content.setAttribute("role", "alert");
    notification.setAttribute("role", "status");
}

function updateContentInvalid() {
    const content = document.getElementById("content");
    const notification = document.getElementById("notification");
    
    // Change content and notify user
    content.textContent = "The content has been updated!";
    notification.classList.remove("hidden");
    
    // Change the role of content for accuracy
    content.setAttribute("role", "checkbox");
    notification.setAttribute("role", "checkbox");
}