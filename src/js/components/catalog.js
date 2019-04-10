
const R = require('ramda');
const slugify = require('slugify');

$(document).ready(() => {
	if($('body').hasClass('category')){
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

			$('.section__shelf').each(function(){
				var html = "";
				var title = $('.shelf__carousel--full.active h2', this).text();
				$('.filter__title', this).text(title);
				$('.prateleira h2', this).each(function(index){
					var text = $(this).text();
					var parentIndex = $(this).parents('.shelf__carousel--full').data('name');
					if(index == 0){
						html += '<li class="filter__opt-item"><a class="active" href="" data-name="'+parentIndex+'">'+text+'</a></li>'
					}else {
						html += '<li class="filter__opt-item"><a href="" data-name="'+parentIndex+'">'+text+'</a></li>'
					}
					
				});

				$('.filter__opt', this).html(html);
			})

			$('.filter__opt').on('click', 'a', function(e){
				e.preventDefault();
				$('.shelf__carousel--full').removeClass('active');
				var i = $(this).data('name');

				$('.shelf__carousel--full[data-name='+i+']').addClass('active')
			})

		});


	}
});
