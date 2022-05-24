// Загрузка шрифта
addStylesheetURL('https://fonts.googleapis.com/css2?family=Arimo&family=Inter:wght@300;400;700;800&display=swap')


document.addEventListener("DOMContentLoaded", function () {
	// Ширина окна для ресайза
	WW = document.body.clientWidth


	// Есть ли поддержка тач событий или это apple устройство
	if (!is_touch_device() || !/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) document.documentElement.classList.add('custom_scroll')


	// Observer API
	const boxes = document.querySelectorAll('.lazyload, .animate')

	function scrollTracking(entries) {
		for (const entry of entries) {
			if (entry.intersectionRatio >= 0.2 && entry.target.getAttribute('data-src') && !entry.target.classList.contains('loaded')) {
				entry.target.src = entry.target.getAttribute('data-src')
				entry.target.classList.add('loaded')
			}

			if (entry.intersectionRatio >= 0.2 && entry.target.classList.contains('animate')) {
				entry.target.classList.add('animated')
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
	const portfolioRow = document.querySelector('.portfolio .row')

	if (portfolioRow) {
		const iso = new Isotope('.portfolio .row', {
			itemSelector: '.item',
			layoutMode: 'fitRows'
		})
	}


	// Проекты - категории
	const categoriesBtns = document.querySelectorAll('.categories .btn')

	categoriesBtns.forEach(element => {
		element.addEventListener('mouseover', () => {
			setTimeout(() => {
				let video = document.getElementById(element.getAttribute('data-video'))

				video.classList.remove('hide')
				video.classList.add('show')

				if (video.paused) { video.play() }
			})
		})

		element.addEventListener('mouseleave', () => {
			let video = document.getElementById(element.getAttribute('data-video'))

			video.classList.remove('show')
			video.classList.add('hide')
			video.pause()
		})

		element.addEventListener('click', e => {
			e.preventDefault()
			e.stopPropagation()

			Array.from(categoriesBtns).forEach(el => {
				el.classList.remove('active')
			})

			element.classList.add('active')

			iso.arrange({ filter: element.getAttribute('data-filter') })
		})
	})


	// Проекты - Замена фона
	document.querySelectorAll('.portfolio .item').forEach(element => {
		element.addEventListener('mouseover', () => {
			document.documentElement.style.setProperty('--bg', this.querySelector('.thumb').getAttribute('data-color'))
		})
	})

	document.querySelectorAll('.portfolio .item').forEach(element => {
		element.addEventListener('mouseleave', () => {
			document.documentElement.style.setProperty('--bg', '#fff')
		})
	})


	// Всплывающие окна
	let modals = document.querySelectorAll('.modal'),
		closeButtons = document.querySelectorAll('.modal .close_btn'),
		modalButtons = document.querySelectorAll('.modal_btn')

	modalButtons.forEach(function (modalButton) {
		modalButton.addEventListener('click', e => {
			modalOpen(document.getElementById(modalButton.getAttribute('data-modal')))
		})
	})

	closeButtons.forEach(function (closeButton) {
		closeButton.addEventListener('click', e => {
			modalClose()
		})
	})

	modals.forEach(function (modal) {
		modal.addEventListener('click', e => {
			if (!document.querySelector('.modal_data').contains(e.target)) {
				modalClose()
			}
		})
	})


	function modalOpen(curentModal) {
		curentModal.classList.add('open')
		document.body.classList.add('lock')
	}

	function modalClose() {
		document.querySelector('.modal.open').classList.remove('open')
		document.body.classList.remove('lock')
	}


	// Впадающий список в форме
	let dropInputs = document.querySelectorAll('.form .input[readonly]')

	dropInputs.forEach(function (input) {
		input.addEventListener('click', e => {
			e.preventDefault()

			input.closest('.line').classList.add('dropdown_open')
		})
	})

	document.addEventListener('click', e => {
		if (!document.querySelector('.with_dropdown').contains(e.target)) {
			let dropDowns = document.querySelectorAll('.form .with_dropdown')

			dropDowns.forEach(function (line) {
				line.classList.remove('dropdown_open')
			})
		}
	})

	// Впадающий список в форме - Выбор варианта
	let dropValues = document.querySelectorAll('.form .dropdown .value')

	dropValues.forEach(function (value) {
		value.addEventListener('click', e => {
			e.preventDefault()

			value.closest('.line').classList.remove('dropdown_open')
			value.closest('.line').querySelector('.input').value = value.textContent
			value.closest('.line').querySelector('.input').setAttribute('valid', true)

			checkfeedbackForm()
		})
	})


	// Отправка формы
	let feedbackForm = document.querySelector('#feedback_modal form'),
		feedbackFormErrors = true,
		fields = feedbackForm.querySelectorAll('.input, textarea')

	fields.forEach(field => {
		field.addEventListener('input', () => {
			field.value != '' && field.value.length > 1
				? field.setAttribute('valid', true)
				: field.setAttribute('valid', false)

			checkfeedbackForm()
		})
	})

	feedbackForm.addEventListener('submit', e => {
		e.preventDefault()

		if (!feedbackFormErrors) {
			let params = {
				subject: document.getElementById('input_subject').value,
				email: document.getElementById('input_email').value,
				text: document.getElementById("input_text").value
			},
				url = "./send.php?data=" + encodeURIComponent(JSON.stringify(params))

			xhttp = new XMLHttpRequest()
			xhttp.open('get', url, true)
			xhttp.setRequestHeader('Content-Type', 'application/json')

			xhttp.onload = function () {
				if (xhttp.readyState == 4 && xhttp.status === 200 && xhttp.responseText) {
					modalClose()
					modalOpen(document.getElementById('success_modal'))
				}
			}

			xhttp.send()
		}
	})


	function checkfeedbackForm() {
		if (feedbackForm.querySelectorAll('[valid="true"]').length == fields.length) {
			feedbackForm.querySelector('.submit_btn').disabled = false
			feedbackFormErrors = false
		} else {
			feedbackForm.querySelector('.submit_btn').disabled = true
			feedbackFormErrors = true
		}
	}
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