const weatherBox = document.getElementById("weatherBox");
const historyDiv = document.getElementById("history");
const consoleBox = document.getElementById("consoleBox");

log("Sync Start");

window.onload = () => {
loadHistory();
log("Sync End");
};

function log(msg){
consoleBox.textContent += msg + "\n";
}


// SEARCH CITY
async function getWeather(){

const city = document.getElementById("cityInput").value;

if(city===""){
alert("Enter city name");
return;
}

log("[ASYNC] Searching city...");

try{

// GET LATITUDE & LONGITUDE
const geoResponse = await fetch(
`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
);

const geoData = await geoResponse.json();

if(!geoData.results){
throw new Error("City not found");
}

const lat = geoData.results[0].latitude;
const lon = geoData.results[0].longitude;
const cityName = geoData.results[0].name;
const country = geoData.results[0].country;


// GET WEATHER DATA
const weatherResponse = await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
);

Promise.resolve().then(()=>{
log("Promise.then (Microtask)");
});

setTimeout(()=>{
log("setTimeout (Macrotask)");
},0);

const weatherData = await weatherResponse.json();

displayWeather(cityName,country,weatherData);

saveHistory(city);

log("[ASYNC] Data received");

}catch(error){

weatherBox.innerHTML=`<p style="color:red">${error.message}</p>`;

}

}


// DISPLAY WEATHER
function displayWeather(city,country,data){

const temp = data.current_weather.temperature;
const wind = data.current_weather.windspeed;

weatherBox.innerHTML = `

<p><b>City:</b> ${city}, ${country}</p>
<p><b>Temperature:</b> ${temp} °C</p>
<p><b>Wind:</b> ${wind} km/h</p>

`;

}


// HISTORY
function saveHistory(city){

let cities = JSON.parse(localStorage.getItem("cities")) || [];

if(!cities.includes(city)){
cities.push(city);
localStorage.setItem("cities",JSON.stringify(cities));
}

loadHistory();

}

function loadHistory(){

historyDiv.innerHTML="";

let cities = JSON.parse(localStorage.getItem("cities")) || [];

cities.forEach(city=>{

let tag=document.createElement("span");

tag.innerText=city;

tag.onclick=()=>{
document.getElementById("cityInput").value=city;
getWeather();
};

historyDiv.appendChild(tag);

});

}