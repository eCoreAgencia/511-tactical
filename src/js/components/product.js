import {
	getProductWithVariations,
	getProductSimilarById,
	getSearchProductById
} from '../modules/vtexRequest';
import {
	isMobile,
	slugify,
	addToCart,
	changeQuantity
} from '../utils';

import {findIndex, propEq, replace, remove, isEmpty } from 'ramda';

class Product {
	constructor() {
		const productId = $('#___rc-p-id').val();
		let self = this;
		this.similar = '';
		this.variations = {};
		this.product = {};
        this.item = {};
        this.item.quantity = 1;
        this.item.seller = "1";

		this.loading = `<div class="sp sp-circle"></div>`

		this.init(productId);



		if($('body').hasClass('product')) {
			this.addProductToCart();
			$('.product__main .product__media').append(this.loading);
			$('.product__skus').html(this.loading);
			$('.product__main .product__media').addClass('is-loading');
			//this.makeZoom();
			if($(window).width() > 800) {
				//this.fixeInfoProduct();
			}

			if (jQuery(".modal-window .box-banner").children().length <= 0) {
				$('.product__table').remove();
			}
		}

		const productWithVariations = getProductWithVariations(productId);
		productWithVariations.then(product => {


			if (product.available) {
				self.product = product;

				const skuI = findIndex(propEq('available', true))(product.skus);
				console.log(product.skus[skuI]);
				const price = self.renderPrice(product.skus[skuI]);
				$('.product__main .product__price').html(price);
				self.renderSkuSelectors(product);


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
			let nameColor = $(this).attr("style").split("/arquivos/")[1];
			colorname	  = colorname.replace(/1|2|3|4|5|6|7|8|9|0.|.jpg|'|\)| /g,'');
			colorname	  = colorname.replace(/-/g,' ');
			console.log(colorname)
			$('.product__skus .sku-color').removeClass('active');
			$(this).addClass('active');
			$('.product__main .product__media').addClass('is-loading');
			self.getImage(idproduct);
			const productID = $(this).data('product-id');
			self.changeProduct(productID);
			setTimeout(function() {
				$('.product__skus--color .colorSelect span').text(nameColor.replace(/.jpg|'|\)|/g,'').replace(/-/g,' '));
			}, 1500);
		})








		$('#show ul.thumbs li img').on('click', function (e) {
			e.preventDefault();

			const img = $(this).attr('src').replace('500-500', '1000-1000');
			$('#show #include #image img').attr('src', img);
			if($('.product__zoom .product__zoom-image img')[0]){
				$('.product__zoom .product__zoom-image img').attr('src', img);
			}else {
				const imgHtml = `<img src="${img}" alt="" />`;

				$('.product__zoom .product__zoom-image').html(imgHtml);
			}

		})

		const openZoom = (img) => {
			$('.product__zoom-image img').attr('src', img);
			$('.product__zoom').addClass('is-active');
		}

		$('.product__media').on('click', '.product__gallery-image .product__image', function (e) {
			console.log($(this).attr('src'));
			openZoom($(this).attr('src'));
		})

		$('.product__media').on('click', '.product__gallery-thumbs img', function (e) {
			//openZoom($(this).attr('src'));
			$('.product__media .product__gallery-image .product__image').attr('src', $(this).attr('src'));
		})

		$('.product__zoom .btn--close').on('click', function (e) {
			e.preventDefault();
			$('.product__media .product__gallery-image .product__image').attr('src', $('.product__zoom-image img').attr('src'));
			$('.product__zoom').removeClass('is-active');
		});

		$('.product__qtd').on('keyup', '.product__qtd-value', function(e){
			console.log($(this).val());
			self.item.quantity = parseInt($(this).val());
		})

		const name = $('.product__info .productName').text().replace(/ - TAM ÚNICO/g, '');
		$('.product__info .productName').html(name);
	}

	async init(productId) {
		const productJson = await getSearchProductById(productId);
		let images = []

		$('.thumbs li').each(function(){
			const img = $('img', this).attr('src');

			images.push({imageUrl: img})

			console.log(img);
		})
		this.gallery(images);
	}


	fixeInfoProduct() {
		var nav = $('.product__main .product__info');



		$(window).scroll(function () {
			var newsletter = $('.section__newsletter').offset();
			var dist = newsletter.top - nav.height();
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
		const self = this;
        if(this.skuValidation()) {
			console.log($('.product__qtd-value').val());
			let { id, quantity, seller } = this.item;
			quantity = $('.product__qtd .product__qtd-value').val();
			addToCart(id, quantity);
			$(button).addClass('running');
			setTimeout(function() {
				self.item = '';
				self.item.quantity = 1;
				self.item.seller = "1";
				$(".minicart").addClass("active");
			}, 1000);

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

				const skuI = findIndex(propEq('available', true))(product.skus);
				console.log(product.skus[skuI]);
				const price = self.renderPrice(product.skus[skuI]);
				$('.product__main .product__price').html(price);
				self.renderSkuSelectors(product);
			} else {
				self.renderFormNotifyMe(product);
			}
		})
	}



	async renderSkuSelectors(product) {
		const self = this;
		const productSimilar = await getProductSimilarById(product.productId);
		console.log(productSimilar);
		self.similar = productSimilar;






			let select = '';

			if (product.dimensionsMap.Tamanho[0] == 'U') {
				self.item.id = product.skus[0].sku;
				select = '';
			} else {


				select = `
						<div class="product__skus--size product__skus--select">
							<span class="product__skus-title">Tamanho</span>
							<select  class="sku-size" name="id">
								<option value="" hidden>Selecione um tamanho</option>
								${this.createSkuSelect(product.skus, product.dimensionsMap.Tamanho)}
							</select>
						</div>`;
			}




			if (productSimilar.length > 0) {


				if (productSimilar[0].hasOwnProperty("Especificações técnicas") && !$('.product__description .product__description-detail')[0]) {

					const items = productSimilar[0]["Especificações técnicas"][0].split(';');
					const detail = `
						<div class="product__description-detail">
							<span class="product__description-detail-title" style="display: none" >Detalhes</span>
							<ul>${items.map(item => `<li> <span>+</span> ${item}</li>`).join('')}</ul>
						</div>`;

					$(detail).insertAfter('.product__description .productDescription');
					let itemsLi = $('.product__description-detail ul li').length;
					if (itemsLi == 1) {
						$('.product__description-detail-title').css('display', 'none');
					} else {
						$('.product__description-detail-title').css('display', 'block');
					}
				}

				const list = `
						<div class="product__skus--color product__skus--thumb">
							<span class="product__skus-title">Cor</span>
							<ul>
								${this.createSkuThumb(productSimilar)}
							</ul>
							<p class="colorSelect">Cor selecionada: <span></span></p>
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

	}

	createSkuSelect(items,sizes) {
		//console.log(items);

		const newArray = items.map(item => {
			const skuname = {
				skuname: item.skuname.replace(/\s/g, "")
			}

			return skuname;

		});

		const newSizes = sizes.map(item => item.replace(/\s/g, ""));
		///console.log(newArray, newSizes);
		return newSizes.map(size => {
			let html = '';
			//console.log(size);
			const skuI = findIndex(propEq('skuname', size))(newArray);
			//console.log(size, skuI, '');
			if(skuI >= 0){
				html = `<option value="${items[skuI].sku}">${items[skuI].skuname}</option>`;
			}

			//console.log(html);
			return html;
			}).join('');
	}

	createSkuThumb(products) {
		const productIds = products.map(product => product.productId);
		const productFilters = products.filter((product, index) => {
			if (findIndex(propEq('productId', productIds[index]))(products) >= index) {
				return product;
			}
		})

		//console.log(productFilters);

		return productFilters.map(product => {

			if (product.hasOwnProperty("ListaCores")) {
				return `<li><a style="background-image: url('/arquivos/${product.ListaCores[0]}.jpg')" title="${product.ListaCores[0]}" class="sku-color" href="#" id="product-color-${product.productId}" data-product-id="${product.productId}"></a></li>`
			}

			return `<li><a title="" class="sku-color" href="#" id="product-color-${product.productId}" data-product-id="${product.productId}"></a></li>`;

		}).join('');

	}

	async getImage(idproduct) {
		const productId = findIndex(propEq('productId', idproduct))(this.similar);
		const productImages = this.similar[productId].items[0].images;
		this.gallery(productImages);
	}


	renderFormNotifyMe(product) {

		const skuIndex = findIndex(propEq('available', false))(product.skus);
		const html = `<div class="product__unavailable">
			<button class="btn btn--close"> X</button>
			<span class="product__unavailable-title"> PRODUTO INDISPONÍVEL</span>
			<p class="product__unavailable-text">
				Preencha os dados e clique no botão abaixo para ser avisado quando houver disponibilidade.
			</p>

			<form class="form" id="form-notifyme" action="/no-cache/AviseMe.aspx">
				<input type="hidden" name="notifymeIdSku" value="${product.skus[skuIndex].sku}"/>
				<div class="form-control">
					<input class="input" type="text" placeholder="Insira seu nome" name="notifymeClientName" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Insira seu nome...'" />
				</div>
				<div class="form-control">
					<input class="input" type="email" placeholder="Insira seu e-mail" name="notifymeClientEmail" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Insira seu nome...'" />
				</div>
				<button class="btn btn--primary btn--notify-me">Avise-Me</button>
			</form>
		</div>`;

		$('.product__action').hide();

		$('.product__skus').html(html);
	}


	gallery(images){
		//alert('teste');
		const productGalleryWrapper = document.querySelector('.product__main .product__media .product__media-top');
		productGalleryWrapper.innerHTML = this.loading;
		$('.product__zoom .product__zoom-thumbs').empty();
		$('.product__zoom .product__zoom-image').empty();
		images.map(image => {
			$('.product__zoom .product__zoom-thumbs').append(`<a href=""><img src="${image.imageUrl}" /></a>`);
		});

		$('.product__zoom .product__zoom-image').html(`<img src="${images[0].imageUrl}" />`);



		const productGallery = `<div class="product__gallery">
									<div class="product__gallery-thumbs">
										<ul class="product__thumbs">
										${ images.map(image => {
											const thumb = `
												<li class="product__thumbs-item">
													<img class="product__thumbs-image" src="${image.imageUrl}"  width="500" height="500" alt="" />
												</li>
											`
											return thumb;
										}).join('')}

										</ul>
									</div>
									<div class="product__gallery-image">
										<img class="product__image" src="${images[0].imageUrl}" width="500" height="500" alt="" />
									</div>
								</div>`
		console.log(images);

		productGalleryWrapper.innerHTML = productGallery;

		$(window).trigger('productGalleryLoaded');

		setTimeout(function () {
			$('.product__main .product__media').removeClass('is-loading');
		}, 1500)
	}

	notifyMe(e){
		e.preventDefault();
		console.log(this);
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

		$('.product__zoom').on('click', 'a', function (e) {
			e.preventDefault();
			const img = $('img', this).attr('src').replace('500-500', '1000-1000');
			$('.product__zoom .product__zoom-image img').attr('src', img);

		})



		const shelf__prev = `<button type='button' class='slick-prev shelf__button'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43"><defs><path id="vcuya" d="M1460 1326.21l21.21-21.21 21.21 21.21-21.21 21.21z"/><path id="vcuyc" d="M1481.5 1318.5l-7.52 7.52"/><path id="vcuyd" d="M1481.5 1333.02l-7.52-7.52"/><clipPath id="vcuyb"><use fill="#fff" xlink:href="#vcuya"/></clipPath></defs><g><g transform="matrix(-1 0 0 1 1503 -1305)"><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-miterlimit="50" stroke-width="4" clip-path="url(&quot;#vcuyb&quot;)" xlink:href="#vcuya"/></g><g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyc"/></g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyd"/></g></g></g></g></svg></button>`
		const shelf__next = `<button type='button' class='slick-next shelf__button'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43"><defs><path id="vcuya" d="M1460 1326.21l21.21-21.21 21.21 21.21-21.21 21.21z"/><path id="vcuyc" d="M1481.5 1318.5l-7.52 7.52"/><path id="vcuyd" d="M1481.5 1333.02l-7.52-7.52"/><clipPath id="vcuyb"><use fill="#fff" xlink:href="#vcuya"/></clipPath></defs><g><g transform="matrix(-1 0 0 1 1503 -1305)"><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-miterlimit="50" stroke-width="4" clip-path="url(&quot;#vcuyb&quot;)" xlink:href="#vcuya"/></g><g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyc"/></g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyd"/></g></g></g></g></svg></button>`

		$('ul.thumbs').slick({
			arrows: true,
			slidesToShow: 6,
			slidesToScroll: 1,
			vertical: true,
			infinite: true,
			prevArrow: shelf__prev,
			nextArrow: shelf__next,
			responsive: [{
				breakpoint: 800,
				settings: 'unslick'
			}]
		});

		$(window).on('productGalleryLoaded', () => {

			if (isMobile.any()) {
				$('.product__thumbs').slick({
					arrows: false,
					dots: true
				});


			}else {
				$('.product__thumbs').slick({
					arrows: true,
					slidesToShow: 6,
					slidesToScroll: 1,
					vertical: true,
					infinite: true,
					prevArrow: shelf__prev,
					nextArrow: shelf__next,
					responsive: [{
						breakpoint: 800,
						settings: 'unslick'
					}]
				});
			}


		});

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
		}

		if (!isMobile.any()) {
			//positionFixed();

			$(window).scroll(() => {
				//positionFixed();
			})
		}





		$(window).on('skuSelectorCreated', () => {
			const img = $('#image img');
			$('.zoomPup, .zoomWindow, .zoomPreload').remove();
			$('#image').html(img);

			if ($('.product__skus li')[0]){
				//$('.product__skus li:first-child').addClass('is-active');
				const color = $('.product__skus li:first-child a').attr('title').replace(/-/g, ' ');

				$('.product__skus .colorSelect span').html(color);
			}



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

		const isEmptyField = (fields, form) => {
			let empty = false;
			fields.map((field) => {
				if (isEmpty(field)){
					form.find(`[name=${field}]`).addClass('is-error');
					empty = true;
				}
			})

			return empty;
		}

		$('.product__main').on('submit', '#form-notifyme', function(e){
			e.preventDefault();
			let isValid = true;
			const form = $(this);
			var fields = {};
			var url = form.attr('action');
			form.find(
				`input[type="text"],
			input[type="number"],
			input[type="tel"],
			input[type="email"],
			input[type="hidden"],
			input[type="radio"]:checked,
			input[type="checkbox"]:checked,
			select,
			textarea`
			).each(function (i) {
				var name = $(this).attr('name') || $(this).attr('id');
				const value = $(this).val();
				if (name) {
					if (!isEmpty(value)) {
						fields[name] = value

					}else{
						isValid = false;
						$(this).addClass('is-error');
					}
				}
			});

			if(isValid){
				$.ajax({
					url: url,
					type: 'POST',
					headers: {
						accept: 'application/vnd.vtex.masterdata.v10+json',
						'content-type': 'application/json; charset=utf-8'
					},
					data: JSON.stringify(fields)
				})
					.done(function() {
						const success_msg = `<span class="success-msg">Cadastrado com sucesso, assim que o produto for disponibilizado você receberá um email avisando.</span>`;

						$(success_msg).insertBefore('.product__main #form-notifyme');
					})
					.fail(function(jqXHR, textStatus) {
						const success_msg = `<span class="success-msg">Cadastrado com sucesso, assim que o produto for disponibilizado você receberá um email avisando.</span>`;

						$(success_msg).insertBefore('.product__main #form-notifyme');
						/*var msg = JSON.parse(jqXHR.responseText);
						console.log('define notification:', 'error', msg);*/

					});
			}


		})


		$('.product__main').on('click', '.product__unavailable .btn--close', function (){
			const productId = $('#___rc-p-id').val();

			window.Product.changeProduct(productId);
			$('.product__action').show();
		})




	}

})
