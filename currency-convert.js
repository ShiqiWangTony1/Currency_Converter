const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const rates = response.data.rates;

        if (!rates[toCurrency]) {
            throw new Error(`Exchange rate for ${toCurrency} not found.`);
        }

        const exchangeRate = rates[toCurrency];
        return exchangeRate;
    } catch (error) {
        console.log('Error fetching exchange rates:', error.response ? error.response.data : error.message);
        throw new Error(`Unable to get exchange rate from ${fromCurrency} to ${toCurrency}.`);
    }
};

const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.com/v2/currency/${currencyCode}`);
        return response.data.map(country => country.name);
    } catch (error) {
        console.log('Error fetching countries:', error.response ? error.response.data : error.message);
        throw new Error(`Unable to get countries that use ${currencyCode}.`);
    }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    try {
        const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
        const countries = await getCountries(toCurrency);
        const convertedAmount = (amount * exchangeRate).toFixed(2);
        return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend it in the following countries: ${countries.join(', ')}.`;
    } catch (error) {
        throw new Error(error.message);
    }
};

convertCurrency('USD', 'EUR', 20)
    .then(message => {
        console.log(message);
    })
    .catch(error => {
        console.log(error.message);
    });
