
let helpButton,sideNav,sideNavDisplay = false;
//Run after all the content loaded.
document.addEventListener("DOMContentLoaded", function() {
    if((document.title == "02.2-1.a.i-fail-1"))
    {
        sideNav = document.getElementById("help-sidenav");  
        setSideNavTabIndex(-1);
    }
    if((document.title =="02.2-1.b.i-fail-1"))
    {
        sideNav = document.getElementById("help-sidenav");  
        setSideNavTabIndex(-1);
    }
    
});
//This function removes keyboard focus from the current element user currently focus on after 2 seconds.
function hideFocus(el)
{
    setTimeout(function ()
    {
        el.blur();
    },2000)
}
//This fucntion hide/unhide the side nav.
function toggleSideNav()
{
   if(sideNavDisplay == false)
   {
        sideNavDisplay = true;
        sideNav.classList.remove("sidenav-hide");
        sideNav.classList.add("sidenav-display");
        setSideNavTabIndex(0);
   }
   else
   {
        sideNavDisplay = false;
        sideNav.classList.remove("sidenav-display");
        sideNav.classList.add("sidenav-hide");
        setSideNavTabIndex(-1);
   }
}

//This fucntion hide/unhide the side nav and set tabIndex for all content inside in order.
function toggleSideNavOrder()
{
   if(sideNavDisplay == false)
   {
        sideNavDisplay = true;
        sideNav.classList.remove("sidenav-hide");
        sideNav.classList.add("sidenav-display");
        setFormInputTabIndex(-1);
        for(let i = 0; i < sideNav.children.length; i++)
        {
            if(i == 0)
            sideNav.children[i].tabIndex = sideNav.children.length;
            else
            sideNav.children[i].tabIndex = i;
        }
        sideNav.children[1].focus();
   }
   else
   {
        sideNavDisplay = false;
        sideNav.classList.remove("sidenav-display");
        sideNav.classList.add("sidenav-hide");
        setSideNavTabIndex(-1);
        document.getElementById("submit-button").focus();
        setFormInputTabIndex(0);
   }
}
//This function set tabIndex for all the children in the side navigation according to the value.
function setSideNavTabIndex(value)
{
    for(let i = 0; i < sideNav.children.length; i++)
    {
        sideNav.children[i].tabIndex = value;
    }
}
//This function set tabIndex of all input element that have classname "form-input" according to value arguement.
function setFormInputTabIndex(value)
{
    let formInput = document.getElementsByClassName("form-input");
    for(let i =0;  i < formInput.length; i++)
    {
        formInput[i].tabIndex = value;
    }
}
//This function print out the text when user press submitted button.
function submitForm()
{
    document.getElementById("tc_code").innerHTML = "Your form have been submitted!"
}