document.getElementById("toDash").addEventListener("click", function() {
    window.location.href = "https://stock-tracker-dashboard.expense-tracker-demo.site";
});

document.getElementById("logout").addEventListener("click", function() {
    cookie_name = "stock_tracker_cookie_container"
    const now = new Date();
    const expirationTime = new Date(now.getTime() - 15 * 60 * 1000);
    document.cookie = `${cookie_name}=; domain=.expense-tracker-demo.site; expires=${expirationTime.toUTCString()}; path=/`;
    window.location.href = "https://stock-tracker-landing.expense-tracker-demo.site";
});


document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display elements from the server 
    fetchCurrentStocks();
});

encoded_id = getEncodedID_or_Landing();

document.getElementById("stock_search").addEventListener("click", function() {

    var company_name = document.getElementById("search_item").value;    

    if(company_name == "")
    {
        document.getElementById("error").innerHTML = "Enter Company Name";
    }
    else
    {
        search(company_name);
    }   
});

function search(company_name) {
    fetch('https://stock-tracker-l64w.onrender.com/search_stocks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({company_name:company_name,encoded_id:encoded_id}),        
    })
    .then(response => response.json())
    .then(data => {
        matches = data.matches;
        console.log(matches)
        const itemList = document.getElementById('search-results');
        matches.forEach(match => {
            const listItem = document.createElement('li');
            listItem.textContent =  match.company_name +" - "+ match.ticker; // Assuming the item has a 'name' property

            const removeStockButton = document.createElement('button');
            removeStockButton.textContent = 'Add Stock';
            removeStockButton.className = 'btn_new';

                // Attach a click event to the button
            removeStockButton.addEventListener('click', function () {
                    // Send a request to Flask backend to add the item to NoSQL
                addTicker(match.ticker); // Assuming each item has a unique 'id' property
            });
            listItem.appendChild(document.createElement('br'));
                // Append button to the list item
            listItem.appendChild(removeStockButton);

            // Append list item to the item list
            itemList.appendChild(listItem);
            itemList.appendChild(document.createElement('br'));
            itemList.appendChild(document.createElement('br'));
            document.getElementById("results").style.display = "block";
        });
    })
    
}

function fetchCurrentStocks()
{
    fetch('https://stock-tracker-l64w.onrender.com/get_current_tickers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },  
        body: JSON.stringify({encoded_id:encoded_id}),        
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.stocks)
        stocks = data.stocks;
        const itemList = document.getElementById('existing-stocks');
        stocks.forEach(stock => {
            const listItem = document.createElement('li');
            listItem.textContent = stock; // Assuming the item has a 'name' property

            const removeStockButton = document.createElement('button');
            removeStockButton.textContent = 'Remove Stock';
            removeStockButton.className = 'btn_remove';

                // Attach a click event to the button
            removeStockButton.addEventListener('click', function () {
                    // Send a request to Flask backend to add the item to NoSQL
                removeTicker(stock); // Assuming each item has a unique 'id' property
            });
            listItem.appendChild(document.createElement('br'));
                // Append button to the list item
            listItem.appendChild(removeStockButton);

            // Append list item to the item list
            itemList.appendChild(listItem);
            itemList.appendChild(document.createElement('br'));
            itemList.appendChild(document.createElement('br'));
        });
    })

}

function removeTicker(stockTicker) {
    // Send a POST request to your Flask backend to add the item to NoSQL
    fetch('https://stock-tracker-l64w.onrender.com/remove_stock_ticker', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({stockTicker:stockTicker,encoded_id:encoded_id}),
    })
    .then(response => response.json())
    
}

function addTicker(stockTicker) {
    // Send a POST request to your Flask backend to add the item to NoSQL
    fetch('https://stock-tracker-l64w.onrender.com/add_stock_ticker', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({stockTicker:stockTicker,encoded_id:encoded_id}),
    })
    .then(response => response.json())
    .then(data => {
        response = data.message;
        console.log(response)
    })
    
}

function getEncodedID_or_Landing() {
    const cookies = document.cookie.split(';');
    cookie_name = "stock_tracker_cookie_container"
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');

        if (name === cookie_name) {
            return value;
        }
    }
    location.href = 'https://stock-tracker-landing.expense-tracker-demo.site';
}

