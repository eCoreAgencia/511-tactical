

class Catalog {
	constructor() {

	}
	init(){

	}
}

$(document).ready(() => {
	if($('body').hasClass('catalog')){
		$('.product--shelf').each(function(){
			const name = $('.product__name .product__link', this).text();

			console.log(name);
			
		})
	}
});
