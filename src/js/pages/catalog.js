class catalog {
	constructor() {
		this.grid();
		this.numberProduct();
		this.checkText();
		this.orderBay();
		this.bgBannerCatalog();
	}

	especialCharMask(especialChar) {
		especialChar = especialChar.replace(/Ã§/g, "ç");
		especialChar = especialChar.replace(/Ãª/g, "ê");
		especialChar = especialChar.replace(/Ã/g, "Ó");
		especialChar = especialChar.replace(/Ã£o/g, "ã");
		especialChar = especialChar.replace(/%C3%A7/g, "ç");
		especialChar = especialChar.replace(/-/g, " ");
		return especialChar;
	}

	orderBay() {
		$(".orderBy select").change(function() {
			const orderBy = $(this).val();
			let url 	  = window.location.href;

            if(url.indexOf('&title=') == -1) {
				window.location = `${window.location.pathname}?O=${orderBy}`;
			} else {
				let title = url.split('title=')[1];
				window.location = `${window.location.pathname}?O=${orderBy}&title=${title}`;
			}
		});
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
		// let numberResult = $('.resultado-busca-numero:first .value').text();
		// $('.section__navTop__numberProduct p b').text(numberResult);

		// setTimeout(function() {
		// 	var numberProduct = $('.shelf__vitrine.loaded .prateleira.shelf--new ul li').length;
		// 	$('.section__navTop__numberProduct p b').text(numberProduct);
		// }, 4000)

		// $('.button.btn-load-more.confira-todos-produtos').on('click', function() {
		// 	setTimeout(function() {
		// 		var numberProduct = $('.shelf__vitrine.loaded .prateleira.shelf--new ul li').length;
		// 		$('.section__navTop__numberProduct p b').text(numberProduct);
		// 		console.log('load more product');
		// 	}, 4000)
		// })
	}

	checkText() {
		if (!$('.textCatalog p').length > 0) {
			$('.textCatalog').hide();
		}
	}

	bgBannerCatalog() {
		var banner = $('.banner.banner__category img');
		var url = banner.attr('src');
		var height = banner.attr('height');

		$('.banner.banner__category img')[0] ? $('.section__title').addClass('section__title--white') && $('body.catalog .section__title').css({ 'background-image': 'url(' + url + ')', height: '' + height +''}) : null
	}
}

$(document).ready(function() {
	$('.Cores label').each(function() {
		const img = $(this).attr('title');
		$(this).css('background-image', `/arquivos/${img}.png`);
	});
});

window.catalog = new catalog();
