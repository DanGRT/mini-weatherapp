//OpenWeatherAPI key: f00c57f47d08f6f24f76c9cd35a3fb1c
//unsplash API key: 233c522c9aa5098a5e08dae45ba3d60a6146624ee96b5a71a364e408bacd2b10

const thumbsEle=document.querySelector(".thumbs");
const displayPhoto=document.querySelector(".photo");
const infoSection = document.querySelector("#conditions")
const infoName = document.querySelector("#credit-user");
const infoLink = document.querySelector("#credit-platform");
const bodyElement = document.querySelector("body")
const searchBox = document.querySelector(".search__input")
let allThumbs = [];


function getCityURL(city){
  return `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=f00c57f47d08f6f24f76c9cd35a3fb1c`
}

function fetchWeatherDescription(url){
  fetch(url)
    .then(response => response.json())
    .then(body => {
      const picURL = getPictureURL(body.weather[0].description)
      fetchWeatherPicture(picURL)
      let celsiusTemp = (body.main.temp - 273.15).toFixed(0)
      infoSection.textContent = `${body.name}: ${body.weather[0].description} -- ${celsiusTemp} celsius`

    })

}

function getPictureURL(description){
  return `https://api.unsplash.com/search/photos?page=1&query=${description}&client_id=233c522c9aa5098a5e08dae45ba3d60a6146624ee96b5a71a364e408bacd2b10`
}

function fetchWeatherPicture(url){
  fetch(url)
  .then(response => response.json())
  .then(body =>{
    let bigPic=document.createElement("img");
    bigPic.src = body.results[0].urls.regular
    bigPic.dataset.photographer = body.results[0].user.name
    bigPic.dataset.profileLink = body.results[0].user.links.html
    infoName.textContent = bigPic.dataset.photographer
    infoLink.setAttribute("href", bigPic.dataset.profileLink)
    displayPhoto.appendChild(bigPic)
    body.results.forEach((item, index) =>{
      const smallPicContainer = document.createElement("a")
      let smallPic=document.createElement("img");
      smallPic.id = `thumbnail${index}`
      smallPic.src=item.urls.thumb;
      smallPic.dataset.photographer = item.user.name
      smallPic.dataset.profileLink = item.user.links.html
      smallPic.dataset.regularPic = item.urls.regular
      smallPic.className = "thumb"
      smallPicContainer.className = "thumbs__link"
      smallPicContainer.appendChild(smallPic)
      thumbsEle.appendChild(smallPicContainer);
    })
    allThumbs = document.querySelectorAll(".thumb")
  })
}



bodyElement.addEventListener("submit", event => {
  event.preventDefault()
  thumbsEle.innerHTML = ""
  displayPhoto.innerHTML = ""
  fetchWeatherDescription(getCityURL(searchBox.value))

})



bodyElement.addEventListener("click", event => {
  if (event.target.matches(".thumb")){
    allThumbs = document.querySelectorAll(".thumb")
    allThumbs.forEach(thumb => {
      thumb.className = "thumb"
    })
    event.target.classList.toggle("active")
    displayPhoto.childNodes[0].src = event.target.dataset.regularPic
    displayPhoto.childNodes[0].dataset.photographer = event.target.dataset.photographer
    displayPhoto.childNodes[0].dataset.profileLink = event.target.dataset.profileLink
    infoName.textContent = event.target.dataset.photographer
    infoLink.setAttribute("href", event.target.dataset.profileLink)
  }
})


fetchWeatherDescription(getCityURL("london"))


//TODO: works, but doesnt highlight current pic in thumbnails
function changePicInterval(){
  setInterval(changePic, 15000)
}

  let index = 0;

function changePic(){
  if (index === allThumbs.length - 1){
    index = 0
  }
    index++
    displayPhoto.childNodes[0].src = allThumbs[index].dataset.regularPic
    infoName.textContent = allThumbs[index].dataset.photographer
    infoLink.setAttribute("href", allThumbs[index].dataset.profileLink)
}

changePicInterval()
