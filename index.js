document.querySelector('.submit-button').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('modalOverlay').style.display = 'flex';
  });
  
  document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('modalOverlay').style.display = 'none';
  });
  
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });