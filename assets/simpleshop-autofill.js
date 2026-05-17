(function(){
  var FIELD_NAME = 'payment[-::iv8jj9oo::value]';
  var FIELD_LABEL_NAME = 'payment[-::iv8jj9oo::name]';

  function getPayload(){
    try {
      var query = new URLSearchParams(window.location.search || '');
      var hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
      return query.get('vk') || hash.get('vk') || query.get('hodnoty') || hash.get('hodnoty') || '';
    } catch(e) {
      return '';
    }
  }

  function findField(){
    return document.querySelector('textarea[name="' + FIELD_NAME + '"]') ||
      document.querySelector('textarea[name*="iv8jj9oo"][name*="value"]');
  }

  function hideField(field){
    if (!field) return;
    var row = field.closest('.ssItemID-iv8jj9oo') || field.closest('.tr') || field.parentElement;
    if (row) {
      row.style.display = 'none';
      row.setAttribute('aria-hidden', 'true');
    }
    field.style.display = 'none';
    field.tabIndex = -1;
  }

  function fillAndHide(){
    var field = findField();
    if (!field) return false;

    hideField(field);

    var payload = getPayload();
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
    if (fillAndHide() || tries > 100) clearInterval(timer);
  }, 120);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fillAndHide);
  } else {
    fillAndHide();
  }
})();