import { getSearchProductByUrl } from "../modules/vtexRequest";

class Minicart {
	constructor() {
		$(window).on('orderFormUpdated.vtex', (evt, orderForm) => {
			this.update(orderForm);
		});
		vtexjs.checkout.getOrderForm();

		$('.js-minicart').on('click', '.minicart-product__details a', function(e){
			e.preventDefault();
			$(this).parent().toggleClass('is-active');
		});
	}

	async getColor(productUrl, id){
		const productJson = await getSearchProductByUrl(productUrl);

		if(productJson[0].hasOwnProperty("ListaCores")){
			const color = `<span>Cor: ${productJson[0].ListaCores[0]}</span>`;
			$(`.minicart-product-${id} .minicart-product__details-info`).prepend(color);
	
			
		}
	}
	renderItem(item, i) {
		let { quantity } = item;
		this.getColor(item.detailUrl, item.id);
		return `
		 <li class="minicart-product minicart-product-${item.id}" data-item-id="${item.id}">
		 	<div class="minicart-product__wrapper">
				<div class="minicart-product__image"><img src="${item.imageUrl}"></div>
				<div class="minicart-product__wrapper-flex">
					<div class="minicart-product__info">
						<h4 class="minicart-product__name">${item.name}</h4>
						<strong class="minicart-product__price">R$${(item.price / 100).formatMoney()}</strong>
					</div>
					<div class="minicart-product__details">
						<a href="">
							Ver Detalhes
							<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10" height="16" viewBox="0 0 10 16"><defs><path id="ic9la" d="M1557.914 33.18l1.536 1.544a.59.59 0 0 1 0 .838l-4.942 4.943 4.942 4.942a.59.59 0 0 1 0 .838l-1.536 1.545a.601.601 0 0 1-.847 0l-6.897-6.907a.59.59 0 0 1 0-.837l6.897-6.907a.601.601 0 0 1 .847 0z"></path></defs><g><g transform="translate(-1550 -33)"><use fill="#e75300" xlink:href="#ic9la"></use></g></g></svg>
						</a>
						<div class="minicart-product__details-info">
							
							${item.skuName ? `<span>Tamanho: ${item.skuName}</span>` : ''}
							${item.quantity ? `<span>Quantidade: ${item.quantity}</span>` : ''}
						</div>
					</div>
					<button class="minicart-product__remove" type="button" onclick="Minicart.removeItem.apply(null, [${i}])" title="Remover ${item.name} do carrinho"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10" height="10" viewBox="0 0 10 10"><defs><path id="dmqka" d="M1685 451.047c0 .21-.084.421-.236.573l-1.144 1.144a.816.816 0 0 1-1.145 0L1680 450.29l-2.475 2.474a.816.816 0 0 1-1.145 0l-1.144-1.144a.816.816 0 0 1 0-1.145l2.474-2.475-2.474-2.475a.816.816 0 0 1 0-1.145l1.144-1.144a.816.816 0 0 1 1.145 0l2.475 2.474 2.475-2.474a.816.816 0 0 1 1.145 0l1.144 1.144a.816.816 0 0 1 0 1.145L1682.29 448l2.474 2.475a.816.816 0 0 1 .236.572z"/></defs><g><g transform="translate(-1675 -443)"><use fill="#e75300" xlink:href="#dmqka"/></g></g></svg> Remover</button>
				</div>
			</div>
         </li>
       `;
	}

	renderItems() {
		return this.orderForm.items.map(this.renderItem, this).join('');
	}

	render() {
		let qty = this.getQuantity();
		return `
         <div class="minicart ${qty > 0 ? 'is-not-empty' : ''}">
            <button class="minicart__handle" title="sacola">
				<span class="minicart__count">
					<i class="icon-cart--black">
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="17" height="18" viewBox="0 0 17 18"><defs><path id="nh8la" d="M1467.35 42c.455 0 .85.167 1.185.5.335.333.502.727.502 1.18 0 .453-.167.84-.502 1.16-.335.32-.73.48-1.185.48a1.59 1.59 0 0 1-1.165-.48 1.577 1.577 0 0 1-.481-1.16c0-.453.16-.847.481-1.18.322-.333.71-.5 1.165-.5zm-5.01-13.32h2.743l.78 1.64h12.354c.226 0 .42.083.58.25.16.167.24.37.24.61 0 .147-.04.273-.12.38l-2.963 5.4c-.147.253-.35.46-.61.62-.26.16-.544.24-.851.24h-6.207l-.74 1.36-.04.12c0 .053.02.1.06.14.04.04.086.06.14.06h9.65v1.68h-10.01c-.455 0-.842-.167-1.162-.5a1.647 1.647 0 0 1-.48-1.18c0-.253.066-.513.2-.78l1.12-2.08-3.002-6.32h-1.682zM1475.719 42c.455 0 .843.167 1.165.5.321.333.482.727.482 1.18 0 .453-.161.84-.482 1.16-.322.32-.71.48-1.165.48-.455 0-.85-.16-1.185-.48a1.546 1.546 0 0 1-.502-1.16c0-.453.168-.847.502-1.18.335-.333.73-.5 1.185-.5z"/></defs><g><g transform="translate(-1462 -28)"><use fill="#bab1a8" xlink:href="#nh8la"/></g></g></svg>
					</i>
                    <span class="minicart__count-value">${this.printQuantity(qty)}</span>
				</span>
            </button>
            <div class="minicart__overlay"></div>
			<div class="minicart__container">
				<div class="minicart__header--fixed">
					<div class="minicart__header">
						<button class="minicart__handle" title="sacola">
							<i class="minicart__icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10" height="16" viewBox="0 0 10 16"><defs><path id="ic9la" d="M1557.914 33.18l1.536 1.544a.59.59 0 0 1 0 .838l-4.942 4.943 4.942 4.942a.59.59 0 0 1 0 .838l-1.536 1.545a.601.601 0 0 1-.847 0l-6.897-6.907a.59.59 0 0 1 0-.837l6.897-6.907a.601.601 0 0 1 .847 0z"/></defs><g><g transform="translate(-1550 -33)"><use fill="#e75300" xlink:href="#ic9la"/></g></g></svg></i>
							<span class="minicart__title">Continuar Comprando</span>
						</button>
					</div>
					<div class="minicart__review">
						<div class="minicart__review-header">
							<span class="minicart__item-counter">MEU CARRINHO</span>
							<span class="minicart__item-qty"> ${this.printQuantity(qty)} ITEM(S)</span>
						</div>
						<div class="minicart__dsp-total">
							<span class="minicart__dsp-txt">Subtotal do Carrinho:</span>
							<span class="minicart__dsp-number">${this.getTotal()}</span>
						</div>
					</div>
				</div>
				<a class="minicart__checkout btn-cart-checkout" href="/Site/Carrinho.aspx">IR PARA O CARRINHO</a>
				<div class="minicart__content--scroll">
					<div class="minicart__content">
						<ul class="minicart__products">
							${this.renderItems()}
						</ul>
					</div>
					<div class="minicart__footer">
						<a class="minicart__checkout" href="/Site/Carrinho.aspx">IR PARA O CARRINHO</a>
					</div>
				</div>
            </div>
         </div>
       `;
	}

	removeItem(index) {
		vtexjs.checkout.removeItems([
			{
				index
			}
		]);
		
	}

	updateItem(obj) {
		let { index, qty, calc } = obj;
		let quantity = qty + +calc;
		if (quantity) {
			vtexjs.checkout.updateItems(
				[
					{
						index,
						quantity
					}
				],
				null,
				false
			);
		}
	}

	updateCart(){
		alert('teste')
		const itens = this.orderForm.items.map(this.renderItem, this).join('');
		const total = this.getTotal()

		if(items == 0) {
			$('.minicart').removeClass('is-not-empty');
		}

		$('.minicart__products').html(itens);
		$('.minicart__dsp-number').html(total);
	}

	getTotal() {
		const itemsTotal = this.orderForm.totalizers.find(item => item.id === 'Items');
		const total = itemsTotal ? itemsTotal.value / 100 : 0;
		return `R$${total.formatMoney()}`;
	}

	getQuantity() {
		const qty = this.orderForm.items.reduce((prev, next) => prev + next.quantity, 0);
		return qty;
	}

	printQuantity(qty) {
		return `${qty}`;
	}

	update(orderForm) {
		this.orderForm = orderForm;
		if(!$('.minicart')[0]){
			this.mount();
		}else {
			this.updateCart();
		}

	}

	mount() {
		$('.js-minicart').html(this.render());
	}
}

$(document).ready(function() {
	window.Minicart = new Minicart();

	$('body').on('click', '.minicart__handle', function() {
		if($('.minicart').hasClass('active')) {
			$('.minicart').removeClass('active');
			$('body').removeClass('is-fixed');
		} else {
			$('.minicart').addClass('active');
			$('body').addClass('is-fixed');
		}
	});
});
