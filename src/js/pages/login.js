import { getInMasterData } from '../modules/vtexRequest';
import { isLocalhost } from '../utils';
const R = require('ramda');

$(document).ready(() => {


	const AddressJson = {};

	vtexjs.checkout.getOrderForm().done(async orderForm => {
		const isLogged = orderForm.loggedIn;
		if (isLogged) {
			let onMyAccount = sessionStorage.getItem('onMyAccount') || sessionStorage.setItem('onMyAccount', false);
			const userEmail = orderForm.clientProfileData.email;
			const userName = orderForm.clientProfileData.firstName;
			const query = `email=${userEmail}`
			const getUser = await getInMasterData('CL', query, "id,corporateDocument,approved,customerClass,corporateName,corporateEmail,businessPhone,tradeName,stateRegistration");
			const user = getUser[0];
			sessionStorage.setItem('user', JSON.stringify(user))
			console.log(user);
			const welcomeMessage = userName ? `Olá, ${userName}` : `Olá, ${userEmail}`
			if (welcomeMessage.length >= 15) $(".logged-status").text(`${welcomeMessage.substr(0, 14)}...`)
			else $(".logged-status").text(welcomeMessage)

			const linkLogout = `<li class="menu__item menu__item--highlight menu__item--logout"><a class="menu__link" href="/no-cache/user/logout">Sair</a></li>`

			$('.header__top .menu--institutional').append(linkLogout);


			if (R.isEmpty(user) || R.isNil(user)) {


				sessionStorage.setItem('userEmail', userEmail)
				sessionStorage.setItem('user', '')

			} else {

				sessionStorage.setItem('user', JSON.stringify(user));

				if(user.approved == true) {
					document.body.classList.add('user-logged');

					$('.logged-link').attr('href', '/account/orders')
					$('.logged-status').attr('href', '/account/')
				}


			}

		}
	});

	const ajaxValidCNPJSettings = (cnpj) => ({
		async: true,
		crossDomain: true,
		url: "https://tacticalb2b-fullcore.herokuapp.com/",
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify(cnpj)
	})

	if($('body').hasClass('minha-conta')){
		$(".contentForm #cnpj").mask("99.999.999/9999-99")
		$("#login-cnpj").mask("99.999.999/9999-99")
		$("#telefoneRespo").mask("(99) 9 9999-9999")
	}




	$(".buscarCnpj").on("click", function (e) {
		e.preventDefault();
		const resultCnpj = $("#searchCnpj .resultCnpj");
		const loadingImg = '<img src="https://casaeficiente2020.pt/Assets/Icons/loader.gif" style="position: absolute;top: 190px;background: #fff;width: 82%;padding: 0 170px;">'
		resultCnpj.append(loadingImg);
		resultCnpj.fadeIn();
		const cnpj = {
			CNPJ: $(".contentForm #cnpj").val()
		}



		$.ajax(ajaxValidCNPJSettings(cnpj))
			.done(function (response) {
				resultCnpj.find('img').remove();
				const {
					Status,
					Mensagem,
					NomeFantasia,
					RazaoSocial,
					Enderecos
				} = JSON.parse(response);

				if (Status) {
					const address = `${Enderecos[0].Logradouro}, ${Enderecos[0].Numero} ${Enderecos[0].Complemento}, ${Enderecos[0].Bairro} - ${Enderecos[0].Cidade} - ${Enderecos[0].Estado} - CEP ${Enderecos[0].CEP}`
					resultCnpj.find('.resultCnpj__inner').fadeIn();
					$('.btnCotent .nextLogin').fadeIn();
					$('.btnCotent .buscarCnpj').fadeOut();

					$('.nomeFantasia', resultCnpj).text(NomeFantasia)
					$('.razaoSocial', resultCnpj).text(RazaoSocial)
					$('.endereco', resultCnpj).text(address)

					$('#endComercial').val(address);

					AddressJson.city = Enderecos[0].Cidade
					AddressJson.complement = Enderecos[0].Complemento
					AddressJson.street = Enderecos[0].Logradouro
					AddressJson.state = Enderecos[0].Estado
					AddressJson.postalCode = Enderecos[0].CEP
					AddressJson.neighborhood = Enderecos[0].Bairro
					AddressJson.number = Enderecos[0].Numero


					sessionStorage.removeItem('onMyAccount');

				} else {

					resultCnpj.append(`<div class='not-regitered--red'><p>${Mensagem}</p></div>`)
					setTimeout(function () {
						$(".resultCnpj .not-regitered--red").remove()
					}, 3000);
				}

			})
			.fail(function (error) {
				console.log(error);
			})

	})

	$(".createaccount").on("click", function (t) {
		t.preventDefault(),
			$(this).parents(".modalLogin__box--item").css("display", "none"),
			$("#searchCnpj").fadeIn()
	})

	$(".nextLogin").on("click", function (e) {
		e.preventDefault(),
			$(this).parents(".modalLogin__box--item").css("display", "none"),
			$("#createcliente").fadeIn()
	})

	$(".modalLogin__close").on("click", function (t) {
		window.history.back()
		sessionStorage.setItem('onMyAccount', false)
	})

	$('#sendImageclick').on('change', function(){
		$('.sendImage__btn label').text($(this).prop("files")[0].name);
	})

	$(".backOption").on("click", function (e) {
		e.preventDefault()
		$(this).parents(".modalLogin__box--item").css("display", "none")
		$("#optionAcess").fadeIn()
	})

	$(".backCnpj").on("click", function (e) {
		e.preventDefault()
		$(this).parents(".modalLogin__box--item").css("display", "none")
		$("#searchCnpj").fadeIn()
	})

	$(".confirmcad").on("click", async function (e) {
		e.preventDefault();
		let cnpj = $(".contentForm #cnpj").val();
		var regex = /[^a-z0-9]/gi;
		cnpj = cnpj.replace(regex, "");
		const query = `corporateDocument=${cnpj}`
		const getUser = await getInMasterData('CL', query, "corporateDocument")
		const userCad = getUser[0];


		if (R.isEmpty(userCad) || R.isNil(userCad)) {
			let user = sessionStorage.getItem('user') || ''
			var t = cnpj,
				n = $(".resultCnpj .resultCnpj__info .nomeFantasia").text(),
				e = $(".resultCnpj .resultCnpj__info .razaoSocial").text(),
				r = $(".contentForm #incriEstadual").val(),
				i = $(".contentForm #endComercial").val(),
				o = $(".contentForm #segmento").val(),
				a = $(".contentForm #nameRespo").val(),
				c = $(".contentForm #emailRespo").val(),
				u = $(".contentForm #telefoneRespo").val(),
				s = $(".contentForm #senha1").val();

			"" == $(".contentForm #incriEstadual").val() && (r = "isento");
			var f = {
				corporateDocument: t,
				address: i,
				email: c,
				stateRegistration: r,
				tradeName: n,
				firstName: a,
				corporateName: e,
				segment: o,
				businessPhone: u,
				approved: false,
				isCorporate: true,
				documentType: 'CNPJ'
			};

			$.ajax({
				async: false,
				url: "//api.vtexcrm.com.br/tacticalb2b/dataentities/CL/documents/",
				type: "POST",
				contentType: "application/json",
				headers: {
					"Accept": "application/vnd.vtex.masterdata.v10+json",
					"Content-Type": "application/json"
				},
				data: JSON.stringify(f),
				success: function (data) {
					$("#createcliente .modalLogin__middle").html('<div class="cadastroSucesso"><h3>Cadastrado com sucesso.</h3><p>Aguarde até que seu perfil seja ativo</p></div>')

					console.log(data)
					//var form = new FormData();

					var fileValue = $('#sendImageclick').val()

					console.log(fileValue);


					if (!R.isNil(fileValue)) {
						const file = $('#sendImageclick').prop("files")[0];
						var form_data = new FormData();
						form_data.append("file", file)

						var settings = {
							"async": true,
							"crossDomain": true,
							"url": `//api.vtexcrm.com.br/tacticalb2b/dataentities/CL/documents/${data.DocumentId}/attach/attachments`,
							"type": "POST",
							"headers": {
								"accept": "application/vnd.vtex.ds.v10+json",
								"cache-control": "no-cache",
								"postman-token": "a7509754-c629-cba8-2ed6-195ce8307188"
							},
							"processData": false,
							"contentType": false,
							"mimeType": "multipart/form-data",
							"data": form_data
						}

						$.ajax(settings).done(function (response) {
							console.log(response);
						});
					}





					const dataAddress = {
						...AddressJson,
						userId: data.Id.replace('CL-', '')
					}


					$.ajax({
						async: false,
						url: "//api.vtexcrm.com.br/tacticalb2b/dataentities/AD/documents/",
						type: "PATCH",
						contentType: "application/json",
						headers: {
							"Accept": "application/vnd.vtex.masterdata.v10+json",
							"Content-Type": "application/json"
						},
						data: JSON.stringify(dataAddress),
						success: function (data) {
							console.log(data)
						},
						error: function (error) {
							console.log(error)
						}
					})

					sessionStorage.removeItem('userEmail')
				},
				error: function (error) {
					console.log(error)
				}
			})
		} else {
			console.log("CNPJ já cadastrado com outro usuário");

			const message = `<span class="cnpj-error" style="color: red; display: block; margin: 20px 0; padding: 10px; background-color: pink;    text-align: center;">CNPJ já cadastrado com outro usuário</span>`

			$('.contentForm').fadeOut();
			$(message).insertBefore('.contentForm');
			$('.resultCnpj').fadeOut();
			setTimeout(function(){
				$('#cnpj').val('');

				$('.contentForm').fadeIn();
				$('.backCnpj').trigger('click');
				$('.cnpj-error').remove();
			}, 2000)


		}




	})


	$('.login').on('click', '.vtexIdUI-close', function () {
		window.location = "/"
	})
});
