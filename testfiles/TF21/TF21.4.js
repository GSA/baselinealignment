let isPlaying = true;
let audioPlayer, pageContents;
window.onload = function ()
{
    audioPlayer = document.getElementById("audio-p");
    pageContents = document.getElementsByClassName("page-contents")[0];
    for(let i = 0; i < pageContents.children.length; i++)
    {
        if(pageContents.children[i].id != "doi")
        {
            pageContents.children[i].tabIndex = -1;
        }
        //For the 21.4-1.a-pass-2
        if(pageContents.children[i].id == "audio-div")
        {   
            for(let j = 0; j < pageContents.children[i].children.length; j++)
            {
                pageContents.children[i].children[j].tabIndex = -1;
            }
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
        //If the Audio element has "audio-only-pause" as it classname, do not change it tabIndex.
        if((pageContents.children[i].id != "doi") && (pageContents.children[i].className != "audio-only-pause"))
        {
            pageContents.children[i].tabIndex = 0;  
        }
        //For the 21.4-1.a-pass-2
        if(pageContents.children[i].id == "audio-div")
        {   
            pageContents.children[i].tabIndex = -1;
            for(let j = 0; j < pageContents.children[i].children.length; j++)
            {
                if(pageContents.children[i].children[j].id != "audio-p")
                pageContents.children[i].children[j].tabIndex = 0;
            }
        }
    }

}
//This function stop audio and hide all buttons that relate to audio player.
function stopAudio()
{
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    document.getElementById("audio-stop").style.display = "none";
    document.getElementById("pause-resume-button").style.display = "none";

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