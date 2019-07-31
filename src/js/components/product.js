import {
	getProductWithVariations,
	getProductSimilarById,
	getSearchProductById,
	getSearchProductByUrl,
	getInventoryLogistics
} from "../modules/vtexRequest";
import {
	isMobile,
	slugify,
	addToCart,
	changeQuantity,
	isLocalhost
} from "../utils";

import axios from "axios";

import { findIndex, propEq, replace, remove, isEmpty, isNil } from "ramda";

class Product {
	constructor() {
		const productId = $("#___rc-p-id").val();
		let self = this;
		this.similar = "";
		this.variations = {};
		this.product = {};
		this.item = {};
		this.item.quantity = 1;
		this.item.seller = "2";
		this.cart = [];
		this.productSelected = productId;

		this.loading = `<div class="sp sp-circle"></div>`;

		this.init(productId);

		$(window).on("skuSelectorCreated", () => {
			self.getTotalProducts();
			console.log(self.cart, "skuSelectorCreated");
			if (!isEmpty(self.cart)) {
				self.cart.map(item => {
					$(`input[name="sku-${item.sku}"]`).val(item.quantity);
				});
			}

			$(`.product__skus .product-id-${self.productSelected}`).addClass(
				"is-active"
			);
			let color = $(
				`.product__skus #product-color-${self.productSelected}`
			)
				.attr("title");

			if (!isNil(color)) {
				console.log(color);
				color = color.replace(/-/g, " ");
			} else {
				console.info(`O Sku de id: ${self.productSelected} está sem cor cadastrada no campo produto Lista Cores`);
			}


			$(".colorSelect span").html(color);
		});

		if ($("body").hasClass("product")) {
			//$('body').addClass('user-logged')
			this.addProductToCart();
			$(".product__main .product__media").append(this.loading);
			$(".product__skus").html(this.loading);
			$(".product__main .product__media").addClass("is-loading");
			//this.makeZoom();
			if ($(window).width() > 800) {
				//this.fixeInfoProduct();
			}

			if (jQuery(".modal-window .box-banner").children().length <= 0) {
				$(".product__table").remove();
			}
		}

		const productWithVariations = getProductWithVariations(productId);
		productWithVariations.then(product => {
			if (product.available) {
				self.product = product;

				const skuI = findIndex(propEq("available", true))(product.skus);
				console.log(product.skus[skuI]);
				const price = self.renderPrice(product.skus[skuI]);
				$(".product__main .product__info--main .product__price").html(
					price
				);
				self.renderSkuSelectors(product);

				$(".product__main .product__action-top .product__buy").html(
					self.buttonBuy()
				);
				$(".product__main .product__qtd").html(self.inputQuantity());
			} else {
				self.renderFormNotifyMe(product);
			}
		});

		$(".product__skus").on("click", ".sku-color", function(e) {
			e.preventDefault();
			let idproduct = $(this).attr("data-product-id");
			let colorname = $(this)
				.attr("style")
				.split("/arquivos/")[1];
			let nameColor = $(this)
				.attr("style")
				.split("/arquivos/")[1];
			colorname = colorname.replace(
				/1|2|3|4|5|6|7|8|9|0.|.jpg|'|\)| /g,
				""
			);
			colorname = colorname.replace(/-/g, " ");
			console.log(colorname);
			$(".product__skus .sku-color").removeClass("active");
			$(this).addClass("active");
			$(".product__main .product__media").addClass("is-loading");
			self.getImage(idproduct);
			const productID = $(this).data("product-id");
			self.changeProduct(productID);
			self.productSelected = productID;
		});

		$("#show ul.thumbs li img").on("click", function(e) {
			e.preventDefault();

			const img = $(this)
				.attr("src")
				.replace("500-500", "1000-1000");
			$("#show #include #image img").attr("src", img);
			if ($(".product__zoom .product__zoom-image img")[0]) {
				$(".product__zoom .product__zoom-image img").attr("src", img);
			} else {
				const imgHtml = `<img src="${img}" alt="" />`;

				$(".product__zoom .product__zoom-image").html(imgHtml);
			}
		});

		const openZoom = img => {
			$(".product__zoom-image img").attr("src", img);
			$(".product__zoom").addClass("is-active");
		};

		$(".product__media").on(
			"click",
			".product__gallery-image .product__image",
			function(e) {
				console.log($(this).attr("src"));
				const img = $(this)
					.attr("src")
					.replace("500-500", "1000-1000");
				openZoom(img);
			}
		);

		$(".product__media").on(
			"click",
			".product__gallery-thumbs img",
			function(e) {
				$(
					".product__media .product__gallery-image .product__image"
				).attr("src", $(this).attr("src"));
			}
		);

		$(".product__zoom .btn--close").on("click", function(e) {
			e.preventDefault();
			$(".product__media .product__gallery-image .product__image").attr(
				"src",
				$(".product__zoom-image img").attr("src")
			);
			$(".product__zoom").removeClass("is-active");
		});

		$(".product__qtd").on("keyup", ".product__qtd-value", function(e) {
			console.log($(this).val());
			self.item.quantity = parseInt($(this).val());
		});

		// $(".product__skus").on("keyup", ".quantity-product", function(e) {
		$(".product__skus").on("change", ".quantity-product", function(e) {
			const productSelected = {};
			const skuId = $(this)
				.parents("tr")
				.find(".size")
				.data("sku");
			const stock = parseInt(
				$(this)
					.parents("tr")
					.find(".stock")
					.text()
			);
			let qtd = parseInt($(this).val()) || 0;
			console.log($(this).val(), skuId);
			// const skuIndex = findIndex(propEq("id", skuId))(self.cart);
			var skuIndex = -1;
			for (var i = 0; i < self.cart.length; i++) {
				if(self.cart[i].id == skuId) {
					skuIndex = i;
				}
			}
			console.log(skuIndex);
			if (qtd > stock) {
				qtd = stock;
				$(this).val(stock);
			}
			if (skuIndex >= 0) {
				if (qtd > 0) {
					self.cart[skuIndex].quantity = qtd;
				} else {
					// self.cart.splice(self.cart[skuIndex], 1);
					self.cart.splice(skuIndex, 1);
				}

				self.getTotalProducts();
			} else {
				productSelected.id = skuId;
				productSelected.quantity = qtd;
				productSelected.seller = 1;

				self.cart.push(productSelected);

				self.getTotalProducts();
			}
		});

		const name = $(".product__info .productName")
			.text()
			.replace(/ - TAM ÚNICO/g, "");
		$(".product__info .productName").html(name);
	}

