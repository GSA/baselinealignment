window.onload = function ()
{
    
};
//This function hide the overlay and start the audio.
function startAudio()
{
    document.getElementById("site-access-overlay").style.display = "none";
    document.getElementById("site-access").style.display = "none";
    document.getElementById("audio-p").play();

}
//This function stop audio and hide audio player along with the stop button.
function stopAudio()
{
    let audioPlayer = document.getElementById("audio-p");
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.style.display = "none";
    document.getElementById("audio-stop").style.display = "none";

}