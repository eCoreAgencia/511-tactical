import { isMobile } from "../utils";
import "./../components/send-form";

$(document).ready(() => {

    $(".product__info--name .description").each(function(i){
		let len = $(this).text().length;
        if(len>60) {
            $(this).text($(this).text().substr(0,200)+'...');
        }
    });

	if($('body').hasClass('resultado-busca')) {
		let url = window.location.href;
		// .split('title=')[1];
		if(url.indexOf('title=')) {
			$('.section__title .titulo-sessao').text(url.split('title=')[1].replace(/%20/g, ' '));
		}
	}

	$("body").hasClass("login") && $("body").on("click", ".vtexIdUI-page .close", function() {
		window.location.href = "/"
	})

	const removeRS = () => {
		$(".product--shelf").each(function() {
			$('[class*="price__"]', this).each(function() {
				const priceList = $(this)
					.html()
					.replace("R$ ", "R$");
				$(this).html(priceList);
			});
		});
	};

	removeRS();

	$(".bread-crumb").each(function() {
		$("a", this).each(function() {
			$(this).html(
				$(this)
					.html()
					.replace("tactical", "Home")
			);
		});
	});

	$(".newsletter__input").on("focus", function() {
		$(".newsletter").removeClass("form-fail");
	});

	const headerFixed = () => {
		const distancePageTop = 100;
		const pageScroll =
			window.pageYOffset || document.documentElement.scrollTop;

		if (pageScroll >= distancePageTop) {
			$(".header").addClass("header--fixed");
			$("body main").css("display", "block");
			$("body main").css("margin-top", "110px");
		} else {
			$(".header").removeClass("header--fixed");
			$("body main").css("margin-top", "0px");
		}
	};

	console.log(isMobile.Android());

	if (!isMobile.any()) {
		headerFixed();

		$(window).scroll(() => {
			headerFixed();
		});
	}

	$("main").on("click", function() {
		$(".search-form__result").css("display", "none");
	});

	$(".footer__column .footer__title").on("click", function(e) {
		$(this)
			.next()
			.toggleClass("active");
	});

	$(".newsletter__form").sendForm("NL");

	$(".edit.edit-profile-link").insertAfter(
		".span4.profile-detail-display h4"
	);
});
