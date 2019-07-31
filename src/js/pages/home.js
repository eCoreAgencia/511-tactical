$(document).ready(function() {
	if ($('li.helperComplement', this)[0]) {
		$('li.helperComplement', this).remove();
	}
	if ($('body').hasClass('home')) {
		$('.forms-b2b').appendTo('.modaleCore__middle');
		$('.product__cadastre').on('click', function(event) {
			$('.modaleCore').addClass('active');
		});

		if ($(".call__box")[0]) {
			$(".call__box").each(function() {
				const img = $("img", this).attr("src");

				$(this).css("background-image", "url(" + img + ")");
			});
		}

		$(".product--shelf-flip .product__front").on("click", function() {
			$(this)
				.parents(".product--shelf-flip")
				.addClass("hover");
		});

		var $gallery = $(
			".banner--full .banner__inner , .banner--mobile .banner__inner"
		);

		$gallery.slick({
			dots: true,
			autoplay: true,
			arrows: true,
			fade: true,
			infinite: false,
			responsive: [
				{
					breakpoint: 800,
					settings: {
						arrows: false
					}
				}
			]
		});

        const shelf__prev = `<button type='button' class='slick-prev shelf__button'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43"><defs><path id="vcuya" d="M1460 1326.21l21.21-21.21 21.21 21.21-21.21 21.21z"/><path id="vcuyc" d="M1481.5 1318.5l-7.52 7.52"/><path id="vcuyd" d="M1481.5 1333.02l-7.52-7.52"/><clipPath id="vcuyb"><use fill="#fff" xlink:href="#vcuya"/></clipPath></defs><g><g transform="matrix(-1 0 0 1 1503 -1305)"><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-miterlimit="50" stroke-width="4" clip-path="url(&quot;#vcuyb&quot;)" xlink:href="#vcuya"/></g><g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyc"/></g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyd"/></g></g></g></g></svg></button>`
        const shelf__next = `<button type='button' class='slick-next shelf__button'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43"><defs><path id="vcuya" d="M1460 1326.21l21.21-21.21 21.21 21.21-21.21 21.21z"/><path id="vcuyc" d="M1481.5 1318.5l-7.52 7.52"/><path id="vcuyd" d="M1481.5 1333.02l-7.52-7.52"/><clipPath id="vcuyb"><use fill="#fff" xlink:href="#vcuya"/></clipPath></defs><g><g transform="matrix(-1 0 0 1 1503 -1305)"><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-miterlimit="50" stroke-width="4" clip-path="url(&quot;#vcuyb&quot;)" xlink:href="#vcuya"/></g><g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyc"/></g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyd"/></g></g></g></g></svg></button>`

		$('.shelf__carousel--full ul').slick({
			arrows: true,
			slidesToShow: 4,
			slidesToScroll: 1,
			infinite: true,
			prevArrow: shelf__prev,
			nextArrow: shelf__next,
			responsive: [
				{
					breakpoint: 800,
					settings: "unslick"
				}
			]
		});

		$(window).on('productFinished', function() {
			console.log('productFinished');
			$('.buy-by-category .shelf ul').each(function() {

				if ($('li', this).length > 5 && !$(this).hasClass('slick-initialized')) {
					$(this).slick({
						arrows: true,
						slideToShow: 3,
						slidesToScroll: 1,
						infinite: true,
						variableWidth: true,
						prevArrow: shelf__prev,
						nextArrow: shelf__next
					});
				}
			});
		});
	}
});
