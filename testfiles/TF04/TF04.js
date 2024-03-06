let skipButton, searchInput, pageLink;
document.addEventListener("DOMContentLoaded", 
function()
{
    if(document.title == "04.a-4-fail-1")
    {
        skipButton = document.getElementById("skip-maincontent");
        searchInput = document.getElementById("site-search");
        skipButton.addEventListener("click", function()
        {
            searchInput.focus();
        }
        );
    }
    if(document.title == "04.a-4-fail-2")
    {
        skipButton = document.getElementById("skip-maincontent");
        pageLink = document.getElementById("bottom-link");
        skipButton.addEventListener("click", function()
        {
            pageLink.focus();
        }
        );
    }
    if(document.title == "04.a-all-pass-1")
    {
        skipButton = document.getElementById("skip-maincontent");
        pageLink = document.getElementById("first-link");
        skipButton.addEventListener("click", function()
        {
            pageLink.focus();
        }
        );
    }
});