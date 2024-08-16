function switchTab(tabNumber) {
    const titles = ["My Profile", "Checking", "Savings"];
    const contents = [
        "My Profile",
        "Checking Account: $20,000",
        "Savings Account $100,000"
    ];
    
    // Get the title tag
    document.title = titles[tabNumber - 1];

    // Update the content in the main container
    document.getElementById("app-main-content").innerText = contents[tabNumber - 1];
}