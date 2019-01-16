import {
  addToCart
} from '../utils';

import Price from '../modules/price';

import vtexRequest from '../modules/vtexRequest';


export const productShelf = (product, list = false) => {

  const {
    productId,
    name,
    link,
    skus,
    image,
    categories
  } = product
  const price = new Price(skus[0]);
  const getUrlImage = (item) => item.images[0].imageUrl;
  const getUrlImageTag = (image, width, height) => {
   image = image.replace('#width#', width)
   image = image.replace('#height#', height)
   image = image.replace('~', 'http://tactical.vteximg.com.br')
   image = image.replace('-undefined', '')

    return image;
  };


  let product_shelf = `
    <div class="product product--shelf" data-product-id="${productId}">
      <div class="product__header">
        <div class="product__media">
          <a class="product__link" href="${link}" tabindex="-1">
                ${getUrlImageTag(image, 279, 365)}
          </a>
        </div>
        <div class="product__actions">
          <a class="button product__link" title="Nome do produto" href="${link}" tabindex="-1">Ver Produto</a><a class="button button--primary product__buy" href="${link}" data-product-id="225047" tabindex="-1">Compre Rápido</a></div>
      </div>
	    <div class="product__reviews"></div>
      <div class="product__info">
        <h3 class="product__name"><a class="product__link" title="${name}" href="${link}" tabindex="-1"> ${name} </a></h3>
        <div class="product__price">
          ${price.mont(skus[0])}
        </div>
      </div>
      ${ categories ? `<div class="product__category"><a class="button" href="/category.html" tabindex="-1">+ Iluminação</a></div>` : ''}

    </div>`;

  if (list) product_shelf = `<li>${product_shelf}</li>`
  return product_shelf;
}

$(document).ready(function () {
  $('.product--shelf .product__buy').on('click', function (e) {
    e.preventDefault();
    const productID = $(this).data('product-id');
    addToCart(productID);
  })


  $('.product--shelf').each(function() {
	  if($('.price__list', this)) $('.price__list', this).html($('.price__list', this).html().replace('R$ ', 'R$'))
  })

});
