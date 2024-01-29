let isPlaying = true;
let audioPlayer, pageContents;
window.onload = function ()
{
    audioPlayer = document.getElementById("audio-p");
    pageContents = document.getElementsByClassName("page-contents")[0];
    console.log(pageContents.children.length);
    for(let i = 0; i < pageContents.children.length; i++)
    {
        if(pageContents.children[i].id != "doi")
        {
            pageContents.children[i].tabIndex = -1;
        }
    }
    
};
//This function hide the overlay and start the audio.
function startAudio()
{
    document.getElementById("site-access-overlay").style.display = "none";
    document.getElementById("site-access").style.display = "none";
    audioPlayer.play();
    for(let i = 0; i < pageContents.children.length; i++)
    {
        if(pageContents.children[i].id != "doi")
        {
            pageContents.children[i].tabIndex = 1;
        }
    }

}
//This function stop audio and hide audio player along with the stop button.
function stopAudio()
{
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.style.display = "none";
    document.getElementById("audio-stop").style.display = "none";

}
//This function toggle between stop or playing the audio on the page, and update the button that click to run this function accordingly.
function stopResumeAudio(el)
{
    if(isPlaying)
    {
        audioPlayer.pause();
        isPlaying = false;
        el.innerHTML = "Resume audio";
    }
    else
    {
        audioPlayer.play();
        isPlaying = true;
        el.innerHTML = "Pause audio";
    }
    
}