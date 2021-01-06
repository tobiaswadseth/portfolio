(function ($) {

    'use strict';

    $.post('/admin/getprojects', {}, (data) => {
        if (data.ok) {
            $('#cats').val(JSON.stringify(data.cats));
            $('#projects').val(JSON.stringify(data.projects));
        }
    });

    $('#projects-form').submit((e) => {
        e.preventDefault();
        const cats = e.target.querySelector('#cats').value;
        const port = e.target.querySelector('#projects').value;
        const projects = {
            cats: JSON.parse(cats),
            projects: JSON.parse(port)
        }
        $.post('/admin/updateprojects', { projects }, (data) => {
        });
    })

})(jQuery);