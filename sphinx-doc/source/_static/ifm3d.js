$(function() {
    $('ul li a').click(function(e) {

        if ($(this).siblings().length > 0) {
            e.preventDefault();
            $('ul ul').hide();
            $(this).parents('ul').show();
            $(this).next('ul').toggle();
        }
        console.log($(this).siblings().length);
    });
});