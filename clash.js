
  function calcKDA(k, d, a) {
    if (d === 0) return { text: 'Perfect KDA', cls: 'perfect' };
    const ratio = (k + a) / d;
    return {
      text: ratio.toFixed(2) + ' KDA',
      cls:  ratio >= 5 ? 'perfect' : ratio >= 3 ? 'great' : ''
    };
  }

  class ClashGame extends HTMLElement {
    connectedCallback() {
      const num      = this.getAttribute('num');
      const result   = this.getAttribute('result') || 'WIN';
      const duration = this.getAttribute('duration');
      const kills    = this.getAttribute('kills');
      const towers   = this.getAttribute('towers');
      const dragons  = this.getAttribute('dragons');
      const baron    = this.getAttribute('baron');
      const players  = JSON.parse(this.getAttribute('players') || '[]');

      const isWin = result.toUpperCase() === 'WIN';

      const summaryItems = [
        { val: duration, key: 'Duration' },
        { val: kills,    key: 'Team kills' },
        { val: towers,   key: 'Towers' },
        { val: dragons,  key: 'Dragons' },
        { val: baron,    key: 'Baron' },
      ];

      const rows = players.map(p => {
        const kda = calcKDA(p.k, p.d, p.a);
        return `
          <tr class="row-win${p.mvp ? ' mvp-row' : ''}">
            <td>
              <div class="player-cell">
                <span class="player-ign">${p.name}${p.mvp ? '<span class="mvp-badge">MVP</span>' : ''}</span>
                <span class="player-champ">${p.champ}</span>
              </div>
            </td>
            <td class="hide-mobile"><span class="role-tag">${p.role}</span></td>
            <td class="stat-val">${p.champ}</td>
            <td class="center">
              <div class="kda-display">
                <span class="kda-nums">
                  <span class="k">${p.k}</span><span class="sep"> / </span><span class="d">${p.d}</span><span class="sep"> / </span><span class="a">${p.a}</span>
                </span>
                <span class="kda-ratio ${kda.cls}">${kda.text}</span>
              </div>
            </td>
            <td class="center hide-mobile"><span class="stat-val${p.mvp ? ' highlight' : ''}">${p.cs}</span></td>
            <td class="center hide-mobile"><span class="stat-val${p.mvp ? ' mvp-val' : ''}">${p.dmg}</span></td>
            <td class="center hide-mobile"><span class="stat-val">${p.gold}</span></td>
          </tr>`;
      }).join('');

      this.innerHTML = `
        <div class="game-block">
          <div class="game-header">
            <span class="game-badge">GAME ${num} — ${result}</span>
            <div class="game-meta">DURATION: ${duration}</div>
          </div>
          <div class="summary-bar">
            ${summaryItems.map(i => `
              <div class="sbar-item">
                <span class="sbar-val">${i.val}</span>
                <span class="sbar-key">${i.key}</span>
              </div>`).join('')}
          </div>
          <table class="scoreboard">
            <thead><tr>
              <th>Player</th>
              <th class="hide-mobile">Role</th>
              <th>Champion</th>
              <th class="center">K / D / A</th>
              <th class="center hide-mobile">CS</th>
              <th class="center hide-mobile">Dmg</th>
              <th class="center hide-mobile">Gold</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }
  }

customElements.define('clash-game', ClashGame);