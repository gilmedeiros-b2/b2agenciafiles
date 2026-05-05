// CONFIG
const b2wpp_whatsappNumber = '556239218600';
const b2wpp_webhookUrl = 'https://webhookn8n.b2agencia.com.br/webhook/send-lead/landingpage/v2';
const b2wpp_defaultMessage = 'Vim pelo site e gostaria de saber mais sobre stands e cenografia';

// MODAL
function b2wpp_openModal(e){
  e.preventDefault();
  document.getElementById('b2wpp-modal').classList.add('b2wpp-modal--active');
}

function b2wpp_closeModal(){
  document.getElementById('b2wpp-modal').classList.remove('b2wpp-modal--active');
  document.getElementById('b2wpp-form').reset();
  b2wpp_clearErrors();
}

// ERROS
function b2wpp_clearErrors(){
  document.querySelectorAll('.b2wpp-form__group')
    .forEach(g => g.classList.remove('b2wpp-form__group--error'));
}

// MÁSCARA
function b2wpp_maskPhone(v){
  v = v.replace(/\D/g,'').substring(0,11);

  if(v.length <= 10){
    v = v.replace(/^(\d{2})(\d)/,'($1) $2');
    v = v.replace(/(\d{4})(\d)/,'$1-$2');
  } else {
    v = v.replace(/^(\d{2})(\d)/,'($1) $2');
    v = v.replace(/(\d{5})(\d)/,'$1-$2');
  }
  return v;
}

document.getElementById('b2wpp-phone')
  .addEventListener('input', e=>{
    e.target.value = b2wpp_maskPhone(e.target.value);
  });

// WEBHOOK
function b2wpp_send(data){
  fetch(b2wpp_webhookUrl,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(data)
  }).catch(()=>{});
}

// VALIDAR
function b2wpp_validate(){
  b2wpp_clearErrors();

  const name = b2wpp_name.value.trim();
  const phone = b2wpp_phone.value.replace(/\D/g,'');
  const email = b2wpp_email.value.trim();
  const company = b2wpp_company.value.trim();

  let ok = true;

  if(!name){
    b2wpp_name.closest('.b2wpp-form__group').classList.add('b2wpp-form__group--error');
    ok=false;
  }

  if(phone.length < 10){
    b2wpp_phone.closest('.b2wpp-form__group').classList.add('b2wpp-form__group--error');
    ok=false;
  }

  if(!email){
    b2wpp_email.closest('.b2wpp-form__group').classList.add('b2wpp-form__group--error');
    ok=false;
  }

  if(!company){
    b2wpp_company.closest('.b2wpp-form__group').classList.add('b2wpp-form__group--error');
    ok=false;
  }

  return ok;
}

// SUBMIT
document.getElementById('b2wpp-form')
.addEventListener('submit', function(e){

  e.preventDefault();
  if(!b2wpp_validate()) return;

  const data = {
    name: b2wpp_name.value.trim(),
    phone: b2wpp_phone.value.replace(/\D/g,''),
    email: b2wpp_email.value.trim(),
    company: b2wpp_company.value.trim(),
    id_unidade: b2wpp_id_unidade.value
  };

  b2wpp_send(data);

  const msg = encodeURIComponent(`Olá! Meu nome é ${data.name}. ${b2wpp_defaultMessage}`);
  window.open(`https://api.whatsapp.com/send?phone=${b2wpp_whatsappNumber}&text=${msg}`,'_blank');

  b2wpp_closeModal();
});

// FECHAR
document.getElementById('b2wpp-modal')
.addEventListener('click',e=>{
  if(e.target.id === 'b2wpp-modal') b2wpp_closeModal();
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape') b2wpp_closeModal();
});
