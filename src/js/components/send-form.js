import variables from '../../../config/variables';

/*

 */
$.fn.sendForm = function(entity, overwriteFields) {
	var form = this,
		url = `//api.vtexcrm.com.br/${variables.STORE_ID}/dataentities/${entity}/documents`;
	overwriteFields = overwriteFields || {};

	form.submit(function(e) {

        console.log(form);
		e.preventDefault();

		var fields = {};

		form.find(
			`input[type="text"],
			input[type="number"],
			input[type="tel"],
			input[type="email"],
			input[type="hidden"],
			input[type="radio"]:checked,
			input[type="checkbox"]:checked,
			select,
			textarea`
		).each(function(i) {
			var name = $(this).attr('name') || $(this).attr('id');
			if (name) {
				fields[name] = $(this).val();
			}
		});

        fields = Object.assign({}, fields, overwriteFields);
        
        console.log(fields);

		$.ajax({
			url: url,
			type: 'POST',
			headers: {
				accept: 'application/vnd.vtex.masterdata.v10+json',
				'content-type': 'application/json; charset=utf-8'
			},
			data: JSON.stringify(fields)
		})
			.done(function() {
				form.find('input, textarea, select')
					.val('')
					.filter('[type="checkbox"]')
					.prop('checked', false);
				console.log('define notification:', 'success');
				if (entity == 'NL') {
					form.addClass('success');
					form.find('.newsletter__success').css('display', 'flex');
				}
			})
			.fail(function(jqXHR, textStatus) {
				var msg = JSON.parse(jqXHR.responseText);
				console.log('define notification:', 'error', msg);
				const error_msg = `<span class="error-msg" style="display: none;">${msg.Message}</span>`;
				form.append(error_msg);
				$('.newsletter').addClass('form-fail');
			});
	});
};
