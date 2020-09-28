var registerEvents = {

    slick: function() {
        $('.your-class').slick({
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3
        });
    },
    flipcard: function() {
        $('.cvc').click(function() {
            $('.rccs__card').addClass('rccs__card--flipped');
        });
        $('.expiry').click(function() {
            $('.rccs__card').removeClass('rccs__card--flipped');

        });
        $('.your-name').focus(function() {
            $('.rccs__name').addClass('rccs--focused');
            $('.rccs__number').removeClass('rccs--focused');
            $('.rccs__expiry').removeClass('rccs--focused');
        });
        $('.card-number').focus(function() {
            $('.rccs__number').addClass('rccs--focused');
            $('.rccs__name').removeClass('rccs--focused');
            $('.rccs__expiry').removeClass('rccs--focused');
        });
        $('.datemonth').focus(function() {
            $('.rccs__expiry').addClass('rccs--focused');
            $('.rccs__number').removeClass('rccs--focused');
            $('.rccs__name').removeClass('rccs--focused');
        });
        $('.cvc').focus(function() {
            $('.rccs__cvc').addClass('rccs--focused');
            $('.rccs__number').removeClass('rccs--focused');
            $('.rccs__expiry').removeClass('rccs--focused');
        });


    },
dropdown: function(){
  
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function() {
    //   this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
      } else {
      dropdownContent.style.display = "block";
      }
      });
    }
},
toogolenavbar: function(){
    var element = document.getElementsByClassName("menu-trigger");
    $('.menu-trigger').click((function(){
        var c = $('.menu-trigger').hasClass('active');
        if(c == true){
            $('.menu-trigger').removeClass('active'); 
            $('.nav').removeClass('showmenu');
        }else{
            $('.menu-trigger').addClass('active'); 
            $('.nav').addClass('showmenu');
        }
    }))
    // element.addEventListener('click',function(){
    //    console.log(element.classList.contains('active'),'check class');
    // })
}


};

$(document).ready(function() {
    window.registerEvents = registerEvents;
});