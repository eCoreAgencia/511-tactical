import {
	getProductWithVariations,
	getSearchProducts
} from '../modules/vtexRequest'
const R = require('ramda');

class Filter {
	constructor() {
		this.menu = document.querySelector('.logo ');
		$('.helperComplement').remove();
		this.init();
		this.clearFilter();
		this.openFilter();
		this.clouseFilter();
	}

	openFilter() {
		$('.btnOpenFilter').on('click', function (e) {
			e.preventDefault();
			if ($('.category__filter.filter').hasClass('active')) {
				$(this).html('<i class="icon-filter"></i><p>Mostrar</p><p>Filtros</p>');
				$('.category__filter.filter').fadeOut();
				$('.category__filter.filter').removeClass('active');
			} else {
				$(this).html('<i class="icon-arrow-left"></i><p>Fechar</p><p>Filtros</p>');
				$('.category__filter.filter').fadeIn();
				$('.category__filter.filter').addClass('active');
			}
		});
	}

	clouseFilter() {
		$('.clouseFilter').on('click', function (e) {
			e.preventDefault();
			$('.btnOpenFilter').html('<i class="icon-filter"></i><p>Mostrar</p><p>Filtros</p>');
			$('.category__filter.filter').fadeOut();
			$('.category__filter.filter').removeClass('active');
		});
	}

	clearFilter() {
		$('.btnClear').on('click', function (e) {
			e.preventDefault();
			window.location = window.location.href;
		});
	}

	init() {
		// $('.orderBy .select select').on('change', function() {
		// 	const value = $(this).val();
		// 	window.location.href = window.location.href + '?PS=12&O=' + value;
		// });


		if (this.isExist(this.menu)) {
			console.log(this.menu);
		} else {
			console.log('Não existe');
		}

		$('.filter .search-multiple-navigator fieldset').each(function () {
			if ($('div', this).find('label')[0]) {
				const text = $('h5', this).text();
				let label = $('div', this).html();
				const html = `
			  		<li class="filter__item"><span>${text}</span>
						<div class="filter__options">
				  			${label}
						</div>
			  		</li>`;
				$('.filter__menu').append(html);
			}
		});

		$(".filter input[type='checkbox']").vtexSmartResearch();

		$('.search-multiple-navigator input').on('change', function () {
			let urlFilters = ''
			$('.search-multiple-navigator input').each(function () {
				if ($(this).is(':checked')) {
					urlFilters += '&' + $(this).attr('rel');
				}
			})

			console.log(urlFilters);
		})
	}

	isExist(e) {
		const exist = e == null ? false : true;
		return exist;
	}
}

