const http = require('http');
const readline = require('readline');

const input = readline.createInterface(process.stdin);

const createUrl = (city) => {
  return `http://api.weatherstack.com/current?access_key=${process.env.myAPIKey}&query=${city}`;
};

const getCurrentWeather = (data) => {
  const url = createUrl(data);

  http
    .get(url, (res) => {
      const statusCode = res.statusCode;
      if (statusCode !== 200) {
        console.error(`Status Code: ${statusCode}`);
        return;
      }

      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        let {
          current: { temperature, feelslike, weather_descriptions }
        } = JSON.parse(rawData);
        console.log(`>> Данные о погоде в ${data}`);
        console.log(`>> Температура ${temperature}`);
        console.log(`>> Ощущается как ${feelslike}`);
        console.log(`>> На улице ${weather_descriptions.join('')}`);
      });
    })
    .on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
};

console.log('Добро пожаловать. Укажите город, где вас интересует погода?');
input.on('line', (data) => {
  getCurrentWeather(data);
});
