javascript:void((function(){andiScript=document.createElement('script');andiScript.setAttribute('src','https://www.dhs.gov/xlibrary/oast/ANDI/andi.js');document.body.appendChild(andiScript)})());  

$('input[name="lang"]').on('change',function(){
  var radios = document.getElementsByName('lang');
  for (var i = 0, length = radios.length; i < length; i++)
  {
   if (radios[i].checked)
   {
    // do whatever you want with the checked radio
    var selLang = radios[i].value;
    break;
   }
  }
  $('.langContent').removeClass("show");
  $('div[id|=' + selLang +']').addClass("show");
  $('.langContent:not([id|=' + selLang +'])').addClass("hide");
});