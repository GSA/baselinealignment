let timerInterval, currDuration, alertTimeInterval;
let extendDuration = 20; //How long is the time going to be extended if the user chooses to extend the time on the alert.
let alertTime = 10; //Time that the alert will pop up to ask if the user wants to extent the timer.
let alertTimeLimit = 20; // Time limit of the alert, once the time limit is reached will continue the timer with no extended time added.

//This function set the timer for the form.
function setTimer(duration, display) {
    timerInterval = setInterval(function () 
    {
        updateTime(display, duration);
        //Decrement the duration, if the duration exceed 0 stop the timer.
        if (--duration < 0)
        {
            submitForm();
        }
        //If the test case have the timeout alert.
        if(document.getElementById("overlay") !== null && duration == (alertTime-1))
        {   
            currDuration = duration;
            clearInterval(timerInterval);
            document.getElementById("alert-time-limit").innerHTML = "00:20";
            document.getElementById("overlay").style.display = "block";
            document.getElementById("timeout-alert").style.display = "block";
            setAlertTime(document.getElementById("alert-time-limit"));

        }
    }, 1000);
}
//This function set the timer for the alert.
function setAlertTime(display)
{
    let newTimeLimit = alertTimeLimit;
    alertTimeInterval =  setInterval(function () 
    {
        updateTime(display, newTimeLimit);
        //Decrement the duration, if the duration exceed 0 stop the timer.
        if (--newTimeLimit < 0)
        {
            continueTimer();
        }
    }, 1000);
}

//This function retrived and reflect the timer on the site
function updateTime(display, duration)
{
    //Update minutes and seconds according to the timer update
    let minutes = parseInt(duration / 60, 10);
    let seconds = parseInt(duration % 60, 10);
    display.innerHTML = (minutes = minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

//This function stop the timer.
function stopTimer()
{
    clearInterval(timerInterval);
    document.getElementById("timer-div").innerHTML = "";
}
//This function continue the timer.
function continueTimer()
{
    clearInterval(alertTimeInterval);
    let display = document.getElementById('time-limit');
    setTimer(currDuration, display);
    hideAlert();
}
//This function extent the timer according to extendDuration.
function extendTimer()
{
    clearInterval(alertTimeInterval);
    let display = document.getElementById('time-limit');
    setTimer(currDuration + extendDuration, display);
    hideAlert();
}

//This function hide the alert and the overlay.
function hideAlert()
{
    document.getElementById("overlay").style.display = "none";
    document.getElementById("timeout-alert").style.display = "none";
    document.getElementById("alert-time-limit").innerHTML = "00:20";
}

function submitForm()
{
    clearInterval(timerInterval);
    document.getElementsByClassName("timer-form")[0].innerHTML = `<p>Thank You</p><p>The form was submitted successfully.</p>`;
}

window.onload = function () {
    let duration = 30; //Second
    let display = document.getElementById('time-limit'); //Where to display
    display.innerHTML = "00:30";
    setTimer(duration, display);
};