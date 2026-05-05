document.addEventListener('DOMContentLoaded', function () {

  // CONFIG
  const b2wpp_whatsappNumber = '556239218600';
  const b2wpp_webhookUrl = 'https://webhookn8n.b2agencia.com.br/webhook/send-lead/landingpage/v2';
  const b2wpp_defaultMessage = 'Vim pelo site e gostaria de saber mais sobre stands e cenografia';

  // ELEMENTOS
  const modal = document.getElementById('b2wpp-modal');
  const form = document.getElementById('b2wpp-form');
  const inputName = document.getElementById('b2wpp-name');
  const inputPhone = document.getElementById('b2wpp-phone');
  const inputEmail = document.getElementById('b2wpp-email');
  const inputCompany = document.getElementById('b2wpp-company');
  const inputIdUnidade = document.getElementById('b2wpp-id-unidade');

  // ========================
  // MODAL
  // ========================
  window.b2wpp_openModal = function (e) {
    e.preventDefault();
    modal.classList.add('b2wpp-modal--active');
  }

  window.b2wpp_closeModal = function () {
    modal.classList.remove('b2wpp-modal--active');
    form.reset();
    clearErrors();
  }

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

  inputPhone.addEventListener('input', function (e) {
    e.target.value = maskPhone(e.target.value);
  });

  // ========================
  // WEBHOOK
  // ========================
  function send(data) {
    fetch(b2wpp_webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {});
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
  modal.addEventListener('click', function (e) {
    if (e.target === modal) window.b2wpp_closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.b2wpp_closeModal();
  });

});
