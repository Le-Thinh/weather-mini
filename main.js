const cityInput = document.querySelector('.js-cityInput');
const searchBtn = document.querySelector('.js-btnSearch');

const weatherInfoSection = document.querySelector('.js-weatherInfo');
const notFoundSection = document.querySelector('.js-notFound');
const searchCitySection = document.querySelector('.js-searchCity');

const countryTxt = document.querySelector('.js-country');
const tempTxt = document.querySelector('.js-temp');
const conditionTxt = document.querySelector('.js-condition');
const humidityValueTxt = document.querySelector('.js-humidityValue');
const windValueTxt = document.querySelector('.js-windValue');
const weatherSummaryImg = document.querySelector('.js-weather-summary-img');
const currentDateTxt = document.querySelector('.js-currentDate');

// Forecast Element
const forecastItemsContainer = document.querySelector('.js-forecastContainer');



const apiKey = 'dd49c5b4647e873d9160db222a655302';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = ''
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = ''
        cityInput.blur();
    }    
});

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    return response.json();
}

function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id === 800) return 'clear.svg'
    if(id <= 804) return 'clouds.svg'
}

getCurrentDate = () => {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    };
    return currentDate.toLocaleDateString('en-US', options);
}
 
async function updateWeatherInfo (city) {
    const weatherData = await getFetchData('weather', city)
    if (weatherData.cod !== 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }], 
        wind: {speed}

    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + ' M/s'

    currentDateTxt.textContent = getCurrentDate();

    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;


    await updateForecastsInfo(city);
    
    showDisplaySection(weatherInfoSection);
}

updateForecastsInfo = async (city) => {
    const forecastData = await getFetchData('forecast', city);

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML = ``
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken)
            && !forecastWeather.dt_txt.includes(todayDate)) {
            
            updateForecastItems(forecastWeather);
            
        }
    })
}

updateForecastItems = (weatherData) => {
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{
            id
        }],
        main: {temp}
    
    } = weatherData

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short',

    } 

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption);

    const forecastItem = `
        <div class="forecast-item js-forecastItem">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img
              src="./assets/weather/${getWeatherIcon(id)}"
              alt=""
              class="forecast-item-img"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

showDisplaySection = (section) => {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach((section) => section.style.display = 'none');

    section.style.display = 'flex';
}


