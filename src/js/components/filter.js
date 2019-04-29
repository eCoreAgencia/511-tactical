import {
	getProductWithVariations,
	getSearchProducts
} from '../modules/vtexRequest'


class Filter {
	constructor() {
		this.menu = document.querySelector('.logo ');
		$('.helperComplement').remove();
		this.init();
		this.clearFilter();
		this.openFilter();
		this.clouseFilter();
		this.currentSearchUrl = '';
		this.currentPage = '1';
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

		const self = this


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

		if($('body').hasClass('category') || $('body').hasClass('department')){
			$(".filter input[type='checkbox']").vtexSmartResearch();
		}

		

		$('.search-multiple-navigator input').on('change', function () {
			let urlFilters = ''
			$('.search-multiple-navigator input').each(function () {
				if ($(this).is(':checked')) {
					urlFilters += '&' + $(this).attr('rel');
				}
			})
		})

		$('.pages li:not(.pgCurrent)').on('click', function(){
			const value = $(this).text();
			if(value === 'anterior'){
				self.loadMoreProducts(-1)
			} else if (value === 'próximo') {
				self.loadMoreProducts(+1)
			} else {
				self.loadMoreProducts(value)
			}
		})
	}

	isExist(e) {
		const exist = e == null ? false : true;
		return exist;
	}

	getUrl(scroll) {
		var s = scroll || false;
		if (s)
			return this.currentSearchUrl.replace(/PageNumber=[0-9]*/, 'PageNumber=' + this.currentPage);
		else
			return (searchUrl).replace(
				/PageNumber=[0-9]*/,
				'PageNumber=' + pageNumber
			);
	}

	getSearchUrl() {
		var url, content, preg;
		jQuery('script:not([src])').each(function() {
			content = jQuery(this)[0].innerHTML;
			preg = /\/buscapagina\?.+&PageNumber=/i;
			if (content.search(/\/buscapagina\?/i) > -1) {
				url = preg.exec(content);
				
			}
		});
		if (typeof url !== 'undefined' && typeof url[0] !== 'undefined') return url[0];
		else {
			log(
				'Não foi possível localizar a url de busca da página.\n Tente adicionar o .js ao final da página. \n[Método: getSearchUrl]'
			);
			return '';
		}
	}

	loadMoreProducts(page){
		const url = this.getSearchUrl();
		console.log(url);
	}
}

$(document).ready(function () {
	if ($('body').hasClass('catalog')) {
		window.filter = new Filter();
		


		if ($('body').hasClass('category') || $('body').hasClass('department')) {
			//renderProducts(url);
		} else {
			let numberResult = $('.resultado-busca-numero:first .value').text();
			$('.section__navTop__numberProduct p b').text(numberResult);
		}


	}
});

