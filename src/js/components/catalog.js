
const R = require('ramda');
const slugify = require('slugify');

$(document).ready(() => {
	if($('body').hasClass('catalog')){
		//$(`.prateleira ul > li`).hide();
		const newShelf = [];
		const productNames = []





		const loadShelf = () => {
			const liLength = $(`.prateleira .prateleira:not(.eached) ul > li:not(.helperComplement)`).length
			$('.prateleira .prateleira:not(.eached) .product--shelf').each(function (index) {
				const li = $(this).parent();
				const name = $('.product__name .product__link', this).text();
				const slug = slugify(name, {
					lower: true
				});

				const pred = productNames.indexOf(slug);


				if (pred < 0) {
					productNames.push(slug);
					newShelf.push(li.html());
				}


				if (index + 1 == liLength) {
					const itemsToRemove = newShelf.length % 4;
					let filterShelf = ''

					if (newShelf.length > 4) {
						filterShelf = R.dropLast(itemsToRemove, newShelf)
					}else {
						filterShelf = newShelf;
					}

					console.log(R.uniq(filterShelf))

					const list = filterShelf.map(shelf => `<li>${shelf}</li>`).join('')
					$('.shelf__vitrine .prateleira .prateleira.eached').remove();
					$('.shelf__vitrine').addClass('loaded');
					$('.shelf__vitrine .vitrine .prateleira').html(`<div class="prateleira"><ul>${list}</ul></div>`);
					$('.shelf__vitrine .prateleira .prateleira').addClass('eached');

					$('.section__navTop__numberProduct b').text(filterShelf.length);
				}


			})
		}




		loadShelf();



		$(document).ajaxStop(function () {

			loadShelf();

		});


	}
});
