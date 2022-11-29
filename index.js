;(() => {
  // automatically track all anchor click events:
  // also track all elements that have this class
  const trackClassName = 'ga-event'
  // page context class detection (change if needed):
  const topNavLinkClass = 'nav-link'
  const footerLinkClass = 'footer-link'
  const buttonClass = 'w-button'

  const trackClickEvent = function () {
    const eventCategory =
      this.getAttribute('data-event-category') || this.classList.contains(topNavLinkClass)
        ? 'topnav'
        : this.classList.contains(footerLinkClass)
        ? 'footer'
        : ''
    const eventAction =
      this.getAttribute('data-event-action') || this.classList.contains(buttonClass)
        ? 'button click'
        : 'click'
    let eventLabel = this.getAttribute('data-event-label') || this.href
    const eventValue = this.getAttribute('data-event-value')

    const parent = this.parentNode
    let parent2 = null
    let parent3 = null
    if (parent != null) {
      parent2 = parent.parentNode
    }
    let myId = ''
    if (parent2 != null) {
      parent3 = parent2.parentNode
    }

    if (parent3 != null && parent3.classList.contains('myga-event')) {
      myId = parent3.getAttribute('id')

      if (eventLabel == 'parent') {
        eventLabel = myId
      }
    }

    if ('gtag' in window) {
      console.log('gtag')
      let info = { event_category: eventCategory, event_label: eventLabel, value: eventValue }
      console.log(eventAction)
      console.log(info)
      let eventAction2 = this.getAttribute('data-event-action')
      console.log('data-event-action attribute:' + eventAction2)
      console.log('data-event-action or buttonClass:' + eventAction)
      gtag('event', eventLabel, info) // eventLabel instead of eventAction
    }
  }

  // Find all anchor tags
  let elementsToTrack = document.getElementsByTagName('a')
  if (trackClassName) {
    elementsToTrack = [
      ...new Set([...elementsToTrack, ...document.getElementsByClassName(trackClassName)])
    ]
  }
  // Add an event listener to each of the elements you found
  elementsToTrack.forEach((el) => {
    el.addEventListener('click', trackClickEvent)
  })
})()

var ssoLogin = function (item) {
  $('.sso-btn-container').css('display', 'block')
  $('.form-after-login').css('display', 'none')
  console.log('not logged in sso')
  //let SSO_REDIRECT_URI ="https://webinars-fbd716-6139cb7565efe404b19150c.webflow.io/index.html";
  let SSO_REDIRECT_URI = 'https://seminars.onlinefitness.liftsession.com/index.html'
  let SSO_SCOPE = 'bui+bmi+aui+ami+em'
  let SSO_CLIENT_ID = '0oadfpui12CUtN83Y2p7'
  let SSO_PROMO = 'LIFTWEB'
  let ssoPath = item.target.classList.contains('log-in-btn') ? 'auth' : 'register'
  let myHref = `https://secure.aarp.org/applications/user/${ssoPath}?redirect_uri=${encodeURIComponent(
    SSO_REDIRECT_URI
  )}`
  myHref += '&promo=' + SSO_PROMO
  myHref += '&response_type=code'
  myHref += '&state=' + 'webstate'
  myHref += '&scope=' + SSO_SCOPE
  myHref += '&client_id=' + SSO_CLIENT_ID
  console.info('Using SSO redirect: ' + SSO_REDIRECT_URI)
  console.info('Full SSO login: ' + myHref)
  window.location.href = myHref
  return
}

//Set unique id's
$('.vc-btn-watch').each(function () {
  $(this).attr('id', `vc-btn-watch-${$(this).parent().parent().parent().attr('id')}`)
})
$('.vc-btn-details').each(function () {
  $(this).attr('id', `vc-btn-details-${$(this).parent().parent().parent().attr('id')}`)
})
window.addEventListener('DOMContentLoaded', (event) => {
  handleSSOButtons()
})

function handleSSOButtons() {
  if (!window.Cookies.get('lift.sso.login')) {
    $('.sso-btn-container').css('display', 'block')
    $('.form-after-login').css('display', 'none')
  } else {
    $('.sso-btn-container').css('display', 'none')
    $('.form-after-login').css('display', 'block')
    $('.form-after-login__name')
      .val(decodeURI(window.Cookies.get('lift.name')))
      .prop('disabled', true)
    $('.form-after-login__email')
      .val(decodeURI(window.Cookies.get('lift.user')))
      .prop('disabled', true)
  }
  $('.sso-btn').click(function (item) {
    if (!Cookies.get('lift.sso.login')) {
      ssoLogin(item)
    } else {
      $('.sso-btn-container').css('display', 'none')
      $('.form-after-login').css('display', 'block')
      console.info('User is logged-in: ')
      console.info(Cookies.get('lift.user'))
    }
  })
}

var removePlayButton = function () {
  console.log('removePlayButton')
  $('.popup-card--video').removeClass('display-play-btn')
  document.removeEventListener('click', removePlayButton)
}

