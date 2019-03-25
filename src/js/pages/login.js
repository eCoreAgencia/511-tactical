import { getInMasterData } from '../modules/vtexRequest';
import { isLocalhost } from '../utils';
const R = require('ramda');

$(document).ready(() => {

	if($('body').hasClass('minha-conta')){
		localStorage.setItem('onMyAccount', true);
	}


	vtexjs.checkout.getOrderForm().done(async orderForm => {
		const isLogged = orderForm.loggedIn;
		if (isLogged) {
			let onMyAccount = localStorage.getItem('onMyAccount') || localStorage.setItem('onMyAccount', false);
			const userEmail = orderForm.clientProfileData.email;
			const userName = orderForm.clientProfileData.firstName;
			const query = `email=${userEmail}`
			const getUser = await getInMasterData('CL', query, "id,corporateDocument,approved,customerClass,corporateName,corporateEmail,businessPhone,tradeName,stateRegistration");
			const user = getUser[0];
			localStorage.setItem('user', JSON.stringify(user))
			console.log(user);
			const welcomeMessage = userName ? `Olá, ${userName}` : `Olá, ${userEmail}`
			if (welcomeMessage.length >= 15) $(".logged-status").text(`${welcomeMessage.substr(0, 14)}...`)
			else $(".logged-status").text(welcomeMessage)

			const linkLogout = `<li class="menu__item menu__item--highlight menu__item--logout"><a class="menu__link" href="/no-cache/user/logout">Sair</a></li>`

			$('.header__top .menu--institutional').append(linkLogout);


			if (R.isEmpty(user) || R.isNil(user)) {


				localStorage.setItem('userEmail', userEmail)
				localStorage.setItem('user', '')

			} else {

				localStorage.setItem('user', JSON.stringify(user));

				if(user.approved == true) {
					document.body.classList.add('user-logged');

					$('.logged-link').href('/account/orders')
					$('.logged-status').href('/account/')
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

					localStorage.removeItem('onMyAccount');

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
		localStorage.setItem('onMyAccount', false)
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
			let user = localStorage.getItem('user') || ''
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
			if (user == '') {
				var f = {
					corporateDocument: t,
					address: i,
					email: localStorage.getItem('userEmail'),
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
			} else {
				user = JSON.parse(user);
				var f = {
					id: user.id,
					corporateDocument: t,
					corporateEmail: c,
					address: i,
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
			}

			$.ajax({
				async: false,
				url: "//api.vtexcrm.com.br/tacticalb2b/dataentities/CL/documents/",
				type: "PATCH",
				contentType: "application/json",
				headers: {
					"Accept": "application/vnd.vtex.masterdata.v10+json",
					"Content-Type": "application/json"
				},
				data: JSON.stringify(f),
				success: function () {
					$("#createcliente .modalLogin__middle").html('<div class="cadastroSucesso"><h3>Cadastrado com sucesso.</h3><p>Aguarde até que seu perfil seja ativo</p></div>')

					localStorage.removeItem('userEmail')
				},
				error: function () {
					alert("Ops, houve um erro.")
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


	$('.vtexIdUI-close').on('click', function(){
		window.location = "/"
	})
});
