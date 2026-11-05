const pages = [...document.querySelectorAll('.page')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const navMenu = document.getElementById('navMenu');
const menuToggle = document.getElementById('menuToggle');
const toast = document.getElementById('toast');
let pendingBooking = null;

function showPage() {
  const id = location.hash.replace('#', '') || 'inicio';
  const target = document.getElementById(id) || document.getElementById('inicio');
  pages.forEach(page => page.classList.toggle('active', page === target));
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === target.id));
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('hashchange', showPage);
menuToggle.addEventListener('click', () => {
  const opened = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
});

document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  document.getElementById('serviceSelect').value = link.dataset.service;
}));

function feedback(id, message, isError = false) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.style.color = isError ? '#a34e45' : '#6c8067';
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

// Demonstração visual: os formulários validam os campos, mas não enviam dados a um servidor.
document.getElementById('registerForm').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  feedback('registerFeedback', 'Cadastro demonstrativo validado!');
  event.currentTarget.reset();
});
document.getElementById('loginForm').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  feedback('loginFeedback', 'Campos validados.');
});

const dateInput = document.getElementById('bookingDate');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
dateInput.min = localToday;
const bookingForm = document.getElementById('bookingForm');
const modal = document.getElementById('confirmModal');
const summary = document.getElementById('bookingSummary');
function formatDate(value) {
  if (!value) return '';
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', {day:'2-digit', month:'long', year:'numeric'});
}
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  pendingBooking = Object.fromEntries(new FormData(bookingForm).entries());
  const rows = [
    ['Serviço', pendingBooking.servico],
    ['Data', formatDate(pendingBooking.data)],
    ['Horário', pendingBooking.horario],
    ['Nome', pendingBooking.nome],
    ['Observações', pendingBooking.observacoes || 'Nenhuma']
  ];
  summary.innerHTML = rows.map(([label, value]) => `<div class="summary-line"><span>${label}</span><strong>${escapeHTML(value)}</strong></div>`).join('');
  feedback('bookingFeedback', 'Confira os dados na janela de confirmação.');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
});
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('editBooking').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.getElementById('confirmBooking').addEventListener('click', () => {
  if (!pendingBooking) return;
  closeModal();
  bookingForm.reset();
  feedback('bookingFeedback', 'Agendamento demonstrativo concluído!');
  pendingBooking = null;
});
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
document.getElementById('year').textContent = new Date().getFullYear();
showPage();
