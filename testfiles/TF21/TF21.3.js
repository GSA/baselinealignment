
let stock, stockList = [];
let refreshTime = 5000;
let bidInterval, bidPrice, priceToBid, currBid = 0;
//This function start multiple timers to update stock.
function setStockIntervals()
{
    stock = document.getElementsByClassName("stock-div");
    for(let i = 0; i < stock.length; i++)
        setStockInterval(stock[i]);
}

//This function start timer to update stock.
function setStockInterval(stock)
{
    let currStock = setInterval(
        function()
        {
            updateStock(stock);
        }
        ,refreshTime);
    stockList.push(currStock);
}
//This function update the stock price and movement percentage.
function updateStock(stock)
{
    let currPrice = parseInt(stock.children[1].children[0].children[0].innerHTML); //Current price that will be update according to the price movement
    let currMove = stock.children[1].children[1];  //Current percent that will be update.
    updatePrice(stock,currPrice,updateMove(currMove));
}

//This function update the price according to the newMove.
function updatePrice(stock, currPrice, newMove)
{
    let newPrice = currPrice * ((100 + newMove)/100);
    newPrice = newPrice.toFixed(2);
    stock.children[1].children[0].children[0].innerHTML = newPrice;
}
//This function update the stock percentage movement (percentage and color), return the percentage movement.
function updateMove(move)
{
    let newMove = getRandomNum(-15,15);
    if(newMove < 0)
    {
        move.classList.remove("stock-up");
        move.classList.add("stock-down")
        move.children[0].innerHTML = newMove;
    }
    else
    {
        move.classList.remove("stock-down");
        move.classList.add("stock-up")
        move.children[0].innerHTML = "+"+newMove;
    }
    return newMove;
}
//This function get the random number in range min and max.
function getRandomNum(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//This function updates the refresh time for all of the stock according to the newTime (ms), and also hides the button that run this function.
function updateRefreshTime(newTime, el)
{
    el.style.display = "none";
    refreshTime = newTime;
    for(let i = 0; i < stockList.length; i++)
    {
       clearInterval(stockList[i]);
       stockList[i] = setInterval(
        function()
        {
            updateStock(stock[i]);
        }
        ,refreshTime);
       
    }
}
//This function initate stock to start refresh, and also hide the buttion that run this function.
function initiateRefreshTime(el)
{
    el.style.display = "none";
    setStockIntervals();
}

//This function update current bid.
function setLiveBidding()
{
    bidInterval = setInterval(
        function()
        {
            currBid = parseInt(bidPrice.innerHTML) + getRandomNum(100,500);
            bidPrice.innerHTML = currBid;
            priceToBid.innerHTML= currBid+1;
        }
    ,8000
    );
}

//This function submit the bidding that user insert. If user insert equal or less than the current bid do nothing, else update and reset the bidInterval timer.
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
        clearInterval(bidInterval);
        setLiveBidding();
    }
    else
    {
        bidWarning.innerHTML= `Sorry $ ${newBid} is insufficient amount to place bid.`;
    }
}

window.onload = function ()
{
    if(document.title == '21.1-ic-dna-4')
    {
        currBid = 1000;
        bidPrice = document.getElementById('current-bid');
        priceToBid = document.getElementById('price-to-bid');
        bidPrice.innerHTML= currBid;
        priceToBid.innerHTML= currBid+1;
        setLiveBidding();
    }
    else if(document.title != "21.3-ic-dna-2")
    {
        stock = document.getElementsByClassName("stock-div");
        for(let i = 0; i < stock.length; i++)
            setStockInterval(stock[i]);
    }
};
