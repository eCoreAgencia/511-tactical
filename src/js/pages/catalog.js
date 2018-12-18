class catalog {
	constructor() {
		this.grid();
		this.numberProduct();
		this.checkText();
	}

	grid() {
		$('.grid_list').on('click', function(e) {
			e.preventDefault();

			$('.allVitrine .is-fluid .prateleira ul').addClass('active');
			$('.section__navTop__orderBy--grid a').removeClass('active');
			$(this).addClass('active');
		});

		$('.grid_grade').on('click', function(e) {
			e.preventDefault();

			$('.allVitrine .is-fluid .prateleira ul').removeClass('active');
			$('.section__navTop__orderBy--grid a').removeClass('active');
			$(this).addClass('active');
		});
	}

	numberProduct() {
		let numberResult = $('.resultado-busca-numero .value').text();
		$('.section__navTop__numberProduct p b').text(numberResult);
	}

	checkText() {
		if (!$('.textCatalog p').length > 0) {
			$('.textCatalog').hide();
		}
	}
}

$(document).ready(function() {
	$('.Cores label').each(function() {
		const img = $(this).attr('title');
		$(this).css('background-image', `/arquivos/${img}.png`);
	});
});

window.catalog = new catalog();
