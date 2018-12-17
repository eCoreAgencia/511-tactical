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
		$('.btnOpenFilter').on('click', function(e) {
			e.preventDefault();
			if ($('.category__filter.filter').hasClass('active')) {
				$(this).html('<i class="icon-filter"></i><p>Mostrar</p><p>Filtros</p>');
				$('.category__filter.filter').fadeOut();
				$('.category__filter.filter').removeClass('active');
			} else {
				$(this).html('<i class="icon-filter"></i><p>Fechar</p><p>Filtros</p>');
				$('.category__filter.filter').fadeIn();
				$('.category__filter.filter').addClass('active');
			}
		});
	}

	clouseFilter() {
		$('.clouseFilter').on('click', function(e) {
			e.preventDefault();
			$('.btnOpenFilter').html('<i class="icon-filter"></i><p>Mostrar</p><p>Filtros</p>');
			$('.category__filter.filter').fadeOut();
			$('.category__filter.filter').removeClass('active');
		});
	}

	clearFilter() {
		$('.btnClear').on('click', function(e) {
			e.preventDefault();
			$('fieldset label.sr_selected').each(function() {
				$(this).trigger('click');
			});
		});
	}

	init() {
		$('.orderBy .select select').on('change', function() {
			const value = $(this).val();
			window.location.href = window.location.href + '?PS=12&O=' + value;
		});

		if (this.isExist(this.menu)) {
			console.log(this.menu);
		} else {
			console.log('Não existe');
		}

		$('.filter .search-multiple-navigator fieldset').each(function() {
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
	}

	isExist(e) {
		const exist = e == null ? false : true;
		return exist;
	}
}

if ($('body').hasClass('catalog')) {
	window.filter = new Filter();
}
