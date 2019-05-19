const R = require("ramda");
const slugify = require("slugify");

(function($) {
	$.fn.shelf = function(options) {
		var defaults = {
			corDeFundo: "yellow"
		};

		let countProduct = 0;

		var settings = $.extend({}, defaults, options);
		const productNames = [];
		const pages = $('.pager.bottom li.page-number').length;

		let tempShelf = [];
		let pageNumber = 2;
		const buttonLoadMore =
			'<div class="button btn-load-more confira-todos-produtos">Ver Mais</div>';
		const returnToTop =
			'<div id="returnToTop" style="opacity: 1; display: flex;"><a href="#"><span class="text">voltar ao</span><span class="text2">TOPO</span><span class="arrowToTop"></span></a></div>';

		const getSearchUrl = () => {
			var url, content, preg;
			jQuery("script:not([src])").each(function() {
				content = jQuery(this)[0].innerHTML;
				preg = /\/buscapagina\?.+&PageNumber=/i;
				if (content.search(/\/buscapagina\?/i) > -1) {
					url = preg.exec(content);
					return false;
				}
			});

			if (typeof url !== "undefined" && typeof url[0] !== "undefined") {
				console.log(url[0]);
				return url[0];
			} else {
				log(
					"Não foi possível localizar a url de busca da página.\n Tente adicionar o .js ao final da página. \n[Método: getSearchUrl]"
				);
				return "";
			}
		};
		const getMoreProducts = searchUrl => {
			$.ajax({
				url: searchUrl
			}).success(function(data) {
				if (data.trim().length == "") {
					$(".shelf__vitrine .btn-load-more").remove();
				}
				$(".prateleira[id^=ResultItems]").append(data);
				$(".shelf__vitrine .btn-load-more").removeClass("loading");

				loadShelf();
			});
		};

		const loadShelf = () => {
			$(".prateleira .prateleira").each(function() {

				const prateleira = $(this);
				if (!$(this).hasClass("eached")) {
					let newShelf = [];
					if (tempShelf.length > 0) {
						tempShelf.map(shelf => newShelf.push(shelf));
						tempShelf = [];
					}
					const shelfItem = $("li:not(.helperComplement)", this);
					const shelfLength = shelfItem.length;
					shelfItem.each(function(index) {
						const name = $(
							".product__name .product__link",
							this
						).text();
						const slug = slugify(name, {
							lower: true
						});

						const pred = productNames.indexOf(slug);

						if (pred < 0) {
							productNames.push(slug);
							newShelf.push($(this).html());
						}

						if (index + 1 == shelfLength) {
							const itemsToRemove = newShelf.length % 4;
							let filterShelf = "";

							if (newShelf.length > 4) {
								for (var i = 1; i <= itemsToRemove; i++) {
									const index = newShelf.length - i;
									tempShelf.push(newShelf[index]);
								}

								console.log(tempShelf, "[[[]]]");

								filterShelf = R.dropLast(
									itemsToRemove,
									newShelf
								);
							} else {
								filterShelf = newShelf;
							}

							console.log(R.uniq(filterShelf));

							const list = filterShelf
								.map(shelf => `<li>${shelf}</li>`)
								.join("");
							$(".shelf__vitrine").addClass("loaded");
							prateleira.html(`<ul>${list}</ul>`);
							prateleira.addClass("eached");
							countProduct = countProduct + filterShelf.length

							$(".section__navTop__numberProduct b").text(
								countProduct
							);
						}
					});
				}
			});
		};
		if (pages > 1) {
			$(".shelf__vitrine").append(buttonLoadMore);
		}
		$("main").append(returnToTop);
		loadShelf();
		getSearchUrl();

		$(".shelf__vitrine").on("click", ".btn-load-more", function() {
			$(this).addClass("loading");
			const searchUrl = getSearchUrl() + pageNumber;
			getMoreProducts(searchUrl);
			pageNumber++;
		});

		$(".shelf__vitrine").on("click", "#returnToTop", function() {
			$("html,body").animate({ scrollTop: 0 }, "slow");
		});
	};
})(jQuery);

$(document).ready(() => {
	if ($("body").hasClass("catalog")) {
		$(".prateleira .prateleira").shelf();
	}
});
