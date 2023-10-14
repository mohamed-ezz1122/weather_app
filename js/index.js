const apiKey =`b4f6a7cc6d514448ae7133125232208`;
const baseUrl=`http://api.weatherapi.com/v1/forecast.json`
let currentLocation=  "cairo"
const cardOfWeather=document.querySelector(".forecast-cards")
const searshInput=document.getElementById("searchBox")
const cityName=document.querySelector("p.location")
const allContinersOfRaine=document.querySelectorAll(".clock")
const imgOfCityContainer=document.querySelector(".city-items")
let resetnCitys=JSON.parse(localStorage.getItem("citys"))||[]
// ===========functions==>

 async function getWeatherData(location)
 {
    const respons=await fetch(`${baseUrl}?key=${apiKey}&q=${location}&days=7`)
    if(respons.status !=200){
      searshInput.value=""
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Make sure you entered a valid city or Location!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
      
      return;
    } 
    
    const data= await respons.json()
    displayCard(data)
 }

function success(position)
{
 currentLocation=`${position.coords.latitude},${position.coords.longitude}`
getWeatherData(location)
}

function displayCard(data)
{
cityName.innerHTML=`<span class="city-name">${data.location.name},${data.location.country}</span>`
const days=data.forecast.forecastday;
let now= new Date()
let cardDay="";

    for(let [index,day] of days.entries())
    {
        
        const date=new Date(day.date);
        let weekday=date.toLocaleDateString("en-us",{weekday:"long"})
       
        

        cardDay+=`
         <div class="${index == 0 ? "card active" : "card"}" data-index=${index} >
        <div class="card-header">
          <div class="day">${weekday}</div>
          <div class="time">${now.getHours()}:${now.getMinutes()} ${now.getHours() > 11 ? "pm" : "am"}</div>
        </div>
        <div class="card-body">
          <img src="./images/conditions/${day.day.condition.text}.svg"/>
          <div class="degree">${day.hour[date.getHours()].temp_c}°C</div>
        </div>
        <div class="card-data">
          <ul class="left-column">
            <li>Real Feel: <span class="real-feel">${day.hour[date.getHours()].feelslike_c}°C</span></li>
            <li>Wind: <span class="wind">K/h</span>${day.hour[date.getHours()].wind_kph}</li>
            <li>Pressure: <span class="pressure">Mb</span>${day.hour[date.getHours()].pressure_mb}Mb</li>
            <li>Humidity: <span class="humidity">${day.hour[date.getHours()].humidity}%</span></li>
          </ul>
          <ul class="right-column">
            <li>Sunrise: <span class="sunrise">${day.astro.sunrise}</span></li>
            <li>Sunset: <span class="sunset">${day.astro.sunset}</span></li>
          </ul>
        </div>
      </div>
        `
        cardOfWeather.innerHTML =cardDay;
        let allCards=document.querySelectorAll(".card")

        for(let card of allCards){

            
            card.addEventListener("click",function(e){
                let activeCard=document.querySelector(".card.active")
                activeCard.classList.remove("active")
                e.currentTarget.classList.add("active")
                rainInfo(days[e.currentTarget.dataset.index])
            })
        }
        
    }
    let exist =resetnCitys.find(function(curentCity){
      return curentCity.city==data.location.name
    })
    if(exist) return
    resetnCitys.push({city:data.location.name})
    localStorage.setItem("citys" , JSON.stringify(resetnCitys))
    displayImages(data.location.name)

    // 


}
function rainInfo(dayWeather){
for(let element of allContinersOfRaine ){
    const clock=element.dataset.clock;
    const height=dayWeather.hour[clock].chance_of_rain
    element.querySelector(".percent").style.height=`${height}%`
}

}
async function getDataOfImgs(city)
{
  let respons= await fetch(`https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape`)
  let imgData = await respons.json();
  return imgData.results
}
 async function displayImages(city)
 {
  let imgArry= await getDataOfImgs(city)
  if(imgArry.length!==0){
    
    let randomUrl =Math.trunc(Math.random()*imgArry.length)
    let imgUrl=imgArry[randomUrl].urls.regular
    let itemContent = `
    <div class="item">
      <div class="city-image">
        <img src="${imgUrl}" alt="Image for ${city} city" />
      </div>
      <div class="city-name"><span class="city-name">${city}</span> </div>
    </div>
  `;
  
      imgOfCityContainer.innerHTML += itemContent
  }
  
 }


// ===========add event==>

window.addEventListener("load",function(){
    navigator.geolocation.getCurrentPosition(success);
    for(let city of resetnCitys)
    {
displayImages(city.city)  
  }
})
// searshInput.addEventListener("input",function(){
//     getWeatherData(this.value)
// })
document.addEventListener("keyup",function(e){
if(e.key=="Enter")
{
    getWeatherData(searshInput.value)
}
})
window.addEventListener("load", () => {



  
})