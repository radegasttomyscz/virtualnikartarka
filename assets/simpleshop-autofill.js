/* Virtuální kartářka — skryté předání pole „hodnoty“ do SimpleShopu
   Vloženo i jako samostatný soubor pro kontrolu. Hlavní kopie je v SIMPLESHOP_SKRYTE_POLE_JS.txt. */
(function(){
  var FIELD_NAME = 'payment[-::iv8jj9oo::value]';
  var FIELD_LABEL_NAME = 'payment[-::iv8jj9oo::name]';

  function getPayload(){
    try {
      var q = new URLSearchParams(window.location.search);
      var h = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
      return q.get('vk') || q.get('hodnoty') || h.get('vk') || h.get('hodnoty') || '';
    } catch(e) { return ''; }
  }

  function findField(){
    return document.querySelector('textarea[name="' + FIELD_NAME + '"]') ||
           document.querySelector('textarea[name*="iv8jj9oo"][name*="value"]') ||
           Array.from(document.querySelectorAll('textarea')).find(function(t){
             var row = t.closest('.tr, .ssItemID-iv8jj9oo, div');
             return row && /hodnoty|data výkladu|kód výkladu|kod vykladu/i.test(row.textContent || '');
           });
  }

  function hideField(field){
    if (!field) return;
    var row = field.closest('.ssItemID-iv8jj9oo') || field.closest('.tr') || field.parentElement;
    if (row) row.style.setProperty('display','none','important');
    field.style.setProperty('display','none','important');
  }

  function fill(){
    var field = findField();
    if (field) hideField(field);

    var payload = getPayload();
    if (!field || !payload) return false;

    field.value = payload.slice(0, 500);
    field.dispatchEvent(new Event('input', {bubbles:true}));
    field.dispatchEvent(new Event('change', {bubbles:true}));

    var hiddenName = document.querySelector('input[name="' + FIELD_LABEL_NAME + '"]');
    if (hiddenName) hiddenName.value = 'hodnoty';

    document.documentElement.classList.add('vk-autofill-ok');
    return true;
  }

  function ensureStyles(){
    if (document.getElementById('vk-hide-hodnoty-style')) return;
    var style = document.createElement('style');
    style.id = 'vk-hide-hodnoty-style';
    style.textContent = '.ssItemID-iv8jj9oo{display:none!important;} textarea[name="' + FIELD_NAME.replace(/([\[\]:'"\\])/g,'\\$1') + '"]{display:none!important;}';
    document.head.appendChild(style);
  }

  ensureStyles();
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if (fill() || tries > 80) clearInterval(timer);
  }, 150);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();
