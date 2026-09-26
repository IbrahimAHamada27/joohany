// =========================================================
//  YOUSEF & BASBOUSA - ROMANTIC LOGIC & SPOTIFY PLAYER
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Constants & Config ---
  const RELATIONSHIP_DATE = new Date(2025, 3, 1, 0, 0, 0); // Month is 0-indexed: April 1, 2025
  const BIRTHDAY_DATE_STR = '2007-04-01'; // April 1, 2007
  
  // --- DOM Elements ---
  const lockScreen = document.getElementById('lock-screen');
  const mainContent = document.getElementById('main-content');
  const passcodeInput = document.getElementById('passcode-input');
  const submitPasscodeBtn = document.getElementById('submit-passcode');
  const lockErrorMsg = document.getElementById('lock-error-msg');
  const introVideo = document.getElementById('intro-video');
  const videoSoundToggle = document.getElementById('video-sound-toggle');
  const videoSoundIcon = document.getElementById('video-sound-icon');
  const videoSoundText = document.getElementById('video-sound-text');

  // Video Sound Toggle Controls
  function updateVideoSoundUI(isMuted) {
    if (isMuted) {
      videoSoundToggle.classList.add('muted');
      videoSoundIcon.className = 'fa-solid fa-volume-xmark';
      videoSoundText.textContent = 'تشغيل الصوت 🔊';
    } else {
      videoSoundToggle.classList.remove('muted');
      videoSoundIcon.className = 'fa-solid fa-volume-high';
      videoSoundText.textContent = 'كتم الصوت 🔇';
    }
  }

  function toggleVideoSound(e) {
    if (e) e.stopPropagation();
    introVideo.muted = !introVideo.muted;
    if (!introVideo.muted && introVideo.paused) {
      introVideo.play().catch(() => {});
    }
    updateVideoSoundUI(introVideo.muted);
  }

  if (videoSoundToggle) {
    videoSoundToggle.addEventListener('click', toggleVideoSound);
  }

  if (introVideo) {
    // Click on video to toggle sound or play
    introVideo.addEventListener('click', () => {
      toggleVideoSound();
    });

    // Try playing unmuted, fallback to muted if browser blocks
    introVideo.muted = false;
    introVideo.play().then(() => {
      updateVideoSoundUI(false);
    }).catch(() => {
      // Browser blocked unmuted autoplay, start muted
      introVideo.muted = true;
      introVideo.play().catch(() => {});
      updateVideoSoundUI(true);
    });
  }

  // Audio & Player Elements
  const audio = document.getElementById('romantic-audio');
  const vinylDisk = document.getElementById('vinyl-disk');
  const playPauseBtn = document.getElementById('btn-play-pause');
  const playPauseIcon = document.getElementById('play-pause-icon');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const speedBtn = document.getElementById('btn-speed');
  const speedIndicator = document.getElementById('speed-indicator');
  const loopBtn = document.getElementById('btn-loop');
  const progressBar = document.getElementById('audio-progress');
  const progressWrapper = document.getElementById('progress-wrapper');
  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeMuteBtn = document.getElementById('volume-mute-btn');
  const playerVolumeIcon = document.getElementById('player-volume-icon');
  const toggleAudioNavBtn = document.getElementById('toggle-audio-btn');
  const navSoundIcon = document.getElementById('nav-sound-icon');

  // Counters
  const cntDays = document.getElementById('cnt-days');
  const cntHours = document.getElementById('cnt-hours');
  const cntMinutes = document.getElementById('cnt-minutes');
  const cntSeconds = document.getElementById('cnt-seconds');
  const heartbeatsEstimate = document.getElementById('heartbeats-estimate');
  const bdayCountdownText = document.getElementById('bday-countdown-text');

  // --- PASSCODE / UNLOCK LOGIC ---
  const dateDayInput = document.getElementById('date-day');
  const dateMonthInput = document.getElementById('date-month');
  const dateYearInput = document.getElementById('date-year');

  const validKeywords = [
    'بسبوستي', 'بسبوسة', 'يوسفتي', 'بحبك', 'يوسف', 'basbousa', 'basbousty',
    '01/04/2025', '1/4/2025', '01042025', '142025', '2025-04-01'
  ];

  function normalizeInput(val) {
    if (!val) return '';
    return val.trim()
      .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)) // Convert Arabic numbers to English
      .replace(/[\s\-\.\\]/g, '/');
  }

  // Auto-focus next input when typing date
  if (dateDayInput && dateMonthInput && dateYearInput) {
    dateDayInput.addEventListener('input', () => {
      if (dateDayInput.value.length >= 2) dateMonthInput.focus();
    });
    dateMonthInput.addEventListener('input', () => {
      if (dateMonthInput.value.length >= 2) dateYearInput.focus();
    });
  }

  function handleUnlock() {
    const rawKeyword = passcodeInput ? passcodeInput.value.trim() : '';
    const cleanKeyword = rawKeyword.toLowerCase();
    
    const day = dateDayInput ? dateDayInput.value.trim().replace(/^0+/, '') : '';
    const month = dateMonthInput ? dateMonthInput.value.trim().replace(/^0+/, '') : '';
    const year = dateYearInput ? dateYearInput.value.trim() : '';

    // Check if date is 1/4/2025 (or 01/04/2025)
    const isDateValid = (day === '1' || day === '01') && (month === '4' || month === '04') && (year === '2025' || year === '25');

    // Check if keyword is "بسبوستي" or matches list
    const isKeywordValid = validKeywords.some(k => cleanKeyword.includes(k) || rawKeyword.includes(k));

    if (isDateValid || isKeywordValid) {
      // Success!
      lockErrorMsg.textContent = '';
      playUnlockSound();
      triggerConfettiShower();
      
      lockScreen.classList.add('fade-out');
      if (introVideo) {
        introVideo.pause();
        introVideo.muted = true;
      }
      setTimeout(() => {
        lockScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Start romantic background music with gesture
        startMusicWithFadeIn();
      }, 700);

    } else {
      // Wrong passcode
      lockErrorMsg.textContent = '❌ التاريخ أو كلمة السر غير صحيحة.. حاولي تاني يا قلبي ❤️';
      if (passcodeInput) {
        passcodeInput.classList.add('shake');
        setTimeout(() => passcodeInput.classList.remove('shake'), 500);
      }
    }
  }

  if (submitPasscodeBtn) {
    submitPasscodeBtn.addEventListener('click', handleUnlock);
  }
  
  [passcodeInput, dateDayInput, dateMonthInput, dateYearInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUnlock();
      });
    }
  });


  // --- AUDIO SYNTH FOR UNLOCK SOUND (Web Audio API) ---
  function playUnlockSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.6);
      });
    } catch (e) {
      console.log('Audio Context error ignored', e);
    }
  }


  // --- SPOTIFY MUSIC PLAYER CONTROLS ---
  function startMusicWithFadeIn() {
    audio.volume = 0;
    audio.play().then(() => {
      vinylDisk.classList.add('playing');
      updatePlayPauseState(true);
      let vol = 0;
      const fadeInInterval = setInterval(() => {
        if (vol < 0.9) {
          vol += 0.05;
          audio.volume = Math.min(vol, 1);
        } else {
          clearInterval(fadeInInterval);
        }
      }, 100);
    }).catch(err => {
      console.log('Audio autoplay prevented, ready on manual play', err);
      updatePlayPauseState(false);
    });
  }

  function updatePlayPauseState(isPlaying) {
    if (isPlaying) {
      playPauseIcon.className = 'fa-solid fa-pause';
      vinylDisk.classList.add('playing');
      navSoundIcon.className = 'fa-solid fa-volume-high';
    } else {
      playPauseIcon.className = 'fa-solid fa-play';
      vinylDisk.classList.remove('playing');
      navSoundIcon.className = 'fa-solid fa-volume-xmark';
    }
  }

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      updatePlayPauseState(true);
    } else {
      audio.pause();
      updatePlayPauseState(false);
    }
  });

  toggleAudioNavBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      updatePlayPauseState(true);
    } else {
      audio.pause();
      updatePlayPauseState(false);
    }
  });

  // Prev: Reset audio
  prevBtn.addEventListener('click', () => {
    audio.currentTime = 0;
    if (audio.paused) audio.play();
    updatePlayPauseState(true);
  });

  // Next: Skip 10 seconds forward
  nextBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || 1000);
  });

  // Speed controls: 1.0x -> 1.25x -> 1.5x -> 0.75x -> 1.0x
  const speeds = [1.0, 1.25, 1.5, 0.75];
  let currentSpeedIdx = 0;
  speedBtn.addEventListener('click', () => {
    currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
    const speed = speeds[currentSpeedIdx];
    audio.playbackRate = speed;
    speedIndicator.textContent = speed + 'x';
  });

  // Loop button
  loopBtn.addEventListener('click', () => {
    audio.loop = !audio.loop;
    loopBtn.classList.toggle('active', audio.loop);
  });

  // Update Progress Bar
  function formatTime(sec) {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalDurationEl.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audio.duration);
  });

  // Progress Bar click to seek
  progressWrapper.addEventListener('click', (e) => {
    const rect = progressWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    if (audio.duration) {
      audio.currentTime = (clickX / width) * audio.duration;
    }
  });

  // Volume Slider
  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    updateVolumeIcon(audio.volume);
  });

  volumeMuteBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
      audio.dataset.prevVol = audio.volume;
      audio.volume = 0;
      volumeSlider.value = 0;
    } else {
      const prev = parseFloat(audio.dataset.prevVol || 1);
      audio.volume = prev;
      volumeSlider.value = prev;
    }
    updateVolumeIcon(audio.volume);
  });

  function updateVolumeIcon(vol) {
    if (vol === 0) {
      playerVolumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (vol < 0.5) {
      playerVolumeIcon.className = 'fa-solid fa-volume-low';
    } else {
      playerVolumeIcon.className = 'fa-solid fa-volume-high';
    }
  }


  // --- LIVE LOVE COUNTER LOGIC ---
  function updateLoveCounter() {
    const now = new Date();
    let diffMs = now - RELATIONSHIP_DATE;
    
    // In case relationship date is in the future relative to current machine time or past
    const isPast = diffMs >= 0;
    diffMs = Math.abs(diffMs);

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    cntDays.textContent = days;
    cntHours.textContent = hours < 10 ? '0' + hours : hours;
    cntMinutes.textContent = minutes < 10 ? '0' + minutes : minutes;
    cntSeconds.textContent = seconds < 10 ? '0' + seconds : seconds;

    // Approximate heartbeats: 75 beats per minute
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const beats = (totalMinutes * 75).toLocaleString('ar-EG');
    heartbeatsEstimate.textContent = beats;

    // Birthday countdown calculation (Next April 1)
    const currentYear = now.getFullYear();
    let nextBday = new Date(currentYear, 3, 1); // April 1 of current year
    if (now > nextBday) {
      nextBday = new Date(currentYear + 1, 3, 1);
    }
    const bdayDiff = nextBday - now;
    const bdayDays = Math.floor(bdayDiff / (1000 * 60 * 60 * 24));
    const bdayHours = Math.floor((bdayDiff / (1000 * 60 * 60)) % 24);

    if (bdayDays === 0) {
      bdayCountdownText.textContent = '🎉 اليوم عيد ميلادك يا بسبوسة! كل سنة وإنتي حبيبتي وروحي!';
    } else {
      bdayCountdownText.textContent = `فاضل ${bdayDays} يوم و ${bdayHours} ساعة على عيد ميلاد أغلى بسبوسة في الكون (1 أبريل)! 🎂`;
    }
  }

  setInterval(updateLoveCounter, 1000);
  updateLoveCounter();


  // --- LOVE LETTERS MODAL DATA & FUNCTIONS ---
  const letterContents = {
    1: {
      title: "إلى بنت خالتي، وصاحبة عمري، وحبيبة قلبي ❤️",
      body: `يا بسبوستي الغالية..

لما بقعد مع نفسي وأفتكر كل السنين اللي فاتت، بحمد ربنا ألف مرة إنه خلقك وبقى ليكي نصيب في حياتي.
إنتي مكنتيش بس بنت خالتي اللي كبرت قدام عيني.. إنتي كنتي ومزلتي أقرب صاحبة لقلبي، البنت اللي من وسط كل الناس هي الوحيدة اللي بتفهم نظرتي من غير ما أنطق بحرف.

يوم ما اتكلمنا وبقينا لبعض، حسيت إن روحي رجعتلي وإن الدنيا كلها فتحتلي أبوابها.
وعد مني يا بسبوسة، هفضل جنبك وسندك وضهرك وعينيكي اللي بتشوفي بيها.. بحبك يا روح قلبي!`
    },
    2: {
      title: "ليه بسبوسة بالذات هي كل دنيتي؟ ✨",
      body: `عارفة يا بسبوسة ليه إنتي بالذات؟

عشان مفيش حد في الكون ده كله عنده نفس نقاء قلبك ولا طيبة روحك.
ضحكتك إنتي بالذات لما بضحكيها، كأن الدنيا كلها بتضحكلي. حتى عصبيتك وخوفك وزعلك الرقيق.. كل تفصيلة فيكي بتخليني أعشقك أكتر من اليوم اللي قبله.

إنتي السكر اللي حلى مرار أي يوم صعب، والبنت اللي مستعد أحارب الدنيا كلها عشان بس أشوف ابتسامتها.
بحبك يا أحلى بسبوسة في الوجود!`
    },
    3: {
      title: "حلم خطوبتنا وبيتنا الصغير القريب إن شاء الله 💍",
      body: `حبيبتي وخطيبتي المستقبلية القريبة أوي..

كل يوم بيمر، عيني مش شايفة غير اللحظة اللي هلبسك فيها الدبلة قدام كل الدنيا، وأقول للناس دي مراتي وحبيبتي وأميرة قلبي.
مستني اليوم اللي يجمعنا فيه بيت واحد، نعمل فيه كل الذكريات اللي حلمنا بيها.. نقعد نسهر، نضحك، ونعمل فنجان الشاي ونتفرج على مسلسلاتنا سوا.

الخطوبة قربت يا قلبي، والعهد اللي بيني وبينك عهد رجال.. مش هسيب إيدك أبداً.`
    },
    4: {
      title: "1 أبريل.. تاريخ ميلادك وتاريخ حبنا 🎂💍",
      body: `يا أعظم صدفة في التاريخ..

يوم 1 أبريل 2007 اتولدت فيه البنت اللي كان مقدر ليها تسكن قلبي وتملكه.
ويوم 1 أبريل 2025 كان اليوم اللي أعلنا فيه حبنا وبقينا لبعض رسمي.

اليوم ده مش مجرد تاريخ في النتيجة، ده يوم ميلاد روحي وبداية عمري الحقيقي. 
كل 1 أبريل وإنتي معايا ومنورة دنيتي، وكل سنة وحبنا بيكبر ويزيد يا ملكة قلبي!`
    }
  };

  window.openLetter = function(id) {
    const data = letterContents[id];
    if (!data) return;
    document.getElementById('modal-letter-title').textContent = data.title;
    document.getElementById('modal-letter-body').textContent = data.body;
    document.getElementById('letter-modal').classList.add('active');
    triggerMiniHearts();
  };

  window.closeLetterModal = function() {
    document.getElementById('letter-modal').classList.remove('active');
  };


  // --- POEMS SLIDER ---
  let currentPoem = 0;
  const poemSlides = document.querySelectorAll('.poem-slide');
  const poemDots = document.querySelectorAll('.p-dot');

  window.setPoem = function(idx) {
    poemSlides.forEach(s => s.classList.remove('active'));
    poemDots.forEach(d => d.classList.remove('active'));
    currentPoem = idx;
    if (poemSlides[idx]) poemSlides[idx].classList.add('active');
    if (poemDots[idx]) poemDots[idx].classList.add('active');
  };

  setInterval(() => {
    currentPoem = (currentPoem + 1) % poemSlides.length;
    setPoem(currentPoem);
  }, 6000);


  // --- GALLERY FILTER & LIGHTBOX ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Zoomable Image Lightbox
  const imageModal = document.getElementById('image-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  document.querySelectorAll('.zoomable-img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      const footerTitle = img.closest('.polaroid-inner')?.querySelector('.p-title')?.textContent || 'يوسف & بسبوسة ❤️';
      lightboxCaption.textContent = footerTitle;
      imageModal.classList.add('active');
    });
  });

  window.closeImageModal = function() {
    imageModal.classList.remove('active');
  };

  // Like Buttons on Polaroids
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('liked');
      if (btn.classList.contains('liked')) {
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 }
        });
      } else {
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      }
    });
  });


  // --- REASON GENERATOR ---
  const reasons = [
    "عشان ضحكتك بتخلي كل هموم الدنيا تروح في ثانية واحدة... ❤️",
    "عشان عينيكي فيها حنية ودفء ملوش مثيل في الدنيا دي كلها. ✨",
    "عشان إنتي بنت خالتي وصاحبة عمري اللي ملهاش بديل في قلبي. 🌹",
    "عشان لما بتكوني جنبي بحس إني ملكت الدنيا كلها ومش عايز حاجة تانية. 👑",
    "عشان إنتي بتفهميني من نظرة عين من غير ما أتكلم نص كلمة. 🥰",
    "عشان طيبة قلبك ونقاء روحك اللي عمري ما شفت زيهم عند حد. 💖",
    "عشان إنتي السكر والعسل اللي حلى كل أيامي وسنيني يا بسبوستي. 🍯",
    "عشان بحلم باليوم اللي أشوفك فيه لابسة الفستان الأبيض ونكون في بيتنا سوا. 💍",
    "عشان إنتي الوحيدة اللي قادرة تطمن قلبي وتخليني أسعد إنسان في الوجود! 💕"
  ];

  let reasonIdx = 0;
  const reasonDisplay = document.getElementById('reason-display');
  const nextReasonBtn = document.getElementById('btn-next-reason');

  nextReasonBtn.addEventListener('click', () => {
    reasonIdx = (reasonIdx + 1) % reasons.length;
    reasonDisplay.style.opacity = 0;
    setTimeout(() => {
      reasonDisplay.textContent = reasons[reasonIdx];
      reasonDisplay.style.opacity = 1;
      triggerMiniHearts();
    }, 200);
  });


  // --- SURPRISE LOVE MODAL ---
  const surpriseBtn = document.getElementById('surprise-btn');
  const surpriseModal = document.getElementById('surprise-modal');

  surpriseBtn.addEventListener('click', () => {
    surpriseModal.classList.add('active');
    triggerConfettiShower();
  });

  window.closeSurpriseModal = function() {
    surpriseModal.classList.remove('active');
  };


  // --- CONFETTI & HEARTS VISUAL FX ---
  window.triggerConfettiShower = function() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#c9184a', '#ffb703', '#ffffff', '#ff758f']
    });
  };

  function triggerMiniHearts() {
    if (typeof confetti !== 'function') return;
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      shapes: ['circle'],
      colors: ['#ff4d6d', '#ff758f', '#ffe494']
    });
  }


  // --- BACKGROUND PARTICLES CANVAS (Floating Glowing Hearts) ---
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class HeartParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20 + Math.random() * 50;
      this.size = Math.random() * 12 + 6;
      this.speedY = Math.random() * 1 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.rot = Math.random() * Math.PI;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.color = Math.random() > 0.3 ? '#ff4d6d' : '#ffb703';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rot += this.rotSpeed;
      if (this.y < -30) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      // Draw Heart Shape
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, (this.size + topCurveHeight) / 1.2, 0, this.size);
      ctx.bezierCurveTo(0, (this.size + topCurveHeight) / 1.2, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 35; i++) {
    const p = new HeartParticle();
    p.y = Math.random() * canvas.height; // Distribute initially
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

});
