import {
    getProductWithVariations,
    getProductSimilarById
} from '../modules/vtexRequest';
import {
	isMobile,
	slugify,
    addToCart,
    changeQuantity
} from '../utils';

class Product {
	constructor() {
        const productId = $('#___rc-p-id').val();
        const quantityInput = $('.product__qtd-value');
        let self = this;
        this.variations = {};
        this.product = {};
        this.productSimilar = [];
        this.makeZoom();
        $('.zoomPup, .zoomWindow, .zoomPreload').remove();
		const productWithVariations = getProductWithVariations(productId);
		productWithVariations.then(product => {
			if (product.available) {
                self.product = product;
				self.renderSkuSelectors(product);
			} else {
				self.renderFormNotifyMe(product);
			}
		})

        $('.button--minus').on('click', () => {
            changeQuantity(quantityInput, -1);
        })

        $('.button--plus').on('click', () => {
			changeQuantity(quantityInput, 1);
		})

		$('.btn--buy').on('click', function () {
            $(this).addClass('running');
			self.buyProduct();
        });
        
        $('.image-zoom').on('click', function (e) {
            e.preventDefault();
            $('.product__zoom').addClass('is-active');
        })

        $('.product__zoom .btn--close').on('click', function (e) {
            e.preventDefault();
            $('.product__zoom').removeClass('is-active');
        });

        $('body').on('change', '.product__skus--thumb input[type="radio"]', function(){
            if($(this).is(':checked')){
                console.log($(this).val());
            }
        })
        

       
    }

    getIdSimilarSelected() {
        $('.product__skus--thumb input[type="radio"]:checked').each(function(){
            
        });
    }

	renderSkuSelectors(product) {
        const productSimilar = getProductSimilarById(product.productId);
        productSimilar.then(products => {
            console.log(products);
            

            const select = `
            <div class = "product__skus--size product__skus--select">
                <span class="product__skus-title">Tamanho</span>
                <select name="Tamanho">
                    <option value="" hidden>Selecione um tamanho</option>
                    ${this.createSkuSelect(product.dimensionsMap.Tamanho)}
                </select>
            </div>`;

            if(products.length > 0) {
                const list = `
                    <div class="product__skus--color product__skus--thumb">
                        <span class="product__skus-title">Cor</span>
                        <ul>
                            ${this.createSkuThumb(products)}
                        </ul>
                </div>`;
                const skus = `<div class="product__skus-inner">
                    ${list}
                    ${select}
            </div>`
            $('.product__skus').html(skus);
            } else {
                const skus = `<div class="product__skus-inner">
                    ${select}
                </div>`
                $('.product__skus').html(skus);
            }

            
            $(window).trigger('skuSelectorCreated');
        });
		
	}

	createSkuSelect(dimensions) {
		return dimensions.map(dimension => `<option value="${dimension}">${dimension}</option>`).join('');
	}

	createSkuThumb(products) {
       return products.map(product => `<li><label for="product-color-${product.productId}">${product.productName}</label><input type="radio" id="product-color-${product.productId}" name="Cor" value="${product.productId}"></li>`).join('');

    }
    
    
    

	renderFormNotifyMe() {
		const html = `<div class="product__unavailable">
			<span class="product__unavailable-title"> PRODUTO INDISPONÍVEL</span>
			<p class="product__unavailable-text">
				Preencha os dados e clique no botão abaixo para ser avisado quando houver disponibilidade.
			</p>

			<form class="form" id="form-notifyme" action="/no-cache/AviseMe.aspx">
				<div class="form-control">
					<input class="input" type="text" placeholder="Insira seu nome" name="notifymeClientName" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Insira seu nome...'" />
				</div>
				<div class="form-control">
					<input class="input" type="email" placeholder="Insira seu e-mail" name="notifymeClientEmail" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Insira seu nome...'" />
				</div>
				<button class="btn btn--primary">Avise-Me</button>
			</form>
		</div>`;

		$('.product__action').hide();

		$('.product__skus').html(html);
    }

    getSkuSelected() {

        let self = this;

        $('.product__skus-inner').find(
            `input[type="text"],
            input[type="number"],
            input[type="tel"],
            input[type="email"],
            input[type="hidden"],
            input[type="radio"]:checked,
            input[type="checkbox"]:checked,
            select,
            textarea`
        ).each(function(i) {
            var name = $(this).attr('name') || $(this).attr('id');
            if (name && this.value) {
                self.variations[name] = $(this).val();
            }
        });

        if(!self.variations.hasOwnProperty('Tamanho')){
            $('<span class="error">Selecione um tamanho</span>').insertAfter('.product__skus--size .product__skus-title')
            return false
        }

        if(!self.variations.hasOwnProperty('Cor')){
            $('<span class="error">Selecione um cor</span>').insertAfter('.product__skus--color .product__skus-title')
            return false
        }
        console.log(self.variations)

        return true;
    }

    getSkuId() {
        let self = this;
        return this.product.skus.filter(sku => {
            
            if(sku.dimensions.Cor == self.variations.Cor && sku.dimensions.Tamanho == self.variations.Tamanho){
                return sku;
            }
        });
    }
    buyProduct() {
        
        let self = this;
        console.log(self.variations)
        
        if(self.getSkuSelected()){
            const sku = self.getSkuId();
            const qtd = parseInt($('.product__qtd-value').val());
            if(sku[0]){
                console.log(sku[0]);
                addToCart(sku[0].sku, qtd);
            }else{
                alert('Produto não disponível')
            }
            
        }else {
            $('.btn--buy').removeClass('running');
        }
			
    }

