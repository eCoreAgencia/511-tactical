import { isMobile } from '../utils';
import './../components/send-form';

$(document).ready(() => {
	const headerFixed = () => {
		const distancePageTop = 100;
		const pageScroll = window.pageYOffset || document.documentElement.scrollTop;

		if (pageScroll >= distancePageTop) {
			$('.header').addClass('header--fixed');
			$('body main').css('display','block');
			$('body main').css('margin-top','110px');
		} else {
			$('.header').removeClass('header--fixed');
			$('body main').css('margin-top','0px');
		}
	};

	console.log(isMobile.Android());

	if (!isMobile.any()) {
		headerFixed();

		$(window).scroll(() => {
			headerFixed();
		});
	}

	$('main').on('click', function() {
		$('.search-form__result').css('display','none');
	})

	$('.footer__column .footer__title').on('click', function(e) {
		$(this)
			.next()
			.toggleClass('active');
	});

	$('.newsletter__form').sendForm('NL');
});
