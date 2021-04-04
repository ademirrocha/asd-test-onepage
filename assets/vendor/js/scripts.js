$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
    if (!$(this).next().hasClass('show')) {
      $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
    }
    var $subMenu = $(this).next('.dropdown-menu');
    $subMenu.toggleClass('show');
  
  
    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
      $('.dropdown-submenu .show').removeClass('show');
    });
  
  
    return false;
});

function hasRadioChecked(radio = null){
  var result = false
  if(radio == null){
    $('.checkmark').each(function(){
      if($(this).is(":visible") && $(this).hasClass('checkedRadio')){
        result = true
      }
    });
  }else{
    if($(radio).is(":visible")){
      result = true
    }
  }
  
  return result;
}

function clickRadio(elmnt) {
  var n, i, x;
  n = elmnt.id.split('label')[1];
  
  for (i = 1; i < 10; i++) {
    x = document.getElementById("check" + i);
    if (x && ! hasRadioChecked()) {
      x.className += x.className.replace("checkedRadio", "unCheckedRadio");
    }
    if(hasRadioChecked(document.getElementById("check" + i))){
      document.getElementById("check" + i).className += ' disabledRadio'
    }
  }
  if(! hasRadioChecked()){
    var radio = document.getElementById("check" + n)
    radio.className += " checkedRadio";
  }
  
  
  
}

$(document).ready(function(){

  $(window).scroll(function(){
      if ($(this).scrollTop() > 100) {
          $('#upInicio').fadeIn();
      } else {
          $('#upInicio').fadeOut();
      }
  });

  $('#upInicio').click(function(){
      $('html, body').animate({scrollTop : 0},1000);
      return false;
  });

  

});

function navigateTo(elem, time = 1000){
  $('html, body').animate({scrollTop : $('#'+elem).offset().top },time);
  return false;
}

function modalClose(){
  if($('#background').hasClass('d-flex')){
    $('#background').removeClass('d-flex');
    $('#background').addClass('d-none');
  }else{
    $('#background').removeClass('d-none');
    $('#background').addClass('d-flex');
  }
}

$('#background').click(function(){
  $('.navbar-toggler-icon').click()
})

$('.dropdown-item').click(function(){
  if( ! $(this).hasClass('disabled') && $(this).hasClass('navigate') ){
    $('.navbar-toggler-icon').click()
  }
    
})

$('.nav-link').click(function(){
  if( ! $(this).hasClass('disabled') && $(this).hasClass('navigate') ){
    $('.navbar-toggler-icon').click()
  }
    
})

$('.navbar-toggler-icon').click(function(){
  modalClose()
})


AOS.init({
    duration: 1200
});
new WOW().init();