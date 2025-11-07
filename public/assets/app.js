async function post(url, data) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data),
  });
  return await r.json();
}

window.addEventListener('DOMContentLoaded', () => {
  const gbtn = document.querySelector('#generate');
  if (gbtn) {
    gbtn.addEventListener('click', async () => {
      gbtn.disabled = true;
      gbtn.textContent = 'Generating…';
      const res = await post('/admin/generate', { csrf: gbtn.dataset.csrf });
      alert(res.ok ? ('OK, ' + res.count + ' soal dibuat') : res.msg || 'Error');
      location.reload();
    });
  }

  const startBtn = document.querySelector('#start');
  if (startBtn) {
    startBtn.addEventListener('click', async () => {
      const res = await post('/attempt/start', {});
      if (!res.ok) {
        alert(res.msg || 'Error');
        return;
      }
      document.body.dataset.attempt = res.attempt_id;
      document.querySelector('#attempt-section').classList.remove('hidden');
      startBtn.remove();
    });
  }

  const submitBtn = document.querySelector('#submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const answers = {};
      document.querySelectorAll('[data-qid]').forEach(el => {
        const id = el.dataset.qid;
        const qt = el.dataset.qtype;
        if (qt === 'single') {
          const v = el.querySelector('input[type=radio]:checked');
          if (v) {
            answers[id] = { key: v.value };
          }
        } else if (qt === 'complex') {
          const rows = [];
          el.querySelectorAll('tr[data-row]').forEach(tr => {
            const a = tr.querySelector('input[value="A"]').checked;
            const b = tr.querySelector('input[value="B"]').checked;
            rows.push({ A: a, B: b });
          });
          answers[id] = { rows };
        } else {
          const t = el.querySelector('input[type=text]').value || '';
          answers[id] = { text: t };
        }
      });
      const res = await post('/attempt/submit', {
        attempt_id: document.body.dataset.attempt || 0,
        answers: JSON.stringify(answers),
        duration: Math.floor(performance.now() / 1000),
      });
      if (res.ok) {
        alert('Skor: ' + res.score);
        location.href = '/';
      } else {
        alert(res.msg || 'Gagal mengumpulkan');
      }
    });
  }
});
