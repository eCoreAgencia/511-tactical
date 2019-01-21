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

		let self = this;
		this.variations = {};
		this.product = {};
        this.item = {};
        this.item.quantity = 1;
        this.item.seller = "1";
		this.makeZoom();

		if($('body').hasClass('product')) {
			this.addProductToCart();
			this.fixeInfoProduct();
		}

		const productWithVariations = getProductWithVariations(productId);
		productWithVariations.then(product => {
			if (product.available) {
				self.product = product;
				const price = self.renderPrice(product.skus[0]);
				$('.product__main .product__price').html(price);
				if(product.dimensionsMap.Tamanho[0] == 'U'){
					self.item.id = product.skus[0].sku;
				} else {
					self.renderSkuSelectors(product);
				}

				$('.product__main .product__buy').html(self.buttonBuy());
				$('.product__main .product__qtd').html(self.inputQuantity());
			} else {
				self.renderFormNotifyMe(product);
			}
		})

		$('.product__skus').on('click', '.sku-color', function(e){
			e.preventDefault();
			let idproduct = $(this).attr("data-product-id");
			let colorname = $(this).attr("style").split("/arquivos/")[1];
			colorname	  = colorname.replace(/1|2|3|4|5|6|7|8|9|0.|.jpg|'|\)| /g,'');
			colorname	  = colorname.replace(/-/g,' ');
			console.log(colorname)
			$('.product__skus .sku-color').removeClass('active');
			$(this).addClass('active');
			self.getImage(idproduct);
			// const productID = $(this).data('product-id');
			// self.changeProduct(productID);
		})



		$('.product__main .product__media').on('click', function (e) {
			e.preventDefault();
			$('.product__zoom').addClass('is-active');
		})

		$('.product__zoom .btn--close').on('click', function (e) {
			e.preventDefault();
			$('.product__zoom').removeClass('is-active');
		});
	}

	fixeInfoProduct() {
		var nav = $('.product__main .product__info');



		$(window).scroll(function () {
			var newsletter = $('.section__newsletter').offset();
			var dist = newsletter.top - nav.height();
			console.log(newsletter.top, dist, 'ass');
			if ($(document).scrollTop() > 115) {
				if ($(this).scrollTop() >= $('body main > .container').first().height() - 450) {
					nav.removeClass("menu-fixo");
				} else {
					nav.addClass("menu-fixo");
				}
			} else {
				nav.removeClass("menu-fixo");
			}
		});

	}

    inputQuantity() {
        return `<button class="button button--plus" onClick="Product.changeQuantity(1)">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16"><defs><path id="9voea" d="M60.714 1123.786v2.143c0 .591-.48 1.071-1.071 1.071H55v4.643c0 .591-.48 1.071-1.071 1.071h-2.143c-.592 0-1.072-.48-1.072-1.071V1127h-4.643c-.591 0-1.071-.48-1.071-1.071v-2.143c0-.592.48-1.072 1.071-1.072h4.643v-4.643c0-.591.48-1.071 1.072-1.071h2.143c.591 0 1.071.48 1.071 1.071v4.643h4.643c.591 0 1.071.48 1.071 1.072z"></path></defs><g><g transform="translate(-45 -1117)"><use fill="#e75300" xlink:href="#9voea"></use></g></g></svg>
            </button>
            <input class="product__qtd-value" type="text" value="1">
            <button class="button button--minus" onClick="Product.changeQuantity(-1)">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="5" viewBox="0 0 16 5"><defs><path id="459ea" d="M275.714 1124.071v2.143c0 .592-.48 1.072-1.071 1.072H261.07c-.591 0-1.071-.48-1.071-1.072v-2.143c0-.591.48-1.071 1.071-1.071h13.572c.591 0 1.071.48 1.071 1.071z"></path></defs><g><g transform="translate(-260 -1123)"><use fill="#e75300" xlink:href="#459ea"></use></g></g></svg>
            </button>`
    }

    changeQuantity(quantity) {
		console.log(quantity);
        const quantityInput = $('.product__qtd-value');
        changeQuantity(quantityInput, quantity);
    }

    addSku(sku) {
        console.log(sku,'teste');
	}

	renderPrice(product) {
		const installmentsValue = product.installmentsValue / 100;
		const listPrice = `<em class="valor-de price-list-price">De:<strong class="skuListPrice">${product.listPriceFormated}</strong></em>`;
		const bestPrice = `<em class="valor-por price-best-price">Por:<strong class="skuBestPrice">${product.bestPriceFormated}</strong></em>`;

		const installments = `<em class="valor-dividido price-installments"><span><span>ou <label class="skuBestInstallmentNumber">${product.installments}<span class="x">x</span> </label>de</span> <strong><label class="skuBestInstallmentValue">R$ ${ installmentsValue.formatMoney() }</label></strong></span></em>`
		const price = `<div class="price">
							<div class="plugin-preco">
								<div class="productPrice">
									<p class="descricao-preco">
										${ product.listPrice > 0 ? listPrice : ''}
										${ product.bestPrice > 0 ? bestPrice : ''}
										${ product.installments > 0 ? installments : ''}
									</p>
								</div>
							</div>
						</div>`;
		return price;
	}

    skuValidation() {
        let self = this;
        let skuValidated = true;

        $('select.sku-size').each(function() {
            var name = $(this).attr('name') || $(this).attr('id');
            var value = $(this).val();
			if (value) {
				self.item[name] = parseInt($(this).val());
			}

            console.log(self.item);
        })

        if(!this.item.hasOwnProperty('id')){
            $('<span class="error">Selecione um tamanho</span>').insertAfter('.product__skus--size .product__skus-title');
            skuValidated = false;
        }

        return skuValidated;
    }

    addProductToCart(button){
        if(this.skuValidation()) {
			let { id, quantity, seller } = this.item;
			console.log(this.item)
			addToCart(id, quantity);
			//const endpoint = `/checkout/cart/add?sku=${id}&qty=${quantity}&seller=1&redirect=true&sc=1`
			$(button).addClass('running');
			console.log("te2");
			setTimeout(function() {
				$(".minicart").addClass("active");
			}, 1000);
			// $('.minicart').addClass('active');

			//window.location.href = endpoint;

		}


        $(window).on('FC.ProductAdded', () => {
            $(button).removeClass('running')
        })
    }

    buttonBuy() {
        return `<button class="btn btn--buy ld-ext-right" onClick="Product.addProductToCart(this)">
            Adicionar ao Carrinho
            <div class="ld ld-ring ld-spin"></div>
      </button>`;
    }

	getIdSimilarSelected() {
		$('.product__skus--thumb input[type="radio"]:checked').each(function () {

		});
	}

	changeProduct(productId){
		let self = this;
		const productWithVariations = getProductWithVariations(productId);
		productWithVariations.then(product => {
			console.log(product);
			if (product.available) {
				self.product = product;
				const price = self.renderPrice(product.skus[0]);

				const select = `
            	<span class="product__skus-title">Tamanho</span>
				<select  class="sku-size" name="id">
					<option value="" hidden>Selecione um tamanho</option>
					${this.createSkuSelect(product.skus)}
				</select>`;
				$('.product__skus--select').html(select);
				$('.product__price').html(price);

				$(window).trigger('skuSelectorCreated');

			} else {
				self.renderFormNotifyMe(product);
				$('.product__table').hide();
			}
		})
	}



	renderSkuSelectors(product) {
        const productSimilar = getProductSimilarById(product.productId);
        console.log(product);
		productSimilar.then(products => {
			console.log(products[0]["Especificações técnicas"]);

			if(products[0]["Especificações técnicas"].length > 0){

				const items = products[0]["Especificações técnicas"][0].split(';');
				const detail = `
					<div class="product__description-detail">
						<span class="product__description-detail-title">Detalhes</span>
						<ul>${items.map(item => `<li> <span>+</span> ${item}</li>`).join('')}</ul>
					</div>`;

				$(detail).insertAfter('.product__description .productDescription');
			}



			const select = `
            <div class="product__skus--size product__skus--select">
                <span class="product__skus-title">Tamanho</span>
                <select  class="sku-size" name="id">
                    <option value="" hidden>Selecione um tamanho</option>
                    ${this.createSkuSelect(product.skus)}
                </select>
            </div>`;

			if (products.length > 0) {
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

	createSkuSelect(items) {
		return items.map(item => `<option value="${item.sku}">${item.skuname}</option>`).join('');
	}

	createSkuThumb(products) {
		console.log(products)
		return products.map(product => `<li><a style="background-image: url('/arquivos/${product.ListaCores[0]}.jpg')" class="sku-color" href="#" id="product-color-${product.productId}" data-product-id="${product.productId}"></a></li>`).join('');

	}

	getImage(idproduct) {
		const productSimilar = getProductSimilarById(idproduct);
		const selectID = idproduct;
		$(".thumbs li").remove();

		const productWithVariations = getProductWithVariations(idproduct)

		productWithVariations.then( product => {
			let urlPrinciapal = product.skus[0].image;
			$("#image #image-main").attr("src",urlPrinciapal);
			$('.product__zoom-image img').attr("src",urlPrinciapal);
		});

		productSimilar.then(products => {
			$('.product__zoom-thumbs').empty();
			products.map(index => {
				if(index.productId == selectID) {
					let arrayList = index.items[0].images;

					arrayList.map(index => {
						let urlImage = index.imageUrl;
						let renderImage = `<li>
												<a id="botaoZoom" href="javascript:void(0);" title="Zoom" rel="${urlImage}" zoom="${urlImage}" class="ON">
													<img src="${urlImage}" title="CALCA-APEX-BATTLE-BROWN-BR-42-CURTO---US-32---30" alt="CALCA-APEX-BATTLE-BROWN-BR-42-CURTO---US-32---30">
												</a>
											</li>`;
						let zoomImage = `<a href="javascript:void(0);">
												<img src="${urlImage}" title="CALCA-APEX-BATTLE-BROWN-BR-42-CURTO---US-32---30" alt="CALCA-APEX-BATTLE-BROWN-BR-42-CURTO---US-32---30">
											</a>`;
						$(renderImage).appendTo(".thumbs");
						$('.product__zoom-thumbs').append(zoomImage);


					})
				}
			})
		});
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




	buyProduct() {



	}

	makeZoom() {
		$('.zoomPup, .zoomWindow, .zoomPreload').remove();

		$('.thumbs li').each(function () {
			const img = $('img', this).attr('src');
			$('.product__zoom .product__zoom-thumbs').append(`<a href=""><img src="${img}" /></a>`);
		});

		$('#image a').each(function () {
			const img = $(this).attr('href');
			$('.product__zoom .product__zoom-image').append(`<img src="${img}" />`);
			$('#image').html(`<img src="${img}" />`);
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

		if($('.productDescription').is(':empty')){
			$('.product__description').hide();
		}

		if($('.productReference')[0]){
			const code = $('.productReference').text().split('_');
			$('.productReference').text(code[0]);
		}



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
			const footerPosition = $('.section__newsletter').offset().top;
			const pageScroll = window.pageYOffset || document.documentElement.scrollTop;
			var y = $(window).scrollTop();

			console.log(footerPosition, pageScroll, y);


		}

		if (!isMobile.any()) {
			positionFixed();

			$(window).scroll(() => {
				positionFixed();
			})
		}





		$(window).on('skuSelectorCreated', () => {
			const img = $('#image img');
			$('.zoomPup, .zoomWindow, .zoomPreload').remove();
			$('#image').html(img);

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
                    $('.error').remove();
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
		let reference = $('.productReference').text();
		let newReference = reference.split(',')[0];
		console.log(newReference);
		$('.productReference').text(newReference);
	}

})
