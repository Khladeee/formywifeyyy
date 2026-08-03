  // ---- PIN LOCK ----
  // Change this to whatever code you want her to enter (e.g. an anniversary "0714").
  const CORRECT_PIN = "032726";

  let enteredPin = "";
  const pinDots = document.querySelectorAll('#pinDots span');
  const lockEl = document.getElementById('lock');
  const lockError = document.getElementById('lockError');
  const lockIcon = document.getElementById('lockIcon');
  const lockSuccess = document.getElementById('lockSuccess');
  const keypad = document.getElementById('keypad');

  function renderDots(){
    pinDots.forEach((dot, i)=>{
      dot.classList.toggle('filled', i < enteredPin.length);
    });
  }

  function checkPin(){
    if(enteredPin === CORRECT_PIN){
      lockSuccess.classList.add('show');
      setTimeout(()=>{
        lockEl.classList.add('hidden');
        document.body.classList.remove('locked');
      }, 550);
    } else {
      lockError.classList.add('show');
      lockEl.querySelector('.lock-title').parentElement === lockEl; // no-op, keep structure
      lockEl.classList.add('lock-shake');
      lockIcon.classList.add('pop');
      setTimeout(()=>{
        lockEl.classList.remove('lock-shake');
        lockIcon.classList.remove('pop');
        enteredPin = "";
        renderDots();
      }, 400);
    }
  }

  keypad.addEventListener('click', e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const key = btn.dataset.key;
    lockError.classList.remove('show');

    if(key === 'clear'){
      enteredPin = "";
      renderDots();
      return;
    }
    if(key === 'back'){
      enteredPin = enteredPin.slice(0, -1);
      renderDots();
      return;
    }
    if(enteredPin.length < CORRECT_PIN.length){
      enteredPin += key;
      renderDots();
      if(enteredPin.length === CORRECT_PIN.length){
        setTimeout(checkPin, 150);
      }
    }
  });

  // also allow physical keyboard number entry
  document.addEventListener('keydown', e=>{
    if(document.body.classList.contains('locked') === false) return;
    if(document.activeElement === document.getElementById('lockHint')) return;
    if(/^[0-9]$/.test(e.key) && enteredPin.length < CORRECT_PIN.length){
      enteredPin += e.key;
      renderDots();
      lockError.classList.remove('show');
      if(enteredPin.length === CORRECT_PIN.length){
        setTimeout(checkPin, 150);
      }
    } else if(e.key === 'Backspace'){
      enteredPin = enteredPin.slice(0, -1);
      renderDots();
    }
  });

  // floating petals
  const petalHost = document.getElementById('petals');
  for(let i=0;i<18;i++){
    const p = document.createElement('div');
    p.className='petal';
    p.style.left = Math.random()*100+'%';
    p.style.animationDuration = (8+Math.random()*10)+'s';
    p.style.animationDelay = (Math.random()*10)+'s';
    petalHost.appendChild(p);
  }

  // gallery: single feature photo (peonies & lilies)
  const gallery = document.getElementById('gallery');
  const featureSlot = document.createElement('label');
  featureSlot.className='photo-slot photo-feature';
  featureSlot.innerHTML = `
    <input type="file" accept="image/*">
    <span class="plus">+</span>
    <span class="hint">a picture of us</span>
    <img src="us.png" alt="a picture of us">
    <button type="button" class="remove">×</button>
  `;
  featureSlot.classList.add('filled');
  {
    const input = featureSlot.querySelector('input');
    const img = featureSlot.querySelector('img');
    const removeBtn = featureSlot.querySelector('.remove');

    input.addEventListener('change', e=>{
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = ev=>{
        img.src = ev.target.result;
        featureSlot.classList.add('filled');
      };
      reader.readAsDataURL(file);
    });

    removeBtn.addEventListener('click', e=>{
      e.preventDefault();
      e.stopPropagation();
      img.src='';
      input.value='';
      featureSlot.classList.remove('filled');
    });
  }
  gallery.appendChild(featureSlot);

  // falling hearts rain — photo slide + letters slide
  function spawnHeartRain(hostId, count, color){
    const host = document.getElementById(hostId);
    if(!host) return;
    for(let i=0;i<count;i++){
      const h = document.createElement('div');
      h.className='falling-heart';
      h.textContent = '♡';
      h.style.left = Math.random()*100+'%';
      h.style.fontSize = (0.8+Math.random()*1.1)+'rem';
      h.style.animationDuration = (6+Math.random()*8)+'s';
      h.style.animationDelay = (Math.random()*8)+'s';
      if(color) h.style.color = color;
      host.appendChild(h);
    }
  }
  spawnHeartRain('heartsGallery', 14);
  spawnHeartRain('heartsLetters', 16, 'var(--rose-light)');

  // wax seal opens the letters
  const seal = document.getElementById('seal');
  const sealStage = document.getElementById('sealStage');
  const lettersList = document.getElementById('lettersList');
  seal.addEventListener('click', ()=>{
    seal.classList.add('opened');
    setTimeout(()=>{
      sealStage.classList.add('hide');
      lettersList.classList.add('show');
    }, 350);
  });

  // proposal slide
  const propStage1 = document.getElementById('propStage1');
  const propStage2 = document.getElementById('propStage2');
  const propFinal = document.getElementById('propFinal');
  const propYes1 = document.getElementById('propYes1');
  const propNo1 = document.getElementById('propNo1');
  const propYes2 = document.getElementById('propYes2');
  const proposalSection = document.getElementById('proposalSection');

  function dodge(){
    const container = propNo1.parentElement;
    const maxX = Math.max(container.clientWidth - propNo1.clientWidth - 20, 40);
    const x = (Math.random()-0.5) * maxX;
    const y = (Math.random()-0.5) * 50;
    propNo1.style.position = 'relative';
    propNo1.style.transform = `translate(${x}px, ${y}px)`;
  }
  propNo1.addEventListener('mouseenter', dodge);
  propNo1.addEventListener('touchstart', e=>{ e.preventDefault(); dodge(); });

  propYes1.addEventListener('click', ()=>{
    propStage1.style.display = 'none';
    propStage2.style.display = 'flex';
  });

  function spawnConfetti(){
    const hearts = ['♡','❀','✿'];
    for(let i=0;i<28;i++){
      const h = document.createElement('div');
      h.className = 'confetti-heart';
      h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
      h.style.left = Math.random()*100+'%';
      h.style.fontSize = (0.9+Math.random()*1.3)+'rem';
      h.style.animationDuration = (3+Math.random()*3)+'s';
      h.style.animationDelay = (Math.random()*1.2)+'s';
      proposalSection.appendChild(h);
      setTimeout(()=>h.remove(), 7500);
    }
  }

  propYes2.addEventListener('click', ()=>{
    propStage2.style.display = 'none';
    propFinal.style.display = 'flex';
    spawnConfetti();
  });

  // scroll reveal
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold: 0.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
