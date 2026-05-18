(function(){
  var FIELD_NAME = 'payment[-::iv8jj9oo::value]';
  var FIELD_LABEL_NAME = 'payment[-::iv8jj9oo::name]';

  function getPayload(){
    try {
      var query = new URLSearchParams(window.location.search || '');
      var hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
      return query.get('vk') || hash.get('vk') || query.get('hodnoty') || hash.get('hodnoty') || '';
    } catch(e) { return ''; }
  }

  function parsePayload(){
    var payload = getPayload();
    if (!payload) return null;
    try { return JSON.parse(payload); } catch(e) { return null; }
  }

  function findField(){
    return document.querySelector('textarea[name="' + FIELD_NAME + '"]') ||
      document.querySelector('textarea[name*="iv8jj9oo"][name*="value"]');
  }

  function hideField(field){
    if (!field) return;
    var row = field.closest('.ssItemID-iv8jj9oo') || field.closest('.tr') || field.parentElement;
    if (row) { row.style.display = 'none'; row.setAttribute('aria-hidden', 'true'); }
    field.style.display = 'none'; field.tabIndex = -1;
  }

  function normalizeText(s){
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  function selectVariantByPayload(data){
    if (!data || !data.m) return false;
    var want30 = data.m === '30dni';
    var rows = Array.prototype.slice.call(document.querySelectorAll('.variantWrapper .tr, .variant .tr, .tr.variant, .line1'));
    var candidates = rows.filter(function(row){ return row.querySelector('input[type="radio"],input[type="checkbox"]'); });
    var chosen = null;
    candidates.forEach(function(row){
      if (chosen) return;
      var txt = normalizeText(row.textContent);
      if (want30) {
        if (txt.indexOf('30 dni') > -1 || txt.indexOf('30d') > -1 || txt.indexOf('99') > -1 || txt.indexOf('mesic') > -1) chosen = row;
      } else {
        if (txt.indexOf('otazk') > -1 || txt.indexOf('49') > -1 || txt.indexOf('konkretni') > -1) chosen = row;
      }
    });
    if (!chosen) return false;
    var input = chosen.querySelector('input[type="radio"],input[type="checkbox"]');
    if (!input) return false;
    if (!input.checked) input.click();
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    if (typeof window.redrawForm === 'function') window.redrawForm();
    return true;
  }

  function fillAndHide(){
    var field = findField();
    var payload = getPayload();
    var data = parsePayload();
    selectVariantByPayload(data);
    if (!field) return false;
    hideField(field);
    if (!payload) return false;
    field.value = payload.slice(0, 500);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    var hiddenName = document.querySelector('input[name="' + FIELD_LABEL_NAME + '"]');
    if (hiddenName) hiddenName.value = 'hodnoty';
    return true;
  }

  var tries = 0;
  var timer = setInterval(function(){
    tries += 1;
    if (fillAndHide() || tries > 120) clearInterval(timer);
  }, 120);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fillAndHide);
  else fillAndHide();
})();