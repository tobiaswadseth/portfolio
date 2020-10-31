$(function() {

    // iInitialisera validator.js
    $('#contact-form').validator();


    // När formuläret skickas
    $('#contact-form').on('submit', function(e) {

        // Kolla om validator.js stoppar formuläret från att skickas
        if (!e.isDefaultPrevented()) {
            var url = "assets/form/contact.php";

            // Skicka formuläret i POST med ajax
            $.ajax({
                type: "POST",
                url: url,
                data: $(this).serialize(),
                success: function(data) {

                    // Få tillbaka success eller danger + meddelande
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    // Skapa bootstrap alert box i HTML
                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';

                    // Om vi har alert typ och meddelande
                    if (messageAlert && messageText) {
                        // Skicka meddelande till formulär skickaren
                        $('#contact-form').find('.messages').html(alertBox);
                        // Töm formuläret
                        $('#contact-form')[0].reset();
                    }
                }
            });
            return false;
        }
    });
});