	async init(productId) {
		const productJson = await getSearchProductById(productId);
		let images = [];

		$(".thumbs li").each(function() {
			const img = $("img", this).attr("src");

			images.push({ imageUrl: img });

			console.log(img);
		});
		this.gallery(images);
	}

	fixeInfoProduct() {
		var nav = $(".product__main .product__info");

		$(window).scroll(function() {
			var newsletter = $(".section__newsletter").offset();
			var dist = newsletter.top - nav.height();
			if ($(document).scrollTop() > 115) {
				if (
					$(this).scrollTop() >=
					$("body main > .container")
						.first()
						.height() -
						450
				) {
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
            </button>`;
	}

	changeQuantity(quantity) {
		console.log(quantity);
		const quantityInput = $(".product__qtd-value");
		changeQuantity(quantityInput, quantity);
	}

	addSku(sku) {
		console.log(sku, "teste");
	}

	renderPrice(product) {
		const installmentsValue = product.installmentsValue / 100;
		const listPrice = `<em class="valor-de price-list-price">De:<strong class="skuListPrice">${
			product.listPriceFormated
		}</strong></em>`;
		const bestPrice = `<em class="valor-por price-best-price">Por:<strong class="skuBestPrice">${
			product.bestPriceFormated
		}</strong></em>`;

		const installments = `<em class="valor-dividido price-installments"><span><span>ou <label class="skuBestInstallmentNumber">${
			product.installments
		}<span class="x">x</span> </label>de</span> <strong><label class="skuBestInstallmentValue">R$ ${installmentsValue.formatMoney()}</label></strong></span></em>`;
		const price = `<div class="price">
							<div class="plugin-preco">
								<div class="productPrice">
									<p class="descricao-preco">
										${product.listPrice > 0 ? listPrice : ""}
										${product.bestPrice > 0 ? bestPrice : ""}
										${product.installments > 0 ? installments : ""}
									</p>
								</div>
							</div>
						</div>`;
		return price;
	}

	skuValidation() {
		let self = this;
		let skuValidated = true;

		$("select.sku-size").each(function() {
			var name = $(this).attr("name") || $(this).attr("id");
			var value = $(this).val();
			if (value) {
				self.item[name] = parseInt($(this).val());
			}

			console.log(self.item);
		});

		if (!this.item.hasOwnProperty("id")) {
			$('<span class="error">Selecione um tamanho</span>').insertAfter(
				".product__skus--size .product__skus-title"
			);
			skuValidated = false;
		}

		return skuValidated;
	}

	addProductToCart(button) {
		if (isEmpty(this.cart)) {
			$('<span class="error">Selecione um tamanho</span>').insertAfter(
				".product__skus--size .product__skus-title"
			);
		} else {
			$(button).addClass("running");
			vtexjs.checkout
				.addToCart(this.cart, null, 2)
				.done(function(orderForm) {
					$(button).removeClass("running");

					$(".minicart").addClass("active");
				});
		}

		$(window).on("FC.ProductAdded", () => {
			$(button).removeClass("running");
		});
	}

	buttonBuy() {
		return `<button class="btn btn--buy ld-ext-right" onClick="Product.addProductToCart(this)">
            Adicionar todos ao Carrinho
            <div class="ld ld-ring ld-spin"></div>
      </button>`;
	}

	getIdSimilarSelected() {
		$('.product__skus--thumb input[type="radio"]:checked').each(
			function() {}
		);
	}

	changeProduct(productId) {
		let self = this;
		const productWithVariations = getProductWithVariations(productId);
		productWithVariations.then(product => {
			console.log(product);

			if (product.available) {
				self.product = product;

				const skuI = findIndex(propEq("available", true))(product.skus);
				console.log(product.skus[skuI]);
				const price = self.renderPrice(product.skus[skuI]);
				$(".product__main .product__info--main .product__price").html(
					price
				);
				self.renderSkuSelectors(product);
			} else {
				self.renderFormNotifyMe(product);
			}
		});
	}

	renderStock(quantity, sku) {
		//if (isLocalhost) sku = 100693;
		if (quantity > 10) {
			quantity = "";
			const endpoint = `https://tacticalb2b-fullcore.herokuapp.com/estoque.php?skuId=${sku}`;

			axios.get(endpoint).then(res => {
				console.log(res.data.balance[0].totalQuantity);
				$(`.product__skus td.sku-${sku}`).html(
					res.data.balance[0].totalQuantity
				);
			});
		}

		return quantity;
	}

	async renderSkuSelectors(product) {
		const self = this;
		const productSimilar = await getProductSimilarById(product.productId);
		const productJson = await getSearchProductByUrl(window.location.pathname);
		console.log(productSimilar, 'similares');
		console.log(productJson, 'search');

		$('.productName').html(productJson[0].productName)
		self.similar = productSimilar;

		let select = "";

		if (product.dimensionsMap.Tamanho[0] == "U") {
			self.item.id = product.skus[0].sku;

			select = `
						<div class="product__skus--size product__skus--table">
							<table class="table">
								<thead>
									<tr>
										<th>Tamanho</th>
										<th>Em Estoque</th>
										<th>Quantidade</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="size" data-sku="${product.skus[0].sku}">${
				product.skus[0].skuname
			}</td>
										<td class="stock sku-${product.skus[0].sku}">
											${this.renderStock(product.skus[0].availablequantity, product.skus[0].sku)}
										</td>
										<td class="quantity"><input name="sku-${
											product.skus[0].sku
										}" class="quantity-product" type="text" placeholder="0"/></td>
									</tr>
								</tbody>
							</table>
						</div>`;
		} else {
			select = `
						<div class="product__skus--size product__skus--table">
							<table class="table">
								<thead>
									<tr>
										<th>Tamanho</th>
										<th>Em Estoque</th>
										<th>Quantidade</th>
									</tr>
								</thead>
								<tbody>
									${this.createSkuSelect(product.skus, product.dimensionsMap.Tamanho)}
								</tbody>
							</table>
						</div>`;
		}

		if (productSimilar.length > 0) {
			if (
				productSimilar[0].hasOwnProperty("Especificações técnicas") &&
				!$(".product__description .product__description-detail")[0]
			) {
				const items = productSimilar[0][
					"Especificações técnicas"
				][0].split(";");
				const detail = `
						<div class="product__description-detail">
							<span class="product__description-detail-title" style="display: none" >
							<svg class="section__title__ico" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 25 25"><defs><path id="qg31a" d="M874.24 1114.82a3.41 3.41 0 0 1-3.42 3.42H856.2a3.41 3.41 0 0 1-3.4-3.42h-.02v-14.62h.02a3.41 3.41 0 0 1 3.4-3.42h14.63a3.41 3.41 0 0 1 3.42 3.42v14.62zM851 1120h25v-25h-25z"></path><path id="qg31b" d="M870.69 1111.73c0 1.2-.97 2.16-2.16 2.16h-9.25c-1.2 0-2.16-.97-2.16-2.16h-.01v-9.26h.01c0-1.19.97-2.16 2.16-2.16v-.01h9.25v.01c1.2 0 2.16.97 2.16 2.16v9.26zm-14.85 3.43h16.13v-16.13h-16.13z"></path><path id="qg31c" d="M867.93 1106.51h-3.45v-3.45h-1.15v3.45h-3.46v1.16h3.46v3.45h1.15v-3.45h3.45z"></path></defs><g><g transform="translate(-851 -1095)"><g><use fill="#e75300" xlink:href="#qg31a"></use></g><g><use fill="#e75300" xlink:href="#qg31b"></use></g><g><use fill="#e75300" xlink:href="#qg31c"></use></g></g></g></svg>
							Detalhes</span>
							<ul>${items.map(item => `<li> <span>+</span> ${item}</li>`).join("")}</ul>
						</div>`;

				$(detail).insertAfter(
					".product__description .productDescription"
				);
				let itemsLi = $(".product__description-detail ul li").length;
				if (itemsLi == 1) {
					$(".product__description-detail-title").css(
						"display",
						"none"
					);
				} else {
					$(".product__description-detail-title").css(
						"display",
						"flex"
					);
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

				</div>`;
			$(".product__skus").html(skus);
		} else {
			const list = `
						<div class="product__skus--color product__skus--thumb">
							<span class="product__skus-title">Cor</span>
							<ul>
								${this.createSkuThumb(productJson)}
							</ul>
							<p class="colorSelect">Cor selecionada: <span></span></p>
					</div>`;
			const skus = `<div class="product__skus-inner">
						${list}
						${select}
					</div>`;
			$(".product__skus").html(skus);
		}

		$(window).trigger("skuSelectorCreated");
	}

	createSkuSelect(items, sizes) {
		console.log(items);

		const newArray = items.map(item => {
			const skuname = {
				skuname: item.skuname.replace(/\s/g, "")
			};

			return skuname;
		});

		const newSizes = sizes.map(item => item.replace(/\s/g, ""));
		return newSizes
			.map(size => {
				let html = "";
				const skuI = findIndex(propEq("skuname", size))(newArray);
				if (skuI >= 0) {
					html = `<tr>
					<td class="size" data-sku="${items[skuI].sku}">${items[skuI].skuname}</td>
					<td class="stock sku-${items[skuI].sku}">
						${this.renderStock(items[skuI].availablequantity, items[skuI].sku)}
					</td>
					<td class="quantity"><input name="sku-${
						items[skuI].sku
					}"class="quantity-product" type="text" placeholder="0"/></td>
				</tr>`;
				}

				return html;
			})
			.join("");
	}

	createSkuThumb(products) {
		const productIds = products.map(product => product.productId);
		const productFilters = products.filter((product, index) => {
			if (
				findIndex(propEq("productId", productIds[index]))(products) >=
				index
			) {
				return product;
			}
		});

		return productFilters
			.map(product => {
				if (product.hasOwnProperty("ListaCores")) {
					return `<li class="product-id-${
						product.productId
					}"><a style="background-image: url('/arquivos/${
						product.ListaCores[0]
					}.jpg')" title="${
						product.ListaCores[0]
					}" class="sku-color" href="#" id="product-color-${
						product.productId
					}" data-product-id="${product.productId}"></a></li>`;
				}

				return `<li class="product-id-${
					product.productId
				}"><a title="" class="sku-color" href="#" id="product-color-${
					product.productId
				}" data-product-id="${product.productId}"></a></li>`;
			})
			.join("");
	}

	async getImage(idproduct) {
		const productId = findIndex(propEq("productId", idproduct))(
			this.similar
		);
		const productImages = this.similar[productId].items[0].images;
		this.gallery(productImages);
	}

	renderFormNotifyMe(product) {
		const skuIndex = findIndex(propEq("available", false))(product.skus);
		const html = `<div class="product__unavailable">
			<button class="btn btn--close"> X</button>
			<span class="product__unavailable-title"> PRODUTO INDISPONÍVEL</span>
			<p class="product__unavailable-text">
				Preencha os dados e clique no botão abaixo para ser avisado quando houver disponibilidade.
			</p>

			<form class="form" id="form-notifyme" action="/no-cache/AviseMe.aspx">
				<input type="hidden" name="notifymeIdSku" value="${
					product.skus[skuIndex].sku
				}"/>
				<div class="form-control">
					<input class="input" type="text" placeholder="Insira seu nome" name="notifymeClientName" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Insira seu nome...'" />
				</div>
				<div class="form-control">
					<input class="input" type="email" placeholder="Insira seu e-mail" name="notifymeClientEmail" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Insira seu nome...'" />
				</div>
				<button class="btn btn--primary btn--notify-me">Avise-Me</button>
			</form>
		</div>`;

		$(".product__action").hide();

		$(".product__skus").html(html);
	}

	gallery(images) {
		//alert('teste');
		const productGalleryWrapper = document.querySelector(
			".product__main .product__media .product__media-top"
		);
		productGalleryWrapper.innerHTML = this.loading;
		$(".product__zoom .product__zoom-thumbs").empty();
		$(".product__zoom .product__zoom-image").empty();
		images.map(image => {
			$(".product__zoom .product__zoom-thumbs").append(
				`<a href=""><img src="${image.imageUrl}" /></a>`
			);
		});

		$(".product__zoom .product__zoom-image").html(
			`<img src="${images[0].imageUrl}" />`
		);

		const productGallery = `<div class="product__gallery">
									<div class="product__gallery-thumbs">
										<ul class="product__thumbs">
										${images
											.map(image => {
												const thumb = `
												<li class="product__thumbs-item">
													<img class="product__thumbs-image" src="${
														image.imageUrl
													}"  width="500" height="500" alt="" />
												</li>
											`;
												return thumb;
											})
											.join("")}

										</ul>
									</div>
									<div class="product__gallery-image">
										<img class="product__image" src="${
											images[0].imageUrl
										}" width="500" height="500" alt="" />
									</div>
								</div>`;
		console.log(images);

		productGalleryWrapper.innerHTML = productGallery;

		$(window).trigger("productGalleryLoaded");

		setTimeout(function() {
			$(".product__main .product__media").removeClass("is-loading");
		}, 1500);
	}

	notifyMe(e) {
		e.preventDefault();
		console.log(this);
	}

	getTotalProducts() {
		if (isNil(this.cart) || isEmpty(this.cart)) {
			console.log(this.cart, "--");
			const noProducts = `Nenhum produto selecionado`;
			$(".total-products strong").html(noProducts);
		} else {
			console.log(this.cart, "----");
			const total = this.cart.reduce(
				(prev, item) => prev + item.quantity,
				0
			);
			const totalText = `${total} produtos selecionados`;
			$(".total-products strong").html(totalText);
		}
	}
}

