let timerInterval;
function setTimer(duration, display) {
    // let timer = duration;
    let minutes, seconds;
    

    timerInterval = setInterval(function () 
    {
        //Update minutes and seconds according to the timer update
        minutes = parseInt(duration / 60, 10);
        seconds = parseInt(duration % 60, 10);
        display.innerHTML = (minutes = minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        //Decrement the duration, if the duration exceed 0 stop the timer.
        if (--duration < 0)
        {
            clearInterval(timerInterval);
            document.getElementsByClassName("timer-form")[0].innerHTML = `<p>Thank You</p><p>The form was submitted successfully.</p>`;
        }
    }, 1000);
}

window.onload = function () {
    let duration = 30; //Second
    let display = document.getElementById('time-limit'); //Where to display
    display.innerHTML = "00:30";
    setTimer(duration, display);
};

function stopTimer()
{
    clearInterval(timerInterval)
    document.getElementById("timer-div").innerHTML = "";
}