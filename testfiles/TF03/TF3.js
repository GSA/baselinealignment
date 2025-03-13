let timerInterval, currDuration, alertTimeInterval;
let submitText = "The form was submitted successfully.";
let extendDuration = 20; //How long is the time going to be extended if the user chooses to extend the time on the alert.
let alertTime = 10; //Time that the alert will pop up to ask if the user wants to extent the timer.
let alertTimeLimit = 20; // Time limit of the alert, once the time limit is reached will continue the timer with no extended time added.
let alertPopUpLimit = -1, popUplimitCount = 0; // Set how many time the Time limit pop up can be display.
let currBid = 0;

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
        currDuration = duration;
        //If the test case have the timeout alert.
        if(document.getElementById("overlay") !== null && duration == (alertTime-1))
        {   
            //Popup limit set.
            if((alertPopUpLimit > 0)&&(popUplimitCount < alertPopUpLimit))
            {
                clearInterval(timerInterval);
                displayAlert();
                popUplimitCount++;
            }
            //No Popup limit set (-1 is the default value of the alertPopUpLimit).
            else if(alertPopUpLimit == -1)
            {
                clearInterval(timerInterval);
                displayAlert();
            }

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
function displayAlert()
{
    document.getElementById("alert-time-limit").innerHTML = `00:${alertTimeLimit}`;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("timeout-alert").style.display = "block";
    setAlertTime(document.getElementById("alert-time-limit"));
}
//This function hide the alert and the overlay.
function hideAlert()
{
    document.getElementById("overlay").style.display = "none";
    document.getElementById("timeout-alert").style.display = "none";
    document.getElementById("alert-time-limit").innerHTML = `00:${alertTimeLimit}`;
}

function submitForm()
{
    clearInterval(timerInterval);
    document.getElementsByClassName("page-contents")[0].innerHTML = `<p>Thank You</p><p>${submitText}</p>`;
}

//This function submit the bidding that user insert. If user insert equal or less than the current bid do nothing, else update and reflect the new bid and extend the timer by 10 sec.
function submitBidding()
{
    let bidWarning = document.getElementById('bidding-warning');
    bidWarning.innerHTML = "";
    let newBid = parseInt(document.getElementById("bidding-amount").value);
    if(isNaN(newBid))
    {
        bidWarning.innerHTML= `Sorry that is invalid input.`;
    }
    else if(newBid > currBid)
    {
        document.getElementById('current-bid').innerHTML= newBid;
        document.getElementById('price-to-bid').innerHTML= newBid+1;
        currBid = newBid;
        extendBiddingTimer();
    }
    else
    {
        bidWarning.innerHTML= `Sorry $ ${newBid} is insufficient amount to place bid.`;
    }
}

//This function extend the time limit when user place a bid.
function extendBiddingTimer()
{
    let display = document.getElementById('time-limit');
    clearInterval(timerInterval);
    setTimer((currDuration > 10) ? currDuration : 10, display);
}

window.onload = function () {
    if(document.title == '21.1-all-fail-2')
    {
        alertPopUpLimit = 9;
    }
    else if(document.title == '21.1-all-fail-3')
    {
        alertTimeLimit = 10;
    }
    else if(document.title == '21.1-ic-dna-2')
    {
        submitText = "The live auction is now closed, we will reach out to you regarding the result.";
        currBid = 5000;
        document.getElementById('current-bid').innerHTML= currBid;
        document.getElementById('price-to-bid').innerHTML= currBid+1;
    }
    let duration = 30; //Second
    let display = document.getElementById('time-limit'); //Where to display
    display.innerHTML = "00:30";
    setTimer(duration, display);
};