import { isMobile } from "../utils";
import "./../components/send-form";

$(document).ready(() => {

	$( "form.search-form" ).on("submit", function(event) {
		event.preventDefault();

		let termo		 = $('.search-form input').val();

		window.location = "https://"+window.location.hostname+"/"+termo;
	});

    $(".product__info--name .description").each(function(i){
		let len = $(this).text().length;
        if(len>60) {
            $(this).text($(this).text().substr(0,200)+'...');
        }
    });

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

	if($('body').hasClass('who-us')){
		$('.banner--who-us-banner').each(function(){
			const img = $('.box-banner img', this).attr('src');
			const height = $('.box-banner img', this).height();
			console.log(height);

			$(this).css('background-image', 'url(' + img + ')');
			$(this).height(height);
		});
	}
});
