export let isLocalhost = ~window.location.host.indexOf('localhost') ? true : false;
export const vtexSearchPageEndpoint = (query, shelfId, ps) => `/buscapagina?&ft=${query}&PS=${ps}&sl=${shelfId}&cc=50&sm=0&PageNumber=1`;
export const vtexcategoryTreeEndpoint = (level) => `/api/catalog_system/pub/category/tree/${level}`;
export const vtexSeachProductByCategoryEndpoint = (categoryId) => `/api/catalog_system/pub/products/search/?fq=C:${categoryId}`;

export const addToCart = function (id, quantity = 1, seller = '1', redirect = false) {
	let item = {
		id,
		quantity,
		seller
	}
	console.log(item)
	vtexjs.checkout.addToCart([item], null, 1)
		.done(orderForm => {
			console.log(orderForm);
			$('.btn--buy').removeClass('running');
		})
}



export const slugify = (string) => {
	const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
	const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
	const p = new RegExp(a.split('').join('|'), 'g')
	return string.toString().toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with
		.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
		.replace(/&/g, '-and-') // Replace & with ‘and’
		.replace(/[^\w\-]+/g, '') // Remove all non-word characters
		.replace(/\-\-+/g, '-') // Replace multiple — with single -
		.replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text
}

export const myLoad = (url, sourceContainer, targetContainer, replace) => {
	var xhr = new XMLHttpRequest();
	xhr.onerror = function () {
		throw "Request failed. HTTP code " + xhr.status;
	};
	xhr.onload = function () {
		if (!xhr.status || (xhr.status >= 400)) {
			throw "Request failed. HTTP code " + xhr.status;
		}
		var temp = document.createElement("DIV");
		temp.innerHTML = xhr.responseText;
		var ele = temp.querySelector(sourceContainer);
		if (ele) {
			if (replace) {
				targetContainer.innerHTML = ele.outerHTML;
			} else {
				targetContainer.appendChild(ele);
			}
		}
	};
	xhr.open("GET", url, true);
	xhr.send();
}

export const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};


export const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export const changeQuantity = (element, value) => {
    const currentValue = element.val();
    let newValue = +currentValue + value;
    if(newValue) {
        element.val(newValue);
    }
    
}
