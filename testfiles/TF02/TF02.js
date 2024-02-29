let helpButton,sideNav,sideNavDisplay = false;
let inputPopup;
//Run after all the content loaded.
document.addEventListener("DOMContentLoaded", function() {
    if((document.title == "02.2-1.a.i-fail-1"))
    {
        sideNav = document.getElementById("help-sidenav");  
        setSideNavTabIndex(-1);
    }
    if((document.title =="02.2-1.b.i-fail-1") || (document.title =="02.C-2-pass-1"))
    {
        sideNav = document.getElementById("help-sidenav");  
        setSideNavTabIndex(-1);
    }
    if((document.title =="02.C-2-fail-3"))
    {
        inputPopup = document.getElementsByClassName("input-popup");
        console.log(inputPopup);
    }
    if((document.title == "02.C-2-pass-1"))
    {
        var dropdown = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("focus", function() 
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
    
});
//This function removes keyboard focus from the current element user currently focus on after 2 seconds.
function hideFocus(el)
{
    setTimeout(function ()
    {
        el.classList.add("hideBorderline");
    },1000)
}
//This function add back keyboard focus to the current element user currently focus on after 2 seconds.
function unhideFocus(el)
{
    // console.log (el);
    el.classList.remove("hideBorderline");
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
    if((sideNavDisplay == false)&&(document.title =="02.C-2-pass-1"))
    {
         sideNavDisplay = true;
         sideNav.classList.remove("sidenav-hide");
         sideNav.classList.add("sidenav-display");
         setFormInputTabIndex(-1);
         let tabValue = 0;
         for(let i = 0; i < sideNav.children.length; i++)
         {
            if(sideNav.children[i].id != "about-us-dropdown")
            {
                tabValue += 1;
                sideNav.children[i].tabIndex = tabValue;
            }
             else
             {
                for(let j = 0; j < sideNav.children[i].children.length; j++)
                {
                    tabValue += 1;
                    sideNav.children[i].children[j].tabIndex = tabValue;
                }
             }
         }
    }
   else if(sideNavDisplay == false)
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
   else if((sideNavDisplay == true) && ((document.title =="02.C-2-pass-1")))
   {
        sideNavDisplay = false;
        sideNav.classList.remove("sidenav-display");
        sideNav.classList.add("sidenav-hide");
        setSideNavTabIndex(-1);
        setFormInputTabIndex(0);
        document.getElementById("help").focus();
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
//This function change the page when user select it on the side navigation.
function changePage(page)
{
    let pageContentList = document.getElementById("tc_code").children;

    for(let i = 1; i < pageContentList.length; i++)
    {
        pageContentList[i].style.display = (page == pageContentList[i].id) ? "block" : "none";
    }
}

//This function click on the element that the agruement recieve.
function clickLink(el)
{
    el.click();
}
//This function display the popup for the input.
function displayPopup(el)
{
    const popUp = el.nextElementSibling;
    if(popUp)
    {   
        popUp.classList.remove("popup-hidden");
        popUp.children[1].focus();
    }   
}
//This function hide the popup when the anchor element on the popup is no longer focus.
function hidePopup(el)
{
    el.parentElement.classList.add("popup-hidden");
}
