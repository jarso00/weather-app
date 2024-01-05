
const input = document.querySelector('input');
const button = document.querySelector('button');
const errorMSG = document.querySelector('p.error');

const windspeed = document.querySelector('span.wind_speed');
const humidity = document.querySelector('span.humidity');
const pressure = document.querySelector('span.pressure');
const feelslike = document.querySelector('span.feels_like');
const clouds = document.querySelector('span.clouds');

const date = document.querySelector('p.date');
const city = document.querySelector('h2.city');
const img = document.querySelector('img');
const description = document.querySelector('p.description');
const temp = document.querySelector('p.temp');

const pollution_info = document.querySelector('p.polution_info')
const pollution_img = document.querySelector('img.pm25')

const api_link = 'https://api.openweathermap.org/data/2.5/weather?q=';
const api_key = '&appid=4d46894d8cec4cde7e746464f840678c';
const api_lang = '&lang=pl';
const api_units = '&units=metric';

const getweather = () => {


    map.innerHTML = null
    
    const api_city = input.value;
    const URL = api_link + api_city + api_key + api_units + api_lang

    axios.get(URL).then(response => {
        city.textContent = `${response.data.name}, ${response.data.sys.country}`
        img.src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        temp.textContent = `${Math.round(response.data.main.temp)} °C`
        description.textContent = `${response.data.weather[0].description}`
        description.classList.add("red-bacground")
        feelslike.textContent = `${Math.round(response.data.main.feels_like)} °C`
        pressure.textContent = `${response.data.main.pressure} hPa`
        humidity.textContent = `${response.data.main.humidity} %`
        windspeed.textContent = `${Math.round(response.data.wind.speed * 3.6)} km/h`
        clouds.textContent = `${response.data.clouds.all} %`
        errorMSG.textContent = ''

        startmap(response.data.coord.lon, response.data.coord.lat)

        const url_pollution = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}` + api_key

        axios.get(url_pollution).then(response => {
            

            pollution_info.innerHTML = `${response.data.list[0].components.pm2_5} μg/m<sup>3</sup>`
            const pm25 = Number(`${response.data.list[0].components.pm2_5}`)

            if (pm25 >= 0 && pm25 < 10) {
                pollution_img.style.backgroundColor = "green"
            }
            else if (pm25 >= 10 && pm25 < 25) {
                pollution_img.style.backgroundColor = "yellow"
            }
            else if (pm25 >= 25 && pm25 < 50) {
                pollution_img.style.backgroundColor = "orange"
            }
            else if (pm25 >= 50 && pm25 < 75) {
                pollution_img.style.backgroundColor = "red"
            }
            else if (pm25 >= 75) {
                pollution_img.style.backgroundColor = "#8a8a8a"
            }
        })
    
    })
    .catch(error => {
        console.log(error);
        if (error.response.data.cod !== '200') {
            errorMSG.textContent = `${error.response.data.message}`;
        }
        [city, temp, description, feelslike, pressure, humidity, windspeed, clouds, pollution_info].forEach(el => {
            el.textContent = '';
        })
        img.src = '';
        pollution_img.style.backgroundColor = "transparent"
        description.classList.remove("red-bacground")
    }).finally(() => {
        input.value = '';
    })
}

const startmap = (lon, lat) => {

        const key = 'xESHbvBNZOPatz3g3QaQ';
        const source = new ol.source.TileJSON({
            url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`,
            tileSize: 512,
            crossOrigin: 'anonymous'
        });

        const map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    source: source
                    })
                ],
            target: "map",
            view: new ol.View({
                constrainResolution: true,
                center: ol.proj.fromLonLat([lon, lat]),
                zoom: 10
            })
        });

        const pin = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point(
                            ol.proj.fromLonLat([lon, lat])
                        )
                    })
                ],
            }),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'img/pin.png',
                    anchor: [0.5, 1],
                    height: 40
                })
            })
        });
        map.addLayer(pin)  
}

const getweatherbyenter = (e) => {
    if (e.key === 'Enter') {
        getweather();
    }
}


button.addEventListener('click', getweather);
input.addEventListener('keypress', getweatherbyenter);





