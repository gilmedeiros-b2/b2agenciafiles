document.addEventListener('DOMContentLoaded', function () {
window.dataLayer = window.dataLayer || [];
  // ========================
  // CONFIG
  // ========================
  const b2wpp_whatsappNumber = '556239218600';
  const b2wpp_webhookUrl = 'https://webhookn8n.b2agencia.com.br/webhook/send-lead/landingpage/v2';
  const b2wpp_defaultMessage = 'Vim pelo site e gostaria de saber mais sobre stands e cenografia';

  // ========================
  // ELEMENTOS (SAFE)
  // ========================
  const modal = document.getElementById('b2wpp-modal');
  const form = document.getElementById('b2wpp-form');
  const inputName = document.getElementById('b2wpp-name');
  const inputPhone = document.getElementById('b2wpp-phone');
  const inputEmail = document.getElementById('b2wpp-email');
  const inputCompany = document.getElementById('b2wpp-company');
  const inputIdUnidade = document.getElementById('b2wpp-id-unidade');

  if (!form) return; // evita erro se não existir

  // ========================
  // MODAL
  // ========================
  window.b2wpp_openModal = function (e) {
    e.preventDefault();
    modal?.classList.add('b2wpp-modal--active');
  };

  window.b2wpp_closeModal = function () {
    modal?.classList.remove('b2wpp-modal--active');
    form.reset();
    clearErrors();
  };

  // ========================
  // ERROS
  // ========================
  function clearErrors() {
    document.querySelectorAll('.b2wpp-form__group')
      .forEach(g => g.classList.remove('b2wpp-form__group--error'));
  }

  // ========================
  // MÁSCARA TELEFONE
  // ========================
  function maskPhone(v) {
    v = v.replace(/\D/g, '').substring(0, 11);

    if (v.length <= 10) {
      v = v.replace(/^(\d{2})(\d)/, '($1) $2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      v = v.replace(/^(\d{2})(\d)/, '($1) $2');
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
    }

    return v;
  }

  inputPhone?.addEventListener('input', e => {
    e.target.value = maskPhone(e.target.value);
  });

  // ========================
  // CAPTURA + PERSISTÊNCIA
  // ========================
  function getParams() {
    const params = new URLSearchParams(window.location.search);

    const data = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      fbclid: params.get('fbclid'),
      gclid: params.get('gclid')
    };

    // salva se existir
    Object.keys(data).forEach(key => {
      if (data[key]) {
        localStorage.setItem(`b2wpp_${key}`, data[key]);
      }
    });

    // retorna sempre (prioriza URL, fallback localStorage)
    return {
      utm_source: data.utm_source || localStorage.getItem('b2wpp_utm_source') || '',
      utm_medium: data.utm_medium || localStorage.getItem('b2wpp_utm_medium') || '',
      utm_campaign: data.utm_campaign || localStorage.getItem('b2wpp_utm_campaign') || '',
      utm_content: data.utm_content || localStorage.getItem('b2wpp_utm_content') || '',
      utm_term: data.utm_term || localStorage.getItem('b2wpp_utm_term') || '',
      fbclid: data.fbclid || localStorage.getItem('b2wpp_fbclid') || '',
      gclid: data.gclid || localStorage.getItem('b2wpp_gclid') || ''
    };
  }

  // ========================
  // COOKIES
  // ========================
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : '';
  }

  function getFacebookCookies() {
    let fbp = getCookie('_fbp');
    let fbc = getCookie('_fbc');

    const fbclid = getParams().fbclid;

    // gera fbc se não existir
    if (!fbc && fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`;
    }

    return { fbp, fbc };
  }

  // ========================
  // WEBHOOK
  // ========================
  function send(data) {

    const utm = getParams();
    const facebook = getFacebookCookies();

    const payload = {
      ...data,
      utm,
      facebook,
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    };

    console.log('B2WPP PAYLOAD:', payload); // DEBUG

    fetch(b2wpp_webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.log('Webhook erro:', err));
     window.dataLayer.push({'event': 'form_submited'});
  }

  // ========================
  // VALIDAÇÃO
  // ========================
  function validate() {
    clearErrors();

    const name = inputName.value.trim();
    const phone = inputPhone.value.replace(/\D/g, '');
    const email = inputEmail.value.trim();
    const company = inputCompany.value.trim();

    let ok = true;

    if (!name) {
      inputName.closest('.b2wpp-form__group').classList.add('b2wpp-form__group--error');
      ok = false;
    }

    if (phone.length < 10) {
      inputPhone.closest('.b2wpp-form__group').classList.add('b2wpp-form__group--error');
      ok = false;
    }

    if (!email) {
      inputEmail.closest('.b2wpp-form__group').classList.add('b2wpp-form__group--error');
      ok = false;
    }

    if (!company) {
      inputCompany.closest('.b2wpp-form__group').classList.add('b2wpp-form__group--error');
      ok = false;
    }

    return ok;
  }

  // ========================
  // SUBMIT
  // ========================
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validate()) return;

    const data = {
      name: inputName.value.trim(),
      phone: inputPhone.value.replace(/\D/g, ''),
      email: inputEmail.value.trim(),
      company: inputCompany.value.trim(),
      id_unidade: inputIdUnidade.value
    };

    send(data);

    const msg = encodeURIComponent(`Olá! Meu nome é ${data.name}. ${b2wpp_defaultMessage}`);

    window.open(
      `https://api.whatsapp.com/send?phone=${b2wpp_whatsappNumber}&text=${msg}`,
      '_blank'
    );

    window.b2wpp_closeModal();
  });

  // ========================
  // FECHAR
  // ========================
  modal?.addEventListener('click', e => {
    if (e.target === modal) window.b2wpp_closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.b2wpp_closeModal();
  });

});