    makeZoom() {
        $('.thumbs li').each(function(){
            const img = $('img', this).attr('src');
            $('.product__zoom .product__zoom-thumbs').append(`<a href=""><img src="${img}" /></a>`);
        });

        $('.image-zoom').each(function(){
            const img = $(this).attr('href');
            $('.product__zoom .product__zoom-image').append(`<img src="${img}" />`);
        });

        $('.product__zoom').on('click', 'a', function (e) {
            e.preventDefault();
            const img = $('img', this).attr('src').replace('500-500', '1000-1000');
            $('.product__zoom .product__zoom-image img').attr('src', img);

        })
    }

}

$(document).ready(() => {
	if ($('body').hasClass('product')) {
        window.productChoice = {};
        window.Product = new Product();


        
        const shelf__prev = `<button type='button' class='slick-prev shelf__button'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43"><defs><path id="vcuya" d="M1460 1326.21l21.21-21.21 21.21 21.21-21.21 21.21z"/><path id="vcuyc" d="M1481.5 1318.5l-7.52 7.52"/><path id="vcuyd" d="M1481.5 1333.02l-7.52-7.52"/><clipPath id="vcuyb"><use fill="#fff" xlink:href="#vcuya"/></clipPath></defs><g><g transform="matrix(-1 0 0 1 1503 -1305)"><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-miterlimit="50" stroke-width="4" clip-path="url(&quot;#vcuyb&quot;)" xlink:href="#vcuya"/></g><g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyc"/></g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyd"/></g></g></g></g></svg></button>`
        const shelf__next = `<button type='button' class='slick-next shelf__button'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43"><defs><path id="vcuya" d="M1460 1326.21l21.21-21.21 21.21 21.21-21.21 21.21z"/><path id="vcuyc" d="M1481.5 1318.5l-7.52 7.52"/><path id="vcuyd" d="M1481.5 1333.02l-7.52-7.52"/><clipPath id="vcuyb"><use fill="#fff" xlink:href="#vcuya"/></clipPath></defs><g><g transform="matrix(-1 0 0 1 1503 -1305)"><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-miterlimit="50" stroke-width="4" clip-path="url(&quot;#vcuyb&quot;)" xlink:href="#vcuya"/></g><g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyc"/></g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyd"/></g></g></g></g></svg></button>`
    
		$('.shelf__carousel--full ul').slick({
			arrows: true,
			slidesToShow: 2,
			slidesToScroll: 1,
			infinite: true,
			prevArrow: shelf__prev,
			nextArrow: shelf__next,
			responsive: [{
				breakpoint: 800,
				settings: 'unslick'
			}]
		});
		if (isMobile.any()) {
			$('.thumbs').slick({
				arrows: false,
				dots: true
            });
            
            
        }
        
        const positionFixed = () => {
            const distancePageTop = 100;
            const footerPosition = $('.section__newsletter').offset().top;
            const windowHeight = $(window).height();
            const pageScroll = window.pageYOffset || document.documentElement.scrollTop;
    
            if (pageScroll >= distancePageTop) {
                $('.product__main .product__info').addClass('product__info--fixed');
                console.log(pageScroll, footerPosition);
                if (footerPosition - windowHeight) { 
                    $('.product__main .product__info--fixed').addClass('product__info--opacity');
                } else {
                    $('.product__main .product__info--fixed').addClass('product__info--opacity');
                }
            } else {
                $('.product__main .product__info').removeClass('product__info--fixed');
            }
        }
        
        if (!isMobile.any()) {
            positionFixed();
    
            $(window).scroll(() => {
                positionFixed();
            })
        }

		



		$(window).on('skuSelectorCreated', () => {
			$('select').each(function () {
				var $this = $(this),
					numberOfOptions = $(this).children('option').length;

				$this.addClass('select-hidden');
				$this.wrap('<div class="select"></div>');
				$this.after('<div class="select-styled"></div>');

				var $styledSelect = $this.next('div.select-styled');
				$styledSelect.text($this.children('option').eq(0).text());
				$styledSelect.append('<i class="icon-arrow-right"></i>');

				var $list = $('<ul />', {
					'class': 'select-options'
				}).insertAfter($styledSelect);

				for (var i = 0; i < numberOfOptions; i++) {
					$('<li />', {
						text: $this.children('option').eq(i).text(),
						rel: $this.children('option').eq(i).val()
					}).appendTo($list);
				}

				var $listItems = $list.children('li');

				$styledSelect.click(function (e) {
					e.stopPropagation();
					$('div.select-styled.active').not(this).each(function () {
						$(this).removeClass('active').next('ul.select-options').hide();
					});
					$(this).toggleClass('active').next('ul.select-options').toggle();
				});

				$listItems.click(function (e) {
					e.stopPropagation();
					$styledSelect.text($(this).text()).removeClass('active');
					$styledSelect.append('<i class="icon-arrow-right"></i>');
					$this.val($(this).attr('rel'));
					$list.hide();
				});

				$(document).click(function () {
					$styledSelect.removeClass('active');
					$list.hide();
				});




			});
		});
	}

})
