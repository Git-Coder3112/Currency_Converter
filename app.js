// This is where we get our currency info from
const BASE_URL = "https://api.freecurrencyapi.com/v1/latest";
const API_KEY = "fca_live_LIJt7O4jMHjpfwUTvUuERCzaUwaZxxGXzSVk0N8e";

// Grabbing stuff from our webpage
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertButton = document.querySelector('.convert-button');
const swapButton = document.getElementById('swap-button');
const resultDisplay = document.getElementById('result');
const themeToggle = document.querySelector('.theme-toggle');

// For our cool chart
let rateChart;

// Adds all the currencies to our dropdowns
function populateCurrencyDropdowns() {
    // Loop through all our currencies
    for (let currCode in countryList) {
        // Make a new option for each currency
        const option = document.createElement('option');
        // Set the value to the currency code
        option.value = currCode;
        // Show the code and country name
        option.textContent = `${currCode} - ${countryList[currCode]}`;
        // Add to both dropdowns
        fromCurrency.appendChild(option.cloneNode(true));
        toCurrency.appendChild(option);
    }
    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
    // Update the flags to match
    updateFlags();
}

// Changes the flags when we pick different currencies
function updateFlags() {
    // Get the flag images
    const fromFlag = fromCurrency.nextElementSibling;
    const toFlag = toCurrency.nextElementSibling;
    // Update the flag sources
    fromFlag.src = `https://flagsapi.com/${countryList[fromCurrency.value]}/flat/64.png`;
    toFlag.src = `https://flagsapi.com/${countryList[toCurrency.value]}/flat/64.png`;
}

// Does the actual money conversion
async function convertCurrency() {
    // Get the amount and currencies
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    try {
        // Ask the API for the conversion rate
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`);
        const data = await response.json();

        if (data.data) {
            // If we got data, do the math
            const rate = data.data[to];
            const result = (amount * rate).toFixed(2);
            // Show the result
            resultDisplay.textContent = `${amount} ${from} = ${result} ${to}`;
            // Update our chart
           
        } else {
            // If something went wrong, tell the user
            throw new Error(data.message || 'Failed to fetch exchange rate');
        }
    } catch (error) {
        // Log the error and tell the user
        console.error('Error:', error);
        resultDisplay.textContent = 'Error fetching exchange rate. Please try again.';
    }
}

// Swaps the currencies around
function swapCurrencies() {
    // Swap the values
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    // Update flags to match
    updateFlags();
    // Do the conversion again
    convertCurrency();
}


// Switches between light and dark mode
function toggleTheme() {
    // Flip the theme
    document.body.classList.toggle('dark-theme');
    // Add logic to change theme variables here
}

// Listen for when we click the convert button
convertButton.addEventListener('click', (e) => {
    // Stop the form from submitting
    e.preventDefault();
    // Do the conversion
    convertCurrency();
});

// Listen for when we click the swap button
swapButton.addEventListener('click', swapCurrencies);

// Listen for when we change the currencies
fromCurrency.addEventListener('change', updateFlags);
toCurrency.addEventListener('change', updateFlags);

// Listen for when we click the theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Gets everything started
populateCurrencyDropdowns();
convertCurrency();
