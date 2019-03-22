$(document).ready(() => {
	vtexjs.checkout.getOrderForm().done(orderForm => {
		const ifLogged = orderForm.loggedIn;
		if (ifLogged) {
			// desk
			const emailLimited = orderForm.clientProfileData.email.length;
			const elementWelcomeMobile = orderForm.clientProfileData.email;
			if (emailLimited > 15) {
				console.log(elementWelcomeMobile);



				$(".logged-status").text(
					`Olá,${elementWelcomeMobile.substr(0, 14)}...`
				);


			}
			const linkLogout = `<li class="menu__item menu__item--highlight menu__item--logout"><a class="menu__link" href="/no-cache/user/logout">Sair</a></li>`

			$('.header__top .menu--institutional').append(linkLogout);
		}
	});
});
