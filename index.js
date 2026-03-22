class PlayerCard extends HTMLElement {
  connectedCallback() {
    const name     = this.getAttribute('name')  || 'REDACTED';
    const num      = this.getAttribute('num')   || '00';
    const role     = this.getAttribute('role')  || 'Unknown';
    const title    = this.getAttribute('title') || '';
    const bio      = this.getAttribute('bio')   || '';
    const stats    = JSON.parse(this.getAttribute('stats') || '[]');
    const isCoach  = this.hasAttribute('coach');
    const isSub    = this.hasAttribute('sub');
    const isRedact = this.hasAttribute('redacted');
 
    // Build class list for the inner card div
    let classes = 'player-card';
    if (isCoach)  classes += ' coach';
    if (isSub)    classes += ' sub';
    if (isRedact) classes += ' redacted-card';
 
    this.innerHTML = `
      <div class="${classes}">
        <div class="player-num">${num}</div>
        <p class="player-role">${role}</p>
        <h3 class="player-name${isRedact ? ' redact-name' : ''}">${name}</h3>
        <p class="player-title${isRedact ? ' redact' : ''}">${title}</p>
        <p class="player-bio">${bio}</p>
        <div class="player-stats">
          ${stats.map(s => `
            <div class="pstat">
              <span class="pstat-val${isRedact ? ' redact' : ''}">${s.val}</span>
              <span class="pstat-key">${s.key}</span>
            </div>
          `).join('')}
        </div>
        ${isRedact ? '<div class="redacted-stamp">REDACTED</div>' : ''}
      </div>
    `;
  }
}

const EJS_PUBLIC_KEY  = '6ZiacWAyBWuY_D6Fc';
  const EJS_SERVICE_ID  = 'service_kfcp0on';
  const EJS_TEMPLATE_ID = 'template_gh7f579';
 
  emailjs.init({ publicKey: EJS_PUBLIC_KEY });
 
  async function handleSubmit() {
    const btn     = document.querySelector('.form-btn');
    const btnText = document.getElementById('btn-text');
 
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value;
    const msg     = document.getElementById('cf-msg').value.trim();
 
    // Validation
    if (!name || !email || !msg) {
      btnText.textContent = 'FILL IN THE FIELDS, BRONZE';
      btn.style.background = '#7a0010';
      setTimeout(() => {
        btnText.textContent = 'TRANSMIT MESSAGE';
        btn.style.background = '';
      }, 2000);
      return;
    }
 
    btnText.textContent = 'UPLOADING TO MAINFRAME...';
    btn.disabled = true;
 
    try {
      await emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, {
        name:    name,
        email:   email,
        subject: subject || 'No subject selected',
        message: msg,
      });
 
      btn.style.background = '#00ff41';
      btn.style.color = '#000';
      btnText.textContent = 'MESSAGE TRANSMITTED ✓';
 
      // Reset fields
      document.getElementById('cf-name').value    = '';
      document.getElementById('cf-email').value   = '';
      document.getElementById('cf-subject').value = '';
      document.getElementById('cf-msg').value     = '';
 
    } catch (error) {
      btnText.textContent = 'TRANSMIT FAILED (SERVER DIFF)';
      btn.style.background = '#7a0010';
      btn.disabled = false;
    }
  }

customElements.define('player-card', PlayerCard);