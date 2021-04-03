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

function clickRadio(elmnt) {
  var n, i, x;
  n = elmnt.id.split('label')[1];
  
  for (i = 1; i < 5; i++) {
    x = document.getElementById("check" + i);
    if (x) {
      x.className = x.className.replace("checkedRadio", "unCheckedRadio");
    }
  }
  document.getElementById("check" + n).className += " checkedRadio";
}

AOS.init({
    duration: 1200
});
new WOW().init();