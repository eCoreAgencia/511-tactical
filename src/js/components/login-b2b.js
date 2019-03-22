class Login {
	constructor() {
		if ($("body").hasClass("minha-conta")) {
			this.loginUser(),
				this.buttonActions(),
				this.maskCnpj(),
				this.searchCnpj(),
				this.sendForm();
			var n = document.getElementById("sendImageclick"),
				e = document.getElementById("file-name");
			n.addEventListener("change", function () {
				e.textContent = this.value
			})
		}

	}

	insertMensager(mensager, classname, inject) {
		let alertLogin = "<div class='" + classname + "'><p>" + mensager + "</p></div>";
		$('"' + inject + '"').append(alertLogin);
	}

	loginUser() {
		$(".main-login").on("click", function (t) {
			t.preventDefault();
			var n = $("#login-cnpj").val(),
				e = $("#senha").val(),
				r = n.replace(/-/g, "");
			r = r.replace(/\//g, ""),
				r = r.replace(".", ""),
				r = r.replace(".", ""),
				$.ajax({
					async: !0,
					crossDomain: !0,
					url: "http://api.vtexcrm.com.br/tacticalb2b/dataentities/US/search?_where=cnpj=" + r + " AND senha=" + e + "&_fields=ativo,id,cnpj,nomefantasia,razaosocial,tipo",
					type: "GET",
					contentType: "application/json"
				}).done(function (t) {
					var n = t;
					if (0 == n.length) {
						$(".contentForm").append("<div class='not-regitered--red'><p>Usuario não encontrado </p></div>"),
							setTimeout(function () {
								$(".not-regitered--red").remove()
							}, 5e3)
					} else if (n[0].ativo)
						console.log("entro"),
						localStorage.setItem("userEcore", !0),
						localStorage.setItem("idUserEcore", n[0].id),
						localStorage.setItem("userLogged", JSON.stringify(n[0])),
						window.location = "/";
					else {
						$(".contentForm").append("                        <div class='not-regitered--red'>                            <p>Você já esta cadastro, agora e só esperar a ativação do seu cadastro!</p>                        </div>"),
							setTimeout(function () {
								$(".not-regitered--red").remove()
							}, 5e3)
					}
				})
		})
	}

	searchCnpj() {
		$(".buscarCnpj").on("click", function (t) {
			t.preventDefault(),
				$("#searchCnpj .resultCnpj img").remove(),
				$("#searchCnpj .resultCnpj").append('<img src="https://casaeficiente2020.pt/Assets/Icons/loader.gif" style="/* display: none; */position: absolute;top: 190px;background: #fff;width: 82%;padding: 0 170px;">'),
				$("#searchCnpj .resultCnpj").fadeIn(),
				$("#searchCnpj .resultCnpj .resultCnpj__info, #searchCnpj .resultCnpj h3").fadeOut();
			var n = $(".contentForm #cnpj").val();
			console.log(n);
			var e = {
				CNPJ: n
			};
			$.ajax({
				async: true,
				crossDomain: true,
				url: "https://tacticalb2b-fullcore.herokuapp.com/",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(e)
			}).done(function (t) {
				console.log(t);
				var n = JSON.parse(t);
				if (n.Status) {
					var e = n.NomeFantasia,
						r = n.RazaoSocial,
						i = n.Enderecos[0].Logradouro + ", " + n.Enderecos[0].Numero + ", " + n.Enderecos[0].Complemento + ", " + n.Enderecos[0].Bairro + ", " + n.Enderecos[0].Cidade + ", " + n.Enderecos[0].Estado;
					$(".resultCnpj .resultCnpj__info .nomeFantasia").text(e),
						$(".resultCnpj .resultCnpj__info .razaoSocial").text(r),
						$(".resultCnpj .resultCnpj__info .endereco").text(i),
						$(".buscarCnpj").fadeOut(),
						$(".nextLogin").fadeIn(),
						$("input#endComercial").val(i),
						$("#searchCnpj .resultCnpj .resultCnpj__info, #searchCnpj .resultCnpj h3").fadeIn()
				} else
					$(".resultCnpj").append("<div class='not-regitered--red'><p>CNPJ não encontrado </p></div>"),
					setTimeout(function () {
						$(".resultCnpj .not-regitered--red").remove()
					}, 5e3);
				$("#searchCnpj .resultCnpj img").fadeOut()
			})
		})
	}

	maskCnpj() {
		$(".contentForm #cnpj").mask("99.999.999/9999-99"),
			$("#login-cnpj").mask("99.999.999/9999-99"),
			$("#telefoneRespo").mask("(99) 9 9999-9999")
	}

	sendForm() {
		$(".confirmcad").on("click", function () {
			event.preventDefault();
			var t = $(".contentForm #cnpj").val(),
				n = $(".resultCnpj .resultCnpj__info .nomeFantasia").text(),
				e = $(".resultCnpj .resultCnpj__info .razaoSocial").text(),
				r = $(".contentForm #incriEstadual").val(),
				i = $(".contentForm #endComercial").val(),
				o = $(".contentForm #segmento").val(),
				a = $(".contentForm #nameRespo").val(),
				c = $(".contentForm #emailRespo").val(),
				u = $(".contentForm #telefoneRespo").val(),
				s = $(".contentForm #senha1").val();
			if (s == $(".contentForm #senha2").val()) {
				"" == $(".contentForm #incriEstadual").val() && (r = "isento");
				var f = {
					cnpj: t,
					emailresponsavel: c,
					endereco: i,
					inscricaoestadual: r,
					nomefantasia: n,
					nomeresponsavel: a,
					razaosocial: e,
					segmento: o,
					senha: s,
					telefoneresponsavel: u,
					ativo: !1
				};
				$.ajax({
					async: !0,
					url: "//api.vtexcrm.com.br/tactical/dataentities/LG/documents/",
					type: "PATCH",
					contentType: "application/json",
					data: JSON.stringify(f),
					success: function () {
						$("#createcliente .modalLogin__middle").html('<div class="cadastroSucesso"><h3>Cadastrado com sucesso.</h3><p>Aguarde até que seu perfil seja ativo</p></div>')
					},
					error: function () {
						alert("Ops, houve um erro.")
					}
				})
			} else
				alert("Senha invalida !")
		})
	}

	buttonActions() {
		$(".createaccount").on("click", function (t) {
				t.preventDefault(),
					$(this).parents(".modalLogin__box--item").css("display", "none"),
					$("#searchCnpj").fadeIn()
			}),
			$(".modalLogin__close").on("click", function (t) {
				window.history.back()
			}),
			$(".backOption").on("click", function (t) {
				t.preventDefault(),
					$(this).parents(".modalLogin__box--item").css("display", "none"),
					$("#optionAcess").fadeIn()
			}),
			$(".hasaccount").on("click", function (t) {
				t.preventDefault(),
					$(this).parents(".modalLogin__box--item").css("display", "none"),
					$("#login").fadeIn()
			}),
			$(".backCnpj").on("click", function (t) {
				t.preventDefault(),
					$(this).parents(".modalLogin__box--item").css("display", "none"),
					$("#searchCnpj").fadeIn()
			}),
			$(".nextLogin").on("click", function (t) {
				t.preventDefault(),
					$(this).parents(".modalLogin__box--item").css("display", "none"),
					$("#createcliente").fadeIn()
			})
	}
}

$(document).ready(function(){
	window.Login = new Login();
})


