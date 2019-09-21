$(function(){
    $(".js_nav_li").hover(function(){
        $(this).addClass("cur");
        $(this).find(".nav_list").addClass("cur")
    },function(){
        $(this).removeClass("cur");
        $(this).find(".nav_list").removeClass("cur")
    })
    $('.carousel').carousel({
        interval:3000
    })
    $('.carousel').carousel('cycle')

    $('#myCarousel2').carousel()
})
















