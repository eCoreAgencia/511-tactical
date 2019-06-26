

$(document).ready( function(){

	var user = JSON.parse(sessionStorage.getItem('user'));

	console.log(user);

	$('body').on('click', '.minicart__clearAll', function() {
		vtexjs.checkout.removeAllItems()
		.done(function(orderForm) {
			console.log(orderForm);
		});
	})

	if(user != undefined || user != null){

		vtexjs.checkout.getOrderForm().done(orderForm => {

			if (orderForm.items.length != 0) {
				var buttonRemove = $('.minicart__clearAll')[0]
				!buttonRemove ? $(`
				<a class="minicart__clearAll" href="#"
					style="
						padding: 5px 10px;
						border: 1px solid red;
						color: red;
						text-decoration: underline;
						display: block;
						margin: 0 auto;
						max-width: 130px;
						text-align: center;
						cursor: pointer;
			">LIMPAR CARRINHO</a>`).insertAfter('div#cartLoadedDiv .cart') : '';
			} else {
				buttonRemove ? buttonRemove.remove() : '';
			}

			console.log(orderForm)

			var customerClass = {
				"value": user.customerClass
			}

			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "/api/checkout/pub/orderForm/"+orderForm.orderFormId+"/customData/tipo-de-pedido/classificacao-cliente",
				"type": "PUT",
				"headers": {
					"Content-Type": "application/json",
					"cache-control": "no-cache",
					"Postman-Token": "eee917b0-2ada-4837-80d9-c4bd4114cf15"
				},
				"processData": false,
				"data": JSON.stringify(customerClass),
			}

			$.ajax(settings).done(function (response) {
				console.log(response);
			});


		})


		$('body').on('ajaxStop', function(){

			$('#is-corporate-client').trigger('click');
			$("#client-company-document").trigger('focus');
			$("#client-company-document").val(user.corporateDocument);
			$("#client-company-document").trigger('keydown');
			$("#client-company-document").trigger('blur');
			$("#client-company-document").attr('disabled','disabled');

			$("#client-company-name").trigger('focus');
			$("#client-company-name").val(user.corporateName);
			$("#client-company-name").trigger('keydown');
			$("#client-company-name").trigger('blur');
			$("#client-company-name").attr('disabled','disabled');

			$("#client-company-nickname").trigger('focus');
			$("#client-company-nickname").val(user.tradeName);
			$("#client-company-nickname").trigger('keydown');
			$("#client-company-nickname").trigger('blur');
			$("#client-company-nickname").attr('disabled','disabled');

			if(user.stateRegistration == "isento"){

				$('#state-inscription').attr("checked");

			}else {

				$("#client-company-ie").trigger('focus');
				$("#client-company-ie").val(user.stateRegistration);
				$("#client-company-ie").trigger('keydown');
				$("#client-company-ie").trigger('blur');
				$("#client-company-ie").prop("disabled", true );
			}


			setTimeout(function(){
				$("#client-company-nickname").prop("disabled", true );
				$("#client-company-document").prop("disabled", true );
				$("#client-company-name").prop("disabled", true );

			},1300)

		})

	} else {

		$('#is-corporate-client').trigger('click');
		$("#client-company-document").trigger('focus');
		$("#client-company-document").trigger('keydown');
		$("#client-company-document").trigger('blur');

		$("#client-company-name").trigger('focus');
		$("#client-company-name").trigger('keydown');
		$("#client-company-name").trigger('blur');

		$("#client-company-nickname").trigger('focus');
		$("#client-company-nickname").trigger('keydown');
		$("#client-company-nickname").trigger('blur');
	}
});
