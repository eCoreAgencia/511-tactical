
const R = require('ramda');

(function($) {
	/**
	 * FormulÃ¡rio de busca nos moldes do Rex
	 * @method searchform
	 * @param {Object} options OpÃ§Ãµes do plugin
	 */
	$.fn.searchform = function(options) {
		let self = $.fn.searchform;
		let el = this;
		let defaults = {
			vtexStore: 'tactical',
			autocomplete: true,
			showDepartments: true,
			thumbWidth: 80,
			thumbHeight: 80,
			charactersToStartAjax: 3,
			imagesOnly: false,
			maxResults: 4,
			showBrands: true,
			showHint: false,
			excludeKeys: [
				9,
				13,
				16,
				17,
				18,
				19,
				20,
				27,
				33,
				34,
				35,
				36,
				37,
				38,
				39,
				40,
				45,
				91,
				92,
				93,
				112,
				113,
				114,
				115,
				116,
				117,
				118,
				119,
				120,
				121,
				122,
				123,
				144,
				145,
				224
			]
		};
		let settings = $.extend({}, defaults, options);
		if (!settings.vtexStore) throw Error("[searchform] Prop vtexStore can't be empty.");
		let {
			vtexStore,
			autocomplete,
			showDepartments,
			thumbWidth,
			thumbHeight,
			charactersToStartAjax,
			imagesOnly,
			maxResults,
			showBrands,
			excludeKeys
		} = settings;
		let isLocalhost =
			window.location.hostname === 'localhost' || ~window.location.hostname.indexOf('192.168')
				? true
				: false;
		let urlPrefix = isLocalhost ? `//${vtexStore}.vtexcommercestable.com.br` : '';
		let input = el.find('.input');
		let select = el.find('.select');
		let list = $('.search-form__result');
		let brandsList = el.find('.searchform-brands');
		let hintEl = el.find('.searchform-hint');


		self.searchformMountResultList = function(items, query) {
			list.html('');
			list.append(
				`<div class="button-resultados">
					<a class="search-form__link" href="${query}">Ver todos os resultados</a>
					<div class="ld ld-ring ld-spin"></div>
				</div>`
			);

			if (!items) return;

			items.forEach(item => {
				let { link, productName, items, productId } = item;
				let imgId = items[0].images[0].imageId;
				let thumb = `http://${vtexStore}.vteximg.com.br/arquivos/ids/${imgId}-${thumbWidth}-${thumbHeight}`;

				//   console.log(productId)
				vtexjs.catalog.getProductWithVariations(productId).done(function(data) {
					console.log(data);
					let estoque = '';
					let html = '';
					if (data.available) {

						const skuI = R.findIndex(R.propEq('available', true))(data.skus);
						console.log(data.skus[skuI]);
						let bestPriceFormated = data.skus[skuI].bestPriceFormated;
						let listPriceFormated = data.skus[skuI].listPriceFormated;
						let stock = data.skus[skuI].availablequantity;
						let listPrice = data.skus[skuI].listPrice;

						let parcelas = data.skus[skuI].installments;
						let valorParcela = data.skus[skuI].installmentsValue;
						if (valorParcela !== 0) {
							var num = valorParcela / 100;
							valorParcela = parseFloat(num)
								.toFixed(2)
								.replace('.', ',');
						}

						if (listPrice == 0) {
							html = `
							  <div class="product--shelf">
								<div class="product__header">
									<div class="product__media">
										<a class="product__link" href="${link}" title="${productName}">
											<img src="${thumb}" alt="${productName}"/>
										</a>
									</div>
								</div>
								<div class="product__info">
									<h3 class="product__name">
										<a class="product__link" href="${link}" title="${productName}">${productName}</a>
									</h3>
									<div class="product__price">
										<div class="price">
											<span class="price__list">${bestPriceFormated}</span>
											<span class="price__instament">${parcelas !== 0 ? parcelas : ''}x R$ ${
								valorParcela !== 0 ? valorParcela : ''
							} sem juros.</span>
										</div>
									</div>
								</div>
							</div>`;
						} else {
							html = `
							<div class="product--shelf">
							  <div class="product__header">
								  <div class="product__media">
									  <a class="product__link" href="${link}" title="${productName}">
										  <img src="${thumb}" alt="${productName}"/>
									  </a>
								  </div>
							  </div>
							  <div class="product__info">
								  <h3 class="product__name">
									  <a class="product__link" href="${link}" title="${productName}">${productName}</a>
								  </h3>
								  <div class="product__price">
									  <div class="price">
										  <span class="price__list">${listPriceFormated}</span>
										  <span class="price__instament">${
												parcelas !== 0 ? parcelas : ''
											}x R$ ${
								valorParcela !== 0 ? valorParcela : ''
							} sem juros.</span>
									  </div>
								  </div>
							  </div>
						  </div>`;
						}

					} else {
						estoque = "<p style='color: red;'>Sem estoque</p>";
						html = `
							<div class="product--shelf">
							  <div class="product__header">
								  <div class="product__media">
									  <a class="product__link" href="${link}" title="${productName}">
										  <img src="${thumb}" alt="${productName}"/>
									  </a>
								  </div>
							  </div>
							  <div class="product__info">
								  <h3 class="product__name">
									  <a class="product__link" href="${link}" title="${productName}">${productName}</a>
								  </h3>
								 	${estoque}
							  </div>
						  </div>`;
					}




					list.prepend(html);
					$('.searchform-list').css('top', $('.pageHeader').height());
				});
			});
		};

		self.searchformSelecHint = function() {
			let hint = hintEl.text();
			let query = input.val();

			if (hint.length > query.length) {
				input.val(hint).trigger('input');
			}
		};

		self.searchformMountHint = function(items, query) {
			hintEl.html('');

			if (items && items.length) {
				let queryLen = query.split(' ').length;
				let pName = items[0].productName.toLowerCase();

				if (pName.startsWith(query.toLowerCase())) {
					let queryJ = pName
						.split(' ')
						.slice(0, queryLen)
						.join(' ');

					hintEl.html(query + queryJ.slice(query.length, queryJ.length));
				}
			}
		};

		self.searchformMountBrandsList = function(brands, query) {
			brandsList.html('');

			if (!brands) return;

			if (brands.length) {
				brands.push('VER TODAS');
			}

			let tpl = '';

			brands.forEach(brand => {
				console.log(brand)

				let url = `/${query}`

			  //   if (brand == 'VER TODAS') {
			  //       url = `/busca/${query}`
			  //   }
				if (brand == 'VER TODAS') {
					url = `/${query}`;
				}

				tpl += `
			<a class="searchform-brands-item" href="${url}" title="${brand}">
			  <span>ver mais produtos</span>
			</a>
		  `;
			});

			$('.searchform-list').append(tpl);
		};

		self.searchformMountDepartmentList = function(departments) {
			departments.forEach(function(department) {
				let { name } = department;
				select.append(`<option value="${name}">${name}</option>`);
			});
		};

		self.searchformReset = function(e) {
			input.val('').trigger('input');
		};

		self.searchformDoSearch = function(e) {
			let search = input
				.val()
				.replace(/\./g, '')
				.replace(/(^[\s]+|[\s]+$)/g, '');

			if (search.length >= settings.charactersToStartAjax) {
				clearTimeout(self.timeOut);
				self.timeOut = setTimeout(() => {
					if (search === input.val()) {
						self.searchformRequestApiData(search);
					}
				}, 500);
			} else {
				if (search.length < settings.charactersToStartAjax) {
					list.removeClass('is-fetching').hide();
					self.searchformMountResultList(null);
					if (settings.showBrands) {
						brandsList.removeClass('is-fetching').hide();
						self.searchformMountBrandsList(null);
					}
					if (settings.showHint) {
						self.searchformMountHint(null);
					}
				}
			}

			return false;
		};

		self.searchformRequestApiData = function(query) {
			if (self.xhrAutocomplete) self.xhrAutocomplete.abort();

			hintEl.html('');

			if (settings.showBrands) {
				brandsList.addClass('is-fetching').show();
			}

			list.addClass('is-fetching').show();

			self.xhrAutocomplete = $.ajax({
				type: 'GET',
				url:
					urlPrefix +
					'/api/catalog_system/pub/products/search/' +
					decodeURIComponent(query) +
					'?O=OrderByTopSaleDESC',
				error(err) {
					console.error(err);
					list.removeClass('is-fetching').hide();
					if (settings.showBrands) {
						brandsList.addClass('is-fetching').hide();
					}
					self.itemsReturned = null;
				},
				success(data) {
					let items = data;

					let brands = [];

					list.removeClass('is-fetching');
					let theLink = $('.button-resultados').find('.ld-ring');
					theLink.remove();

					if (settings.showBrands) {
						brandsList.removeClass('is-fetching');

						data.forEach(item => {
							if (brands.indexOf(item.brand) == -1) {
								brands.push(item.brand);
							}
						});
					}

					if (settings.maxResults) {
						items = items.slice(0, settings.maxResults);
					}

					self.searchformMountResultList(items, query);

					if (settings.showBrands) {
						self.searchformMountBrandsList(brands, query);
					}

					if (settings.showHint) {
						self.searchformMountHint(items, query);
					}
				}
			});
		};

		self.searchformGetDepartments = function() {
			$.ajax({
				url: `${urlPrefix}/api/catalog_system/pub/category/tree/0`,
				type: 'GET',
				headers: {
					'content-type': 'application/json'
				},
				error(err) {
					$('.searchform__select').hide();
				},
				success(data) {
					self.searchformMountDepartmentList(data);
				}
			});
		};

		this.on('submit', function(e) {
			e.preventDefault();
			let search = input
				.val()
				.replace(/\./g, '')
				.replace(/(^[\s]+|[\s]+$)/g, '');
			let department = select.val() ? '/' + select.val() : '';
			window.location = department + '/' + encodeURI(search);
		});

		if (settings.showDepartments) self.searchformGetDepartments();
		else select.remove();

		if (settings.autocomplete) {
			input.on('input', self.searchformDoSearch);

			$(document).keydown(function(e) {
				if (e.keyCode == 39) {
					self.searchformSelecHint();
					$('.searchform-list').css('top', $('.pageHeader').height());
				}
			});
		} else list.remove();
	};
})(jQuery);
