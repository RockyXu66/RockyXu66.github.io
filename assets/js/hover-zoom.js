document.addEventListener('DOMContentLoaded', function() {
  var overlay = null;
  var closing = false;
  var currentEl = null;
  var currentScale = 2.5;

  function updateOverlayPosition() {
    if (!overlay || !currentEl) return;
    var rect = currentEl.getBoundingClientRect();
    var newWidth = rect.width * currentScale;
    var newHeight = rect.height * currentScale;
    overlay.style.transition = 'none';
    overlay.style.width = newWidth + 'px';
    overlay.style.height = newHeight + 'px';
    overlay.style.left = (rect.left + rect.width / 2 - newWidth / 2) + 'px';
    overlay.style.top = (rect.top + rect.height / 2 - newHeight / 2) + 'px';
  }

  window.addEventListener('scroll', updateOverlayPosition);

  function closeOverlay(el) {
    if (overlay && !closing) {
      closing = true;
      var rect = el.getBoundingClientRect();
      overlay.style.transition = 'width 0.3s ease, height 0.3s ease, left 0.3s ease, top 0.3s ease';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
      overlay.style.left = rect.left + 'px';
      overlay.style.top = rect.top + 'px';
      var old = overlay;
      overlay = null;
      currentEl = null;
      setTimeout(function() {
        old.remove();
        closing = false;
      }, 300);
    }
  }

  document.querySelectorAll('.hover-zoom').forEach(function(el) {
    var trigger = el.closest('td') || el;
    trigger.style.cursor = 'pointer';
    trigger.addEventListener('mouseenter', function() {
      if (overlay || closing) return;
      var rect = el.getBoundingClientRect();
      currentEl = el;

      overlay = document.createElement(el.tagName === 'VIDEO' ? 'video' : 'img');
      if (el.tagName === 'VIDEO') {
        overlay.src = el.querySelector('source').src;
        overlay.autoplay = true;
        overlay.loop = true;
        overlay.muted = true;
        overlay.playsInline = true;
      } else {
        overlay.src = el.src;
      }
      overlay.className = 'hover-zoom-overlay';
      overlay.draggable = false;
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
      overlay.style.left = rect.left + 'px';
      overlay.style.top = rect.top + 'px';
      document.body.appendChild(overlay);
      overlay.offsetHeight;
      var newWidth = rect.width * currentScale;
      var newHeight = rect.height * currentScale;
      overlay.style.width = newWidth + 'px';
      overlay.style.height = newHeight + 'px';
      overlay.style.left = (rect.left + rect.width / 2 - newWidth / 2) + 'px';
      overlay.style.top = (rect.top + rect.height / 2 - newHeight / 2) + 'px';

      overlay.addEventListener('mouseleave', function() {
        closeOverlay(el);
      });
      overlay.addEventListener('dragstart', function(e) {
        e.preventDefault();
      });
    });

    trigger.addEventListener('mouseleave', function(e) {
      if (overlay && e.relatedTarget !== overlay) {
        closeOverlay(el);
      }
    });
  });
});