// Code for Video Filters
$(document).ready(function () {
  const subtitleArr = []
  $('.video-list__item .vc-subtitle').each(function (index, el) {
    if (!subtitleArr.includes(el.innerText)) subtitleArr.push(el.innerText)
  })

  if (subtitleArr.length > 0) {
    let options
    subtitleArr.forEach((subtitle) => (options += `<option value=${subtitle}>${subtitle}</option>`))
    let showAllOptions = '<option value="all">All Videos</option>'
    $('.video-filter--category').html(showAllOptions + options)
  }

  $('.video-filter--category').change(function () {
    let selectedCategory = $(this).find(':selected').text()
    $('.video-list .video-list__item  .vc-subtitle').each(function (index, el) {
      el.parentNode.parentNode.classList.add('hide')
      if (selectedCategory == 'All Videos') {
        el.parentNode.parentNode.classList.remove('hide')
      } else if (el.innerText == selectedCategory) {
        el.parentNode.parentNode.classList.remove('hide')
      }
    })
  })
})

window.addEventListener('DOMContentLoaded', (event) => {
  checkSignupStatus()
})
let videoUrl = ''
let bumperPlayed = false
let videoPlayed = false
let videoTAG = ''
let viewedEnough = false
let ssoUrl = new URL('https://api.liftsession.com/services/rest/oauth/validate/sso')
let rewardsUrl = new URL('https://api-dev.liftsession.com/services/rest/oauth/rewards')
let myUser

function myGetById(myId) {
  return document.getElementById(myId)
}

function validateSSOToken(code, uri) {
  let request = new XMLHttpRequest()
  let url = ssoUrl.toString() + '?fillRewardsInfo=1&code=' + code + '&uri=' + uri

  request.open('GET', url, true)
  request.onload = function () {
    let data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
      Cookies.set('lift.sso.login', 1, { expires: 1 })
      Cookies.set('lift.user', data.user.user.email, { expires: 1 })
      Cookies.set('lift.name', `${data.user.user.firstName} ${data.user.user.lastName}`, {
        expires: 1
      })
      Cookies.set('lift.userId', data.user.user.uid, { expires: 1 })

      $('.sso-btn-container').css('display', 'none')
      $('.form-after-login').css('display', 'block')
      $('.form-after-login__name')
        .val(decodeURI(window.Cookies.get('lift.name')))
        .prop('disabled', true)
      $('.form-after-login__email')
        .val(decodeURI(window.Cookies.get('lift.user')))
        .prop('disabled', true)
      setTimeout(() => {
        const modalId = localStorage.getItem('modalId')
        $(`#${modalId}`).click()
        document.addEventListener('click', removePlayButton)
      }, 500)
    }
  }
  request.send()
}

function claimReward(userId, token, activityId) {
  let request = new XMLHttpRequest()
  let url =
    rewardsUrl.toString() + '?user=' + userId + '&token=' + token + '&activityId=' + activityId

  request.open('GET', url, true)
  request.onload = function () {
    let data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
    }
  }
  request.send()
}

$('#upcoming-webinar-register').click(function (item) {
  localStorage.setItem('modalId', item.target.id)
  $('html').addClass('lock-scroll')
  $('.main-wrapper').addClass('lock-scroll')
  $('.webinar-signup-form').addClass('show')
  setTimeout(() => {
    $('.webinar-signup-form').addClass('display')
  }, 150)
})

function handleDetailsButtons() {
  $('.vc-btn-details').click(function (item) {
    localStorage.setItem('modalId', item.target.id)
    const content = $(item.target).parent().parent().parent().find('.popup').html()
    $('#popup-modal .popup-card').html(content)
    $('#popup-modal').html($('#popup-modal .popup-card'))
    $('#popup-modal').addClass('show')
    setTimeout(() => {
      $('#popup-modal').addClass('display')
    }, 150)
    $('html').addClass('lock-scroll')
    $('.main-wrapper').addClass('lock-scroll')
  })
}
handleDetailsButtons()

function handleWatchButtons() {
  $('.vc-btn-watch').click(function (item) {
    console.log('watch btn')
    localStorage.setItem('modalId', item.target.id)
    bumperPlayed = false
    videoPlayed = false
    viewedEnough = false
    let baseParent = $(item.target).parent().parent().parent()
    videoUrl = baseParent.find('.video .vc-video-url').html()
    videoTAG = baseParent.find('.view-tag').html()
    const videoTitle = baseParent.find('.vc-title').html()
    const videoDescription = baseParent.find('.vc-description').html()
    const videoContent = $('.popup-video-content').clone().html()
    const navBrand = $('.powered-by-lift').html()
    const content = $('#video-hls').clone()
    $('#popup-modal').html(videoContent)
    $('#popup-modal .popup-video-logo').html(navBrand)
    $('#popup-modal').addClass('show')
    $('#popup-modal').addClass('popup-modal--video')
    $('#popup-modal .popup-card').addClass('popup-card--video')
    $('html').addClass('lock-scroll')
    $('.main-wrapper').addClass('lock-scroll')

    if (!Cookies.get('lift.sso.login')) {
      console.log('no cookie set lift.sso.login')
      const ssoBtnContainer = $('.sso-btn-container').clone()
      $('#popup-modal .popup-card').html(ssoBtnContainer)
      $('#popup-modal .popup-card').css('background-color', 'transparent')
      setTimeout(() => {
        $('#popup-modal').addClass('display')
        $('.sso-btn').click(function (item) {
          ssoLogin(item)
        })
      }, 150)
    } else {
      console.log('cookie set lift.sso.login')
      $('#popup-modal .popup-title').html(videoTitle)
      $('#popup-modal .popup-description').html(videoDescription)
      $('#popup-modal .popup-card').html(content)
      setTimeout(() => {
        $('#popup-modal').addClass('display')
        init()
      }, 150)
    }
  })
}

handleWatchButtons()
$('.popup-modal--close').click(function (item) {
  let email = Cookies.get('lift.user')
  let userId = Cookies.get('lift.userId')
  //Not in V1: claimReward(userId, 'token','36a6c4e2-2d51-4d84-969c-27f58d5116f7')
  let video = myGetById('video-hls')
  if (video) video.pause()
  const itemClasslist = Array(...item.target.classList)
  if (itemClasslist.find((c) => c === 'popup-modal--close')) {
    $('#popup-modal').removeClass('display')
    $('.webinar-signup-form').removeClass('display')
    setTimeout(() => {
      $('#popup-modal').removeClass('show')
      $('.webinar-signup-form').removeClass('show')
      $('#popup-modal').removeClass('popup-modal--video')
      $('#popup-modal .popup-card').removeClass('popup-card--video').css('background-color', '')
    }, 150)
    $('html').removeClass('lock-scroll')
    $('.main-wrapper').removeClass('lock-scroll')
    videoUrl = ''
  }
})
function myNewSrc() {
  if (bumperPlayed == true && videoPlayed == false && videoUrl) {
    let video = myGetById('video-hls')
    let hls = new Hls()
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      hls.loadSource(videoUrl)
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        video.play()
        videoPlayed = true
      })
    })
    hls.attachMedia(video)
  }
}
function init() {
  let video = myGetById('video-hls')
  if (Hls.isSupported()) {
    let hls = new Hls()
    let bumper =
      'https://d24l1sp9vthsfa.cloudfront.net/d46a632a-4b37-4928-830e-d037140a1aa3/AppleHLS1/AARP_bumper.m3u8'
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      hls.loadSource(bumper)
      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        video.play()
        bumperPlayed = true
      })
    })
    hls.attachMedia(video)
    video.addEventListener('ended', myNewSrc, false)
    video.addEventListener('timeupdate', (event) => {
      if (videoPlayed == true) {
        let percentViewed = video.currentTime / video.duration
        if (viewedEnough == false && percentViewed > 0.85) {
          viewedEnough = true
          if ('gtag' in window) {
            videoTAG = videoTAG.replace('HLTH-', 'VIEWD-')
            let info = {
              event_category: 'videoViewedCategory',
              event_label: videoTAG,
              value: 'watchvideo'
            }
            gtag('event', videoTAG, info) //eventAction
          }
        }
      }
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = bumper
    try {
      video.play()
      bumperPlayed = true
    } catch (err) {}
    video.addEventListener(
      'ended',
      function () {
        if (bumperPlayed == true && videoPlayed == false && videoUrl) {
          video.src = videoUrl
          try {
            video.play()
            videoPlayed = true
          } catch (err) {}
        }
      },
      false
    )
  }
}
function checkSignupStatus() {
  const latestSignup = localStorage ? localStorage.getItem('latestSignup') : ''
  const currentEvent = myGetById('upcoming-webinar-date').textContent
  const webinarForm = myGetById('webinar-signup-form')
  webinarForm.addEventListener('submit', (e) => {
    localStorage.setItem('latestSignup', currentEvent)
    toggleButtons()
  })
  if (latestSignup && currentEvent) {
    const isSignedUp = currentEvent === latestSignup

    if (isSignedUp) {
      toggleButtons()
    }
  }
}
function toggleButtons() {
  const registerButton = myGetById('upcoming-webinar-register')
  const afterRegisterButtons = myGetById('after-register-buttons')
  registerButton.style.display = 'none'
  afterRegisterButtons.style.display = 'flex'
}

function mobileOS() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  if (/windows phone/i.test(userAgent)) return 'windows_phone'
  if (/android/i.test(userAgent)) return 'android'
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'ios'
  return null
}
if (mobileOS()) {
  $('html').addClass('mobile-container')
  $('.main-wrapper').addClass('mobile-container')
}

$(document).ready(function () {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  })

  let value = params.code

  if (value != null) {
    let SSO_REDIRECT_URI = 'https://seminars.onlinefitness.liftsession.com/index.html'
    validateSSOToken(value, encodeURIComponent(SSO_REDIRECT_URI))
  }
})