$(document).ready(() => {
	if ($("body").hasClass("product")) {
		//$('body').addClass('user-logged');
		window.productChoice = {};
		window.Product = new Product();

		if ($(".productDescription").is(":empty")) {
			$(".product__description").hide();
		}

		if ($(".productReference")[0]) {
			const code = $(".productReference")
				.text()
				.split("_");
			$(".productReference").text(code[0]);
		}

		$(".product__zoom").on("click", "a", function(e) {
			e.preventDefault();
			const img = $("img", this)
				.attr("src")
				.replace("500-500", "1000-1000");
			$(".product__zoom .product__zoom-image img").attr("src", img);
		});

		const shelf__prev = `<button type='button' class='slick-prev shelf__button'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43"><defs><path id="vcuya" d="M1460 1326.21l21.21-21.21 21.21 21.21-21.21 21.21z"/><path id="vcuyc" d="M1481.5 1318.5l-7.52 7.52"/><path id="vcuyd" d="M1481.5 1333.02l-7.52-7.52"/><clipPath id="vcuyb"><use fill="#fff" xlink:href="#vcuya"/></clipPath></defs><g><g transform="matrix(-1 0 0 1 1503 -1305)"><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-miterlimit="50" stroke-width="4" clip-path="url(&quot;#vcuyb&quot;)" xlink:href="#vcuya"/></g><g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyc"/></g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyd"/></g></g></g></g></svg></button>`;
		const shelf__next = `<button type='button' class='slick-next shelf__button'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43" height="43" viewBox="0 0 43 43"><defs><path id="vcuya" d="M1460 1326.21l21.21-21.21 21.21 21.21-21.21 21.21z"/><path id="vcuyc" d="M1481.5 1318.5l-7.52 7.52"/><path id="vcuyd" d="M1481.5 1333.02l-7.52-7.52"/><clipPath id="vcuyb"><use fill="#fff" xlink:href="#vcuya"/></clipPath></defs><g><g transform="matrix(-1 0 0 1 1503 -1305)"><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-miterlimit="50" stroke-width="4" clip-path="url(&quot;#vcuyb&quot;)" xlink:href="#vcuya"/></g><g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyc"/></g><g><use fill="#fff" fill-opacity="0" stroke="#000" stroke-linecap="square" stroke-miterlimit="50" stroke-width="2" xlink:href="#vcuyd"/></g></g></g></g></svg></button>`;

		$("ul.thumbs").slick({
			arrows: true,
			slidesToShow: 6,
			slidesToScroll: 1,
			vertical: true,
			infinite: true,
			prevArrow: shelf__prev,
			nextArrow: shelf__next,
			responsive: [
				{
					breakpoint: 800,
					settings: "unslick"
				}
			]
		});

		$(window).on("productGalleryLoaded", () => {
			if (isMobile.any()) {
				$(".product__thumbs").slick({
					arrows: false,
					dots: true
				});
			} else {
				$(".product__thumbs").slick({
					arrows: true,
					slidesToShow: 6,
					slidesToScroll: 1,
					vertical: true,
					infinite: true,
					prevArrow: shelf__prev,
					nextArrow: shelf__next,
					responsive: [
						{
							breakpoint: 800,
							settings: "unslick"
						}
					]
				});
			}
		});

		if (
			$(".shelf__carousel--full ul li:not(.helperComplement)").length >= 2
		) {
			$(".shelf__carousel--full ul").slick({
				arrows: true,
				slidesToShow: 2,
				slidesToScroll: 1,
				infinite: true,
				prevArrow: shelf__prev,
				nextArrow: shelf__next,
				responsive: [
					{
						breakpoint: 800,
						settings: "unslick"
					}
				]
			});
		}

		if (isMobile.any()) {
			$(".thumbs").slick({
				arrows: false,
				dots: true
			});
		}

		const positionFixed = () => {
			const footerPosition = $(".section__newsletter").offset().top;
			const pageScroll =
				window.pageYOffset || document.documentElement.scrollTop;
			var y = $(window).scrollTop();
		};

		if (!isMobile.any()) {
			//positionFixed();

			$(window).scroll(() => {
				//positionFixed();
			});
		}

		let reference = $(".productReference").text();
		let newReference = reference.split(",")[0];
		console.log(newReference);
		$(".productReference").text(newReference);

		const isEmptyField = (fields, form) => {
			let empty = false;
			fields.map(field => {
				if (isEmpty(field)) {
					form.find(`[name=${field}]`).addClass("is-error");
					empty = true;
				}
			});

			return empty;
		};

		$(".product__main").on("submit", "#form-notifyme", function(e) {
			e.preventDefault();

			let formData = new FormData();
			let isValid = true;
			const form = $(this);
			var fields = {};
			var url = form.attr("action");
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
			).each(function(i) {
				var name = $(this).attr("name") || $(this).attr("id");
				const value = $(this).val();
				if (name) {
					if (!isEmpty(value)) {
						fields[name] = value;
						formData.append(name, value);
					} else {
						isValid = false;
						$(this).addClass("is-error");
					}
				}
			});

			if (isValid) {
				$.ajax({
					async: true,
					crossDomain: true,
					url: "/no-cache/AviseMe.aspx",
					type: "POST",
					headers: {
						"cache-control": "no-cache",
						"postman-token": "16fcbdcc-c70e-19fe-ac77-6e898810471e"
					},
					processData: false,
					contentType: false,
					mimeType: "multipart/form-data",
					data: formData
				})
					.done(function() {
						const success_msg = `<span class="success-msg">Cadastrado com sucesso, assim que o produto for disponibilizado você receberá um email avisando.</span>`;

						$(success_msg).insertBefore(
							".product__main #form-notifyme"
						);
					})
					.fail(function(jqXHR, textStatus) {
						const success_msg = `<span class="success-msg">Cadastrado com sucesso, assim que o produto for disponibilizado você receberá um email avisando.</span>`;

						$(success_msg).insertBefore(
							".product__main #form-notifyme"
						);
						/*var msg = JSON.parse(jqXHR.responseText);
						console.log('define notification:', 'error', msg);*/
					});
			}
		});

		$(".product__main").on(
			"click",
			".product__unavailable .btn--close",
			function() {
				const productId = $("#___rc-p-id").val();

				window.Product.changeProduct(productId);
				$(".product__action").show();
			}
		);
	}
});
