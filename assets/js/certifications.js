document.addEventListener('DOMContentLoaded', function() {
    function checkCertificationExpiry() {
        const certItems = document.querySelectorAll('.cert-item[data-expires]');
        const today = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(today.getMonth() + 3);
        
        certItems.forEach(function(item) {
            const expiryDateStr = item.getAttribute('data-expires');
            const expiryDateElement = item.querySelector('.expiry-date');
            
            // Skip items that never expire
            if (expiryDateStr === 'never' || expiryDateStr === 'no-expiration') {
                if (expiryDateElement) {
                    expiryDateElement.classList.add('valid');
                }
                return;
            }
            
            const expiryDate = new Date(expiryDateStr);
            
            // Check if the date is valid
            if (isNaN(expiryDate.getTime())) {
                console.warn('Invalid expiry date format:', expiryDateStr);
                return;
            }
            
            // Add status indicator
            let statusText = '';
            let statusClass = '';
            
            if (expiryDate < today) {
                // Expired
                item.classList.add('expired');
                statusClass = 'expired';
                statusText = 'EXPIRED';
                if (expiryDateElement) {
                    expiryDateElement.classList.add('expired');
                    // Update text to show "Expired" instead of "Expires"
                    expiryDateElement.innerHTML = expiryDateElement.innerHTML.replace('Expires:', 'Expired:');
                }
            } else if (expiryDate <= threeMonthsFromNow) {
                // Expiring soon (within 3 months)
                item.classList.add('expiring-soon');
                statusClass = 'expiring-soon';
                const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                statusText = `EXPIRES IN ${daysUntilExpiry} DAYS`;
                if (expiryDateElement) {
                    expiryDateElement.classList.add('expiring-soon');
                }
            } else {
                // Valid
                statusClass = 'valid';
                statusText = 'VALID';
                if (expiryDateElement) {
                    expiryDateElement.classList.add('valid');
                }
            }
            
            // Add status badge
            if (statusText && expiryDateElement) {
                const statusBadge = document.createElement('span');
                statusBadge.className = `expiry-status ${statusClass}`;
                statusBadge.textContent = statusText;
                expiryDateElement.appendChild(statusBadge);
            }
        });
    }
    
    // Run the check when page loads
    checkCertificationExpiry();
    
    // Optional: Re-check every hour (useful for long-running pages)
    setInterval(checkCertificationExpiry, 3600000); // 1 hour = 3600000ms
});