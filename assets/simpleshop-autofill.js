(function(){
  var FIELD_NAME = 'payment[-::iv8jj9oo::value]';
  var FIELD_LABEL_NAME = 'payment[-::iv8jj9oo::name]';
  var lastVariantMode = null;

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
    try { return JSON.parse(payload); } catch(e) {
      try { return JSON.parse(decodeURIComponent(payload)); } catch(err) { return null; }
    }
  }

  function findField(){
    return document.querySelector('textarea[name="' + FIELD_NAME + '"]') ||
      document.querySelector('textarea[name*="iv8jj9oo"][name*="value"]') ||
      Array.prototype.find.call(document.querySelectorAll('textarea'), function(t){
        var label = (t.closest('.tr') || t.parentElement || document.body).textContent || '';
        return /hodnoty/i.test(label);
      });
  }

  function hideField(field){
    if (!field) return;
    var row = field.closest('.ssItemID-iv8jj9oo') || field.closest('.tr') || field.parentElement;
    if (row) { row.style.display = 'none'; row.setAttribute('aria-hidden', 'true'); }
    field.style.display = 'none';
    field.tabIndex = -1;
  }

  function normalizeText(s){
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isLegalOrSystemText(txt){
    return /souhlasim|obchodnimi podminkami|ochran[ay] osobnich udaju|digit[aá]lniho obsahu|lhut|odstoupeni|email|fakturacni|platebni|qr platba|bankovni prevod/i.test(txt);
  }

  function getVariantCandidates(){
    var inputs = Array.prototype.slice.call(document.querySelectorAll('.variantWrapper input[type="radio"], .variantWrapper input[type="checkbox"], input[name*="payment[items"][type="radio"], input[name*="payment[items"][type="checkbox"]'));
    var seen = [];
    return inputs.map(function(input){
      var row = input.closest('.tr.variant') || input.closest('.tr') || input.closest('.line1') || input.closest('label') || input.parentElement;
      var tile = input.closest('.cover') || row;
      var text = normalizeText((row && row.textContent) || (tile && tile.textContent) || input.value || '');
      return { input: input, row: row, tile: tile, text: text };
    }).filter(function(item){
      if (!item.input || !item.row) return false;
      if (seen.indexOf(item.input) > -1) return false;
      seen.push(item.input);
      if (isLegalOrSystemText(item.text)) return false;
      return /vyklad|otazk|30 dni|99|49|virtualnikartarka/i.test(item.text);
    });
  }

  function rowScore(item, want30){
    var txt = item.text;
    var score = 0;
    if (want30) {
      if (txt.indexOf('30 dni') > -1) score += 80;
      if (txt.indexOf('kartovy vyklad') > -1) score += 20;
      if (txt.indexOf('99') > -1) score += 30;
      if (txt.indexOf('mesic') > -1 || txt.indexOf('nasledujicich') > -1) score += 10;
      if (txt.indexOf('otazk') > -1 || txt.indexOf('49') > -1) score -= 60;
    } else {
      if (txt.indexOf('otazk') > -1) score += 90;
      if (txt.indexOf('49') > -1) score += 30;
      if (txt.indexOf('konkretni') > -1 || txt.indexOf('odpoved') > -1) score += 10;
      if (txt.indexOf('30 dni') > -1 || txt.indexOf('99') > -1) score -= 60;
    }
    return score;
  }

  function setAmountFor(item, amount){
    if (!item || !item.row) return;
    var amountInput = item.row.querySelector('.amount input[type="text"], .amount input[type="number"], input[name*="amount"]');
    if (amountInput) {
      amountInput.value = String(amount);
      amountInput.dispatchEvent(new Event('input', { bubbles: true }));
      amountInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function clickVariant(item){
    if (!item || !item.input) return false;
    try {
      if (!item.input.checked) item.input.click();
      item.input.checked = true;
      item.input.dispatchEvent(new Event('input', { bubbles: true }));
      item.input.dispatchEvent(new Event('change', { bubbles: true }));
      if (item.tile && typeof item.tile.click === 'function') {
        setTimeout(function(){ if (!item.input.checked) item.tile.click(); }, 25);
      }
      setAmountFor(item, 1);
      return true;
    } catch(e) { return false; }
  }

  function selectVariantByPayload(data){
    if (!data || !data.m) return true;
    var want30 = data.m === '30dni';
    var candidates = getVariantCandidates();
    if (!candidates.length) return false;

    var scored = candidates.map(function(item){ return { item: item, score: rowScore(item, want30) }; })
      .sort(function(a,b){ return b.score - a.score; });
    var chosen = scored[0] && scored[0].score > 0 ? scored[0].item : null;
    if (!chosen) return false;

    candidates.forEach(function(item){
      if (item.input !== chosen.input) {
        try {
          item.input.checked = false;
          setAmountFor(item, 0);
          item.input.dispatchEvent(new Event('change', { bubbles: true }));
        } catch(e) {}
      }
    });

    var ok = clickVariant(chosen);
    if (typeof window.redrawForm === 'function') {
      window.redrawForm();
      setTimeout(window.redrawForm, 80);
      setTimeout(window.redrawForm, 250);
    }

    lastVariantMode = data.m;
    return ok && chosen.input.checked;
  }

  function fillAndHide(){
    var field = findField();
    var payload = getPayload();
    var data = parsePayload();
    var variantOk = selectVariantByPayload(data);

    if (field) {
      hideField(field);
      if (payload) {
        field.value = payload.slice(0, 500);
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        var hiddenName = document.querySelector('input[name="' + FIELD_LABEL_NAME + '"]');
        if (hiddenName) hiddenName.value = 'hodnoty';
      }
    }

    // Stop retrying only when both hidden payload and selected variant are ready.
    return Boolean(field && payload && variantOk);
  }

  var tries = 0;
  var timer = setInterval(function(){
    tries += 1;
    if (fillAndHide() || tries > 180) clearInterval(timer);
  }, 120);

  document.addEventListener('click', function(){
    // If SimpleShop redraws the form after user's click, try to preserve selected variant and hidden payload.
    setTimeout(fillAndHide, 100);
    setTimeout(fillAndHide, 400);
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fillAndHide);
  else fillAndHide();
})();
