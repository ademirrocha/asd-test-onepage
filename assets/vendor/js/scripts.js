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

AOS.init({
    duration: 1200
});
new WOW().init();