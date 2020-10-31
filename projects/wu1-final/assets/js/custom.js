$(window).on('load', function () {
    "use strict";

    // Göm vertikal menyn
    $('#vertical-menu').addClass("invisible");

    // Sätt copyright årtal
    var date = new Date();
    $('#overlay-year').text(date.getFullYear());
    $('#year').text(date.getFullYear());

    // Masonry
    var $container = $('.masonry');
    $container.imagesLoaded(function () {
        $container.masonry({
            itemSelector: '.grid-item',
        });
    });

    // Infinite Scroll
    var curPage = 1;
    var pagesNum = $("#pagination-selector").find("li a:last").text(); // Antal sidor

    if (curPage == pagesNum) {
        $('.load-more button').remove();
    }

    $container.infinitescroll({
            itemSelector: '.grid-item',
            nextSelector: '.portfolio-pagination li a',
            navSelector: '#pagination-selector',
            extraScrollPx: 0,
            bufferPx: 0,
            maxPage: 6,
            loading: {
                finishedMsg: "No more works",
                msgText: '<div class="loader"><span></span></div>',
                speed: 'slow',
                selector: '.load-more',
            },
        },
        // Masonry
        function (newElements) {

            var $newElems = $(newElements);
            $newElems.imagesLoaded(function () {
                // Fäst masonry
                $newElems.animate({
                    opacity: 1
                });
                $container.masonry('appended', $newElems, true);
            });

            // Kolla om sista
            curPage++;
            if (curPage == pagesNum) {
                $('.load-more button').remove();
            }
            $('.load-more').find('button').css('visibility', 'visible');
        });

    $container.infinitescroll('unbind');

    $('.load-more button').on('click', function () {
        $container.infinitescroll('retrieve');
        $('.load-more').find('button').css('visibility', 'hidden');
        return false;
    });

    /*=========================================================================
        Preloader
    =========================================================================*/
    $("#preloader").delay(350).addClass('loaded');
    $('.site-wrapper').addClass('loaded');

    // Tar bort invisible classen från vertikal menyn
    $('.vertical-menu').removeClass('invisible');

});

$(function () {
    "use strict";

    /*=========================================================================
        Overlay meny klick
    =========================================================================*/
    $(".menu-icon").on('click', function () {
        $(".overlay-menu").addClass('opened');
    });

    $(".overlay-menu .close-icon").on('click', function () {
        $(".overlay-menu").removeClass('opened');
    });

    /*=========================================================================
        Parallaxbilder med attribut
     =========================================================================*/
    var list = document.getElementsByClassName('parallax-bg');

    for (var i = 0; i < list.length; i++) {
        var src = list[i].getAttribute('data-image-src');
        list[i].style.backgroundImage = "url('" + src + "')";
    }

    /*=========================================================================
        Parallaxbilder med Stellar JS
     =========================================================================*/
    $.stellar({
        horizontalScrolling: false,
        verticalOffset: 40
    });

    /*=========================================================================
        Undermeny knapp
     =========================================================================*/
    $(".submenu").before('<i class="ion-md-add switch"></i>');

    $(".vertical-menu li i.switch").on('click', function () {
        var $submenu = $(this).next(".submenu");
        $submenu.slideToggle(300);
        $submenu.parent().toggleClass("openmenu");
    });

    /*=========================================================================
            Go to top
    =========================================================================*/
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 250) { // Om 50px eller mer har skrollats
            $('#return-to-top').fadeIn(200); // Fade in go to top pil
        } else {
            $('#return-to-top').fadeOut(200); // Else fade out go to top pil
        }
    });
    $('#return-to-top').on('click', function () { // When go to top pil blir klickar
        $('body,html').animate({
            scrollTop: 0 // Skrolla till toppen av sidan
        }, 400);
    });

    $(document).on('mousemove', function (e) {
        var width = $(document).width();
        var height = $(document).height();

        /*=========================================================================
            Mus
        =========================================================================*/
        if (width > 990) {
            $('#cursor').css({
                'display': 'block',
                'left': Number((e.pageX) - 10),
                'top': Number((e.pageY) - 10),
                'z-index': '9999999'
            });
            if (Number((e.pageX) + 24) > width) {
                $('#cursor').css({
                    'display': 'none'
                });
            }
            if (Number((e.pageX)) < 10) {
                $('#cursor').css({
                    'display': 'none'
                });
            }
            if (Number((e.pageY) + 24) > height) {
                $('#cursor').css({
                    'display': 'none'
                });
            }
            if (Number((e.pageY)) < 10) {
                $('#cursor').css({
                    'display': 'none'
                });
            }
        }
    });

});
