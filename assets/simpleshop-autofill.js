/* Virtuální kartářka — skryté předání pole „hodnoty“ do SimpleShopu */
(function(){
  function getPayload(){
    try {
      if (window.VK_RITUAL_PAYLOAD) return window.VK_RITUAL_PAYLOAD;
      var p = new URLSearchParams(window.location.search);
      return p.get('vk') || p.get('hodnoty') || sessionStorage.getItem('VK_RITUAL_PAYLOAD') || '';
    } catch(e) { return ''; }
  }
  function findField(){
    return document.querySelector('textarea[name="payment[-::iv8jj9oo::value]"]') ||
           document.querySelector('textarea[name*="iv8jj9oo"][name*="value"]') ||
           Array.from(document.querySelectorAll('textarea')).find(function(t){
             var row = t.closest('.tr, .ssItemID-iv8jj9oo, div');
             return row && /hodnoty|kód výkladu|kod vykladu/i.test(row.textContent || '');
           });
  }
  function fill(){
    var payload = getPayload();
    if (!payload) return false;
    var field = findField();
    if (!field) return false;
    field.value = payload.slice(0, 500);
    field.dispatchEvent(new Event('input', {bubbles:true}));
    field.dispatchEvent(new Event('change', {bubbles:true}));
    var row = field.closest('.ssItemID-iv8jj9oo') || field.closest('.tr') || field.parentElement;
    if (row) row.style.display = 'none';
    var hiddenName = document.querySelector('input[name="payment[-::iv8jj9oo::name]"]');
    if (hiddenName) hiddenName.value = 'hodnoty';
    document.documentElement.classList.add('vk-autofill-ok');
    return true;
  }
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if (fill() || tries > 80) clearInterval(timer);
  }, 250);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fill); else fill();
})();
