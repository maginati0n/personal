document.addEventListener('DOMContentLoaded', function () {
  function checkCertificationExpiry() {
    const cards = document.querySelectorAll('.cert-card[data-expires]');
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    cards.forEach(function (card) {
      const expiryDateStr = card.getAttribute('data-expires');
      if (!expiryDateStr || expiryDateStr === 'never') return;

      const expiryDate = new Date(expiryDateStr);
      if (isNaN(expiryDate.getTime())) return;

      // Find the inline expiry-date span inside this card
      const expirySpan = card.querySelector('.expiry-date[data-expires]');

      let statusClass = '';
      let statusText = '';

      if (expiryDate < today) {
        card.classList.add('expired');
        statusClass = 'expired';
        statusText = 'EXPIRED';
        if (expirySpan) expirySpan.classList.add('expired');
      } else if (expiryDate <= threeMonthsFromNow) {
        card.classList.add('expiring-soon');
        statusClass = 'expiring-soon';
        const days = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        statusText = 'EXPIRES IN ' + days + ' DAYS';
        if (expirySpan) expirySpan.classList.add('expiring-soon');
      } else {
        statusClass = 'valid';
        statusText = 'VALID';
        if (expirySpan) expirySpan.classList.add('valid');
      }

      // Append status badge next to the expiry span
      if (expirySpan && statusText) {
        // Avoid duplicating badges on re-runs
        if (!expirySpan.querySelector('.expiry-status')) {
          const badge = document.createElement('span');
          badge.className = 'expiry-status ' + statusClass;
          badge.textContent = statusText;
          expirySpan.appendChild(badge);
        }
      }
    });
  }

  checkCertificationExpiry();
});
