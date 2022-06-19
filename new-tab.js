let googleLikeSearchBar = document.querySelector('#google-like-search-bar input')
let googleSearchBtn = document.getElementById('google-search-btn')
let googleOpenBtn = document.getElementById('google-open-btn')
let dateText = document.getElementById('date-text')
let datalist = document.getElementById('datalist-search')

function showDate() {
  let today = new Date()
  let options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" }
  let date = today.toLocaleDateString("fr-FR", options)
  let heure = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2)
  let dateheure = `${date} ${heure}`
  dateheure = dateheure.replace(/(^\w{1})|(\s+\w{1})/g, lettre => lettre.toUpperCase())
  // window.navigator.language
  dateText.innerText = dateheure
}

window.addEventListener('DOMContentLoaded', () => {
  showDate()
  setInterval(() => {
    showDate()
  }, 1000)

  googleLikeSearchBar.value = ''
  googleLikeSearchBar.focus()
})

// getGeoloc()

async function getGeoloc() {
  try {
    const position = await getCurrentPosition()
    console.log(position)
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    console.log(`https://www.7timer.info/bin/astro.php?lon=${lon}.2&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`)
  } catch (err) {
    console.log(err)
  }

}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error)
    )
  })
}

async function fetchGoogle(url) {
  let response = await fetch(url, {
    mode: 'cors',
  })
  let stringReponse = await response.text()
  stringReponse = stringReponse.substring(stringReponse.indexOf('\n') + 1)
  let json = JSON.parse(stringReponse)
  let autocompleteList = []

  json[0].map(item => {
    item[0] = item[0].replace('<b>', '')
    item[0] = item[0].replace('</b>', '')
    autocompleteList.push(item[0])
  })

  datalist.innerText = ''
  autocompleteList.forEach(item => {
    let option = document.createElement('option')
    let a = document.createElement('a')
    option.value = item
    a.innerText = item
    option.appendChild(a)
    datalist.appendChild(option)
  })
  // datalist.style.display = 'block'
}

// Fetch google autocomplete each time the user types a letter
googleLikeSearchBar.addEventListener('input', event => {
  fetchGoogle(`https://www.google.com/complete/search?q=${event.target.value}&cp=11&client=gws-wiz&xssi=t&hl=fr`)
})

// Search with enter keypress
googleLikeSearchBar.addEventListener("keyup", event => {
  event.preventDefault()
  if (event.keyCode === 13) {
    googleSearchBtn.click()
  }
})

// Search google btn
googleSearchBtn.addEventListener('click', event => {
  let search = googleLikeSearchBar.value
  if (search) {
    window.location = `https://www.google.com/search?q=${search}`
  }
  googleLikeSearchBar.focus()
})

// Open google btn
googleOpenBtn.addEventListener('click', event => {
  let creating = browser.tabs.create({
    url: `https://www.google.com`
  })
  creating.then(onCreated, onError)
})

// console.log(dateheure)
// console.log(Navigator.language)