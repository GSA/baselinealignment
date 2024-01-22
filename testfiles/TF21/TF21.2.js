
let isPlaying = false;
let gifStatic, gifVideo;

//This function toggle between the image GIF or the animate GIF.
function toggleGif() {
    let gif = document.getElementById('animated-gif');
    let overlay = document.getElementById("gif-overlay");
    gif.src = (isPlaying) ? gifStatic : gifVideo;
    overlay.style.display = (isPlaying) ? "flex" : "none";
    isPlaying = !isPlaying;
}

window.onload = function ()
{
    gifStatic = "../assets/images/us-flag.png";
    gifVideo = "../assets/images/us-flag.gif";
};