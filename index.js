(function () {
  const productList = document.querySelector('.productList')
  const slider = document.querySelector('.slider')
  const base_URL = 'https://lighthouse-user-api.herokuapp.com'
  const indexAPI = base_URL + '/api/v1/users/'
  const productName = document.querySelector('#name')
  const productInfo = document.querySelector('.modal-body')
  const search = document.querySelector('.search')
  const searchInput = document.querySelector('.searchInput')

  let data = []

  // 倒數計時器
  const deadline = '2020-12-31'
  function countdownTimer(endTime) {
    const countdownTimer = document.querySelector('.countdownTimer')

    const timeInterval = setInterval(() => {
      function getTimeRemaining(endTime) {
        // 將時間字串轉為毫秒值，取得相差毫秒值
        const total = Date.parse(endTime) - Date.parse(new Date())
        // 將毫秒值轉為天、小時、分、秒
        const seconds = Math.floor((total / 1000) % 60)
        const minutes = Math.floor((total / 1000 / 60) % 60)
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
        const days = Math.floor(total / (1000 * 60 * 60 * 24))

        return {
          total,
          days,
          hours,
          minutes,
          seconds
        };
      }
      const t = getTimeRemaining(endTime)
      countdownTimer.innerHTML =
        t.days + 'd ' +
        t.hours + 'h ' +
        t.minutes + 'm ' +
        t.seconds + 's '

      if (t.total <= 0) {
        clearInterval(timeInterval)
      }
    }, 1000)
  }
  countdownTimer(deadline)

  // slides
  const slide = document.querySelector('.slider-items').children
  const nextSlide = document.querySelector('.right-slide')
  const prevSlide = document.querySelector('.left-slide')
  const totalSlide = slide.length
  let index = 0

  nextSlide.onclick = function () {
    next('next')
    resetTimer()
  }
  prevSlide.onclick = function () {
    next('prev')
    resetTimer()
  }

  function next(direction) {
    if (direction === 'next') {
      index++
      if (index === totalSlide) {
        index = 0
      }
    } else {
      if (index === 0) {
        index = totalSlide - 1
      } else {
        index--
      }
    }
    for (let i = 0; i < slide.length; i++) {
      slide[i].classList.remove('active')
    }
    slide[index].classList.add('active')
    console.log(index);
  }
  // 循環播放
  var timer = setInterval(autoPlay, 3000);
  function resetTimer() {
    // 停止 timer
    clearInterval(timer)
    // 重新啟動
    timer = setInterval(autoPlay, 3000)
  }

  function autoPlay() {
    next('next')
  }

  // 抓取 API 資料
  axios
    .get(indexAPI)
    .then(res => {
      data.push(...res.data.results)
      displayList(data)
    })
    .catch(error => {
      console.log(error)
    })

  // 商品陳列
  function displayList(data) {
    let htmlContent = ''
    data.forEach(item => {
      htmlContent += `
        <div class="card">
          <img class="img card-img-top" data-toggle="modal" data-target="#exampleModal" src=${item.avatar} data-id =${item.id} alt="Card image cap">
          <div class="card-body">
            <p class="card-text">${item.name}</p>
          </div>
        </div> `
    })
    productList.innerHTML = htmlContent
  }
  // 商品詳情
  productList.addEventListener('click', event => {
    if (event.target.matches('.img')) {
      let url = indexAPI + event.target.dataset.id
      productInfo.innerHTML = ''
      productName.innerHTML = ''

      axios
        .get(url)
        .then(res => {
          let idData = res.data
          console.log(idData)
          productName.innerHTML = idData.name
          productInfo.innerHTML = `
            <div class='productCard' data-id='${idData.id}'>
              <div class='cardImg'>
                <img class='userImg' src='${idData.avatar}'>
              </div>
              <div class='cardBody'>
                <div class='age'>age: ${idData.age}</div>
                <div class='birthday'>Birthday: ${idData.birthday}</div>                                
              </div>
            </div>
          `
        })
    }
  })
  // 商品搜尋
  search.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    console.log(regex)
    results = data.filter(product => product.name.match(regex))
    displayList(results)
  })
})()