document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const btn = document.getElementById('changeBtn');
  let isPointer = false;

  // create a small follower dot
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });

  btn.addEventListener('click', () => {
    isPointer = !isPointer;
    document.body.style.cursor = isPointer ? 'crosshair' : 'default';
    status.textContent = `Cursor: ${isPointer ? 'crosshair' : 'default'}`;
    btn.textContent = isPointer ? 'Reset cursor' : 'Change cursor';
  });
});