$(document).ready(function () {
	if ($('body').hasClass('catalog')) {
		window.filter = new Filter();
		let urlFilters = '';
		let url, content, preg, category;
		jQuery('script:not([src])').each(function () {
			content = jQuery(this)[0].innerHTML;
			preg = /\/buscapagina\?.+&PageNumber=/i;
			if (content.search(/\/buscapagina\?/i) > -1) {
				url = preg.exec(content);
				url = url[0].replace('/buscapagina', '')
				url = url.split('&PS=');
				category = url[0];
				console.log(category);
				return false;
			} ''
		})

		const fromPage = $('.shelf--new').data('from');
		const toPage = $('.shelf--new').data('to');
		const pathname = window.location.pathname || '';
		const search = window.location.search || '?';
		url = category + '&_from=' + fromPage + '&_to=' + toPage;

		const filterShelf = (products) => {
			const productNames = products.map(product => product.productName);
			const productFilters = products.filter((product, index) => {
				if (R.findIndex(R.propEq('productName', productNames[index]))(products) >= index) {
					return product;
				}
			})

			const itemsToRemove = productFilters.length % 4;

			if (productFilters.length > 4) return R.dropLast(itemsToRemove, productFilters)


			return productFilters;
		}

		const mountProduct = (product) => {

			let indiponivel = '';

			const { items, productName, productId, description, link } = product;
			const stock = items[0].sellers[0].commertialOffer.AvailableQuantity;
			const bestPrice = items[0].sellers[0].commertialOffer.Price;
			const listPrice = items[0].sellers[0].commertialOffer.ListPrice;
			const imgWidth = 500;
			const imgHeight = 500;
			const thumbSize = `-${imgWidth}-${imgHeight}`
			const thumb = items[0].images[0].imageTag;
			let aboutMore = `<a class="btn btn--buy product__buy btn-list" title="${productName}" href="${link}">VER DETALHE</a>`;
			let btnBuy = `<a class="btn btn--buy product__buy" title="${productName}" href="${link}">Compre Agora</a>`;
			let price = ''

			if (stock > 0) {
				if (listPrice > bestPrice) {
					price = `
						<div class="price">
							<span class="price__old">R$ ${listPrice.formatMoney()}</span>
							<span class="price__best">R$ ${bestPrice.formatMoney()}</span>
							<span class="price__installment">
								ou até 6X de R$ ${(bestPrice / 6).formatMoney()}
							</span>
						</div>
					`
				} else {
					price = `
						<div class="price">
							<span class="price__list">R$ ${bestPrice.formatMoney()}</span>
							<span class="price__installment">
								ou até 6X de R$ ${(bestPrice / 6).formatMoney()}
							</span>
						</div>
					`
				}
			} else {
				price = ``;
				indiponivel = `<span class="product__unavailable">Indisponível</span>`;
				btnBuy = ``;
				aboutMore = ``;
			}
			const html = `
					<div class="product product--shelf">
						<span class="product__id" data-product-id="${productId}"></span>
  						<div class="product__header">
							<div class="product__media">
								<a class="product__link" title="${productName}" href="${link}">
									${thumb.replace('~/', '/').replace('-#width#-#height#', thumbSize).replace('#width#', imgWidth).replace('#height#', imgHeight)}
								</a>
							</div>
							<div class="product__actions">
								${btnBuy}
								${indiponivel}
							</div>
  						</div>
  						<div class="product__reviews"></div>
						<div class="product__info">
							<div class="product__info--name">
								<h3 class="product__name">
									<a class="product__link" title="${productName}" href="${link}">
										${productName.replace(/ - TAM ÚNICO/g, '')}
									</a>
								</h3>
								<h4 class="description">
									${description}
								</h4>
							</div>
    						<div class="product__price">
									${price}
									${indiponivel}
									${aboutMore}
							</div>
  						</div>
					</div>`
			return html;

		}

		const renderProducts = (term) => {
			const endpoint = `/api/catalog_system/pub/products/search${term}`;
			$.ajax({
				url: endpoint,
				type: 'GET',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json; charset=utf-8'
				}
			})
				.done(function (data) {
					console.log(data);
					const dupRemove = filterShelf(data);


					//console.log(dupRemove, 'remove');
					const teste = `<ul>${dupRemove.map(item => `<li>${mountProduct(item)}</li>`).join('')}</ul>`;

					$('.shelf--new').html(teste);

					setTimeout(function () {
						var numberProduct = $('.shelf__vitrine.loaded .prateleira.shelf--new ul li').length;
						$('.section__navTop__numberProduct p b').text(numberProduct);

						$(".product__info--name .description").each(function (i) {
							let len = $(this).text().length;
							if (len > 60) {
								$(this).text($(this).text().substr(0, 200) + '...');
							}
						});
					}, 1000)

					$('.shelf__vitrine').addClass('loaded');

				})
		}


		const appendProducts = (term) => {
			const endpoint = `/api/catalog_system/pub/products/search${term}`;
			$.ajax({
				url: endpoint,
				type: 'GET',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json; charset=utf-8'
				}
			})
				.done(function (data) {
					console.log(data);
					const dupRemove = filterShelf(data);


					//console.log(dupRemove, 'remove');
					dupRemove.map(item => {
						const li = `<li>${mountProduct(item)}</li>`;
						$('.shelf--new ul').append(li);
					});


					var numberProduct = $('.shelf__vitrine.loaded .prateleira.shelf--new ul li').length;
					$('.section__navTop__numberProduct p b').text(numberProduct);
					$(".product__info--name .description").each(function (i) {
						let len = $(this).text().length;
						if (len > 60) {
							$(this).text($(this).text().substr(0, 200) + '...');
						}
					});
					console.log('load more product');

				})
		}

		const smartFilter = (filters) => {
			const url = category + filters;
			renderProducts(url);
		}

		$('.search-multiple-navigator input').on('change', function () {
			urlFilters = '';
			$('.search-multiple-navigator input:checked').each(function () {
				urlFilters += '&' + $(this).attr('rel');
			})

			smartFilter(urlFilters);
		})

		$('.btn-load-more').on('click', function () {
			const fromPage = $('.shelf--new').data('from') + 30;
			const toPage = $('.shelf--new').data('to') + 30;
			const url = category + '&_from=' + fromPage + '&_to=' + toPage;
			appendProducts(url);
			$('.shelf--new').data('from', fromPage);
			$('.shelf--new').data('to', toPage);

			// setTimeout(function() {
			// 	var numberProduct = $('.shelf__vitrine.loaded .prateleira.shelf--new ul li').length;
			// 	$('.section__navTop__numberProduct p b').text(numberProduct);
			// 	console.log('load more product');
			// }, 4000)

		})


		if ($('body').hasClass('category') || $('body').hasClass('department')) {
			renderProducts(url);
		} else {
			let numberResult = $('.resultado-busca-numero:first .value').text();
			$('.section__navTop__numberProduct p b').text(numberResult);
		}
	}
});

