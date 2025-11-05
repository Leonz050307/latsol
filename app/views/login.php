<?php if (!empty($err)) echo '<div class="card" style="border-color:#fca5a5">' . htmlspecialchars($err) . '</div>'; ?>
<form method="post" class="grid">
  <input class="input" name="email" type="email" placeholder="Email" required>
  <input class="input" name="password" type="password" placeholder="Password" required>
  <button class="btn" type="submit">Masuk</button>
</form>
