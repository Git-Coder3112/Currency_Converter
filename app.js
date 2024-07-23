const BASE_URL = "https://api.freecurrencyapi.com/v1/latest";
const API_KEY = "fca_live_LIJt7O4jMHjpfwUTvUuERCzaUwaZxxGXzSVk0N8e";

const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertButton = document.querySelector('.convert-button');
const swapButton = document.getElementById('swap-button');
const resultDisplay = document.getElementById('result');
const themeToggle = document.querySelector('.theme-toggle');

let rateChart;

function populateCurrencyDropdowns() {
    for (let currCode in countryList) {
        const option = document.createElement('option');
        option.value = currCode;
        option.textContent = `${currCode} - ${countryList[currCode]}`;
        fromCurrency.appendChild(option.cloneNode(true));
        toCurrency.appendChild(option);
    }
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
    updateFlags();
}

function updateFlags() {
    const fromFlag = fromCurrency.nextElementSibling;
    const toFlag = toCurrency.nextElementSibling;
    fromFlag.src = `https://flagsapi.com/${countryList[fromCurrency.value]}/flat/64.png`;
    toFlag.src = `https://flagsapi.com/${countryList[toCurrency.value]}/flat/64.png`;
}

async function convertCurrency() {
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`);
        const data = await response.json();

        if (data.data) {
            const rate = data.data[to];
            const result = (amount * rate).toFixed(2);
            resultDisplay.textContent = `${amount} ${from} = ${result} ${to}`;
            updateChart(from, to);
        } else {
            throw new Error(data.message || 'Failed to fetch exchange rate');
        }
    } catch (error) {
        console.error('Error:', error);
        resultDisplay.textContent = 'Error fetching exchange rate. Please try again.';
    }
}

function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateFlags();
    convertCurrency();
}

async function updateChart(from, to) {
    const labels = [];
    const rates = [];

    // Fetch historical data (last 7 days)
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        labels.push(formattedDate);

        try {
            const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&date=${formattedDate}&base_currency=${from}&currencies=${to}`);
            const data = await response.json();
            if (data.data) {
                rates.push(data.data[to]);
            }
        } catch (error) {
            console.error('Error fetching historical data:', error);
        }
    }

    if (rateChart) {
        rateChart.destroy();
    }

    const ctx = document.getElementById('rate-chart').getContext('2d');
    rateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${from} to ${to} Exchange Rate`,
                data: rates,
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    // Add logic to change theme variables here
}


convertButton.addEventListener('click', (e) => {
    e.preventDefault();
    convertCurrency();
});

swapButton.addEventListener('click', swapCurrencies);

fromCurrency.addEventListener('change', updateFlags);
toCurrency.addEventListener('change', updateFlags);

themeToggle.addEventListener('click', toggleTheme);

// Initialize
populateCurrencyDropdowns();
convertCurrency();