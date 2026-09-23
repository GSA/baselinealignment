document.addEventListener("DOMContentLoaded",
function()
{

    if(document.title == "09.A-1-pass-1")
    {
        let flash = document.getElementById("flash-overlay");
        document.getElementById("flash-button").addEventListener("click", function() {
            flash.style.display = "block";
            setTimeout(function() 
            {
              flash.style.display = "none";
            }, 300);
          });
    }

});