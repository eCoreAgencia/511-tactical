import {
	isLocalhost
} from '../utils';

export const getProductSimilarById = (productId) => {

	getProductSimilarById.cache = getProductSimilarById.cache || {}
	const endpoint = `/api/catalog_system/pub/products/crossselling/similars/${productId}`;

	if (isLocalhost) getProductSimilarById.cache[productId] = window.similars;

	return new Promise((resolve, reject) => {
		let res = getProductSimilarById.cache[productId]
		if (res) return resolve(res)
		else {
			return fetch(endpoint)
				.then(data => {
					getProductSimilarById.cache[productId] = data.json()
					return resolve(getProductSimilarById.cache[productId])
				})
				.catch(err => reject(err))
		}
		return reject("Couldn't get product.")
	})


}

export const getProductWithVariations = (productId) => {

	getProductWithVariations.cache = getProductWithVariations.cache || {}
	const endpoint = `/api/catalog_system/pub/products/variations/${productId}`;


	return new Promise((resolve, reject) => {
		let res = getProductWithVariations.cache[productId]
		if (isLocalhost) return resolve(window.product)
		if (res) return resolve(res)
		else {
			return fetch(endpoint)
				.then(data => {
					getProductWithVariations.cache[productId] = data.json()
					return resolve(getProductWithVariations.cache[productId])
				})
				.catch(err => reject(err))
		}
		return reject("Couldn't get product.")
	})


}


export const getSearchProducts = (term) => {
	const endpoint = `/api/catalog_system/pub/products/search${term}`;


	return new Promise((resolve, reject) => {
		//let res = getSearchProducts.cache[productId]
		if (isLocalhost) return resolve(window.products)
		else {
			return fetch(endpoint)
					.then(data => {
						const searchResult = data.json()
						return resolve(searchResult)
					})
					.catch(err => reject(err))
		}
	})
}


export const getSearchProductById = (productId) => {

	getSearchProductById.cache = getSearchProductById.cache || {}
	const endpoint = `/api/catalog_system/pub/products/search?fq=productId=${productId}`;


	return new Promise((resolve, reject) => {
		let res = getSearchProductById.cache[productId]
		if (isLocalhost) return resolve(window.similars)
		if (res) return resolve(res)
		else {
			return fetch(endpoint)
				.then(data => {
					getSearchProductById.cache[productId] = data.json()
					return resolve(getSearchProductById.cache[productId])
				})
				.catch(err => reject(err))
		}
		return reject("Couldn't get product.")
	})


}

export const getSearchProductByUrl = (productUrl) => {

	const endpoint = `/api/catalog_system/pub/products/search/${productUrl}`;


	return new Promise((resolve, reject) => {
		if (isLocalhost) return resolve(window.similars)
		else {
			return fetch(endpoint)
				.then(data => {
					return resolve(data.json())
				})
				.catch(err => reject(err))
		}
		return reject("Couldn't get product.")
	})


}
export const postInMasterData = (entity, data) => {
	const endpoint = `//api.vtexcrm.com.br/casaegaragem/dataentities/${entity}/documents`;


	return new Promise((resolve, reject) => {
		return fetch(endpoint, {
				method: 'post',
				body: JSON.stringify(data)
			})
			.then(data => {
				const result = data.json()
				return resolve(result)
			})
			.catch(err => reject(err))
	})

}

export const getInMasterData = (entity, where, fields) => {
	const endpoint = `//api.vtexcrm.com.br/tacticalb2b/dataentities/${entity}/search?_where=${where}&_fields=${fields}`;


	return new Promise((resolve, reject) => {
		return fetch(endpoint)
			.then(data => {
				const result = data.json()
				return resolve(result)
			})
			.catch(err => reject(err))
	})

}


export const getInventoryLogistics = (sku) => {
	const endpoint = `https://tacticalb2b-fullcore.herokuapp.com/estoque.php?skuId=${sku}`;


	return new Promise((resolve, reject) => {
		return fetch(endpoint)
			.then(data => {
				const result = data.json()
				return resolve(result)
			})
			.catch(err => reject(err))
	})

}
