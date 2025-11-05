<?php $csrf = Csrf::token(); ?>
<h2>Admin</h2>
<p class="small">Klik generate akan <b>menghapus semua</b> soal di set hari ini dan mengganti dengan yang baru.</p>
<button id="generate" class="btn" data-csrf="<?= $csrf ?>">Generate Soal Harian (AI)</button>

<h3 style="margin-top:18px">Kelola Premium</h3>
<form method="post" action="/premium/toggle" onsubmit="event.preventDefault(); fetch('/premium/toggle',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(this))}).then(r=>r.json()).then(()=>alert('OK'));}">
  <input class="input" name="user_id" type="number" placeholder="User ID">
  <button class="btn" type="submit">Toggle Premium</button>
</form>
