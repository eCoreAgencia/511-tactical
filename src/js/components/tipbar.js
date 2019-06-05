class Tipbar {
	constructor() {
		this.validateTipbar()
	}

	validateTipbar() {
		if ($('.header__tipbar .header__tipbar--item')[0]) {
			this.tipbarSlick()
			$('header.header').addClass('hass-tipbar')
			console.log('sim')
		} else {
			console.log('nao')
		}
	}

	tipbarSlick() {
		$('.header__tipbar .js-tipbar').slick({
			dots: false,
			autoplay: true,
			arrows: false,
			speed: 300,
			infinite: true,
			autoplaySpeed: 3500
		});
	}
}

window.Tipbar = new Tipbar();
