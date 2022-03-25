// Загрузка шрифта
addStylesheetURL('https://fonts.googleapis.com/css2?family=Arimo&family=Inter:wght@300;400;700;800&display=swap')


document.addEventListener("DOMContentLoaded", function () {
	// Ширина окна для ресайза
	WW = document.body.clientWidth


	// Есть ли поддержка тач событий или это apple устройство
	if (!is_touch_device() || !/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) document.documentElement.classList.add('custom_scroll')


	// Observer API
	const boxes = document.querySelectorAll('.lazyload')

	function scrollTracking(entries) {
		for (const entry of entries) {
			if (entry.intersectionRatio >= 0.2) {
				entry.target.src = entry.target.getAttribute('data-src')
				entry.target.classList.add('loaded')
			}
		}
	}

	const observer = new IntersectionObserver(scrollTracking, {
		threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
	})

	boxes.forEach(element => observer.observe(element))


	// Установка ширины стандартного скроллбара
	document.documentElement.style.setProperty('--scroll_width', widthScroll() + 'px')


	// Моб. версия
	firstResize = false

	if (document.body.clientWidth < 375) {
		document.getElementsByTagName('meta')['viewport'].content = 'width=375, user-scalable=no'

		firstResize = true
	}


	// Проекты - фильтрация
	const iso = new Isotope('.portfolio .row', {
		itemSelector: '.item',
		layoutMode: 'fitRows'
	})


	// Проекты - категории
	document.querySelectorAll('.categories .btn').forEach(element => {
		element.addEventListener('mouseover', function () {
			setTimeout(() => {
				let video = document.getElementById(element.getAttribute('data-video'))

				video.classList.remove('hide')
				video.classList.add('show')

				if (video.paused) { video.play() }
			})
		})

		element.addEventListener('click', function (e) {
			iso.arrange({ filter: element.getAttribute('data-filter') })
		})
	})

	document.querySelectorAll('.categories .btn').forEach(element => {
		element.addEventListener('mouseleave', function () {
			let video = document.getElementById(element.getAttribute('data-video'))

			video.classList.remove('show')
			video.classList.add('hide')
			video.pause()
		})
	})


	// Проекты - Замена фона
	document.querySelectorAll('.portfolio .item').forEach(element => {
		element.addEventListener('mouseover', function () {
			document.documentElement.style.setProperty('--bg', this.querySelector('.thumb').getAttribute('data-color'))
		})
	})

	document.querySelectorAll('.portfolio .item').forEach(element => {
		element.addEventListener('mouseleave', function () {
			document.documentElement.style.setProperty('--bg', '#fff')
		})
	})
})



window.addEventListener('load', () => {
	// Фикс. шапка
	headerInit = true

	headerInit && window.scrollY > 0
		? document.querySelector('header').classList.add('fixed')
		: document.querySelector('header').classList.remove('fixed')
})



window.addEventListener('resize', () => {
	if (typeof WW !== 'undefined' && WW != document.body.clientWidth) {
		// Моб. версия
		if (!firstResize) {
			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'

			if (document.body.clientWidth < 375) document.getElementsByTagName('meta')['viewport'].content = 'width=375, user-scalable=no'

			firstResize = true
		} else {
			firstResize = false
		}


		// Фикс. шапка
		headerInit = false

		setTimeout(() => {
			headerInit = true

			headerInit && window.scrollTop > 0
				? document.querySelector('header').classList.add('fixed')
				: document.querySelector('header').classList.remove('fixed')
		}, 100)


		// Перезапись ширины окна
		WW = document.body.clientWidth
	}
})



window.addEventListener('scroll', () => {
	// Фикс. шапка
	typeof headerInit !== 'undefined' && headerInit && window.scrollY > 0
		? document.querySelector('header').classList.add('fixed')
		: document.querySelector('header').classList.remove('fixed')
})



// Вспомогательные функции
function addStylesheetURL(url) {
	var link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = url
	document.getElementsByTagName('head')[0].appendChild(link)
}


const is_touch_device = () => !!('ontouchstart' in window)


const widthScroll = () => {
	let div = document.createElement('div')

	div.style.overflowY = 'scroll'
	div.style.width = '50px'
	div.style.height = '50px'
	div.style.visibility = 'hidden'

	document.body.appendChild(div)

	let scrollWidth = div.offsetWidth - div.clientWidth
	document.body.removeChild(div)

	return scrollWidth
}