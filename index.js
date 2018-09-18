//OpenWeatherAPI key: f00c57f47d08f6f24f76c9cd35a3fb1c
//unsplash API key: 233c522c9aa5098a5e08dae45ba3d60a6146624ee96b5a71a364e408bacd2b10

const thumbsEle=document.querySelector(".thumbs");
const displayPhoto=document.querySelector(".photo");
const infoName = document.querySelector("#credit-user");
const infoLink = document.querySelector("#credit-platform");
const bodyElement = document.querySelector("body")
const searchBox = document.querySelector(".search__input")

function getCityURL(city){
  return `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=f00c57f47d08f6f24f76c9cd35a3fb1c`
}

function fetchWeatherDescription(url){
  fetch(url)
    .then(response => response.json())
    .then(body => {
      console.log(body.weather[0].description)
      const picURL = getPictureURL(body.weather[0].description)
      fetchWeatherPicture(picURL)

    })

}

function getPictureURL(description){
  return `https://api.unsplash.com/search/photos?page=1&query=${description}&client_id=233c522c9aa5098a5e08dae45ba3d60a6146624ee96b5a71a364e408bacd2b10`
}

function fetchWeatherPicture(url){
  fetch(url)
  .then(response => response.json())
  .then(body =>{
    console.log(body)
    console.log(body.results[0].user.name)
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
      smallPic.className = "thumb"
      smallPicContainer.className = "thumbs__link"
      smallPicContainer.appendChild(smallPic)
      smallPic.addEventListener("click", event => {
        displayPhoto.childNodes[0].src = item.urls.regular
        displayPhoto.childNodes[0].dataset.photographer = item.user.name
        displayPhoto.childNodes[0].dataset.profileLink = item.user.links.html
        infoName.textContent = smallPic.dataset.photographer
        infoLink.setAttribute("href", smallPic.dataset.profileLink)



      })
      thumbsEle.appendChild(smallPicContainer);
    })

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
    const allThumbs = document.querySelectorAll(".thumb")
    allThumbs.forEach(thumb => {
      thumb.className = "thumb"
    })
    event.target.classList.toggle("active")
  }
})


fetchWeatherDescription(getCityURL("london"))
