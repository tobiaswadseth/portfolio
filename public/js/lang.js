(function ($) {

    'use strict';

    $.post('/admin/getlang', {}, (data) => {
        if (data.ok) {
            $('#lang-en').val(JSON.stringify(data.lang[0]));
            $('#lang-se').val(JSON.stringify(data.lang[1]));
        }
    });

    $('#lang-form').submit((e) => {
        e.preventDefault();
        const en = e.target.querySelector('#lang-en').value;
        const se = e.target.querySelector('#lang-se').value;
        const lang = {
            en: JSON.parse(en),
            se: JSON.parse(se)
        }
        $.post('/admin/updatelang', { lang }, (data) => {
        });
    })

})(jQuery);