/**
 * Jaiswal Gypsum & Interior Solutions
 * Interactive Web Application JavaScript
 * Audio Guide (SpeechSynthesis) + Video Player Modal + Web Audio API Effects + Calculator
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Web Audio API Sound Effects Synthesizer --- */
    let audioCtx = null;
    let soundEnabled = true;

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play subtle click sound on interaction
    function playBeep(freq = 440, duration = 0.08, type = 'sine') {
        if (!soundEnabled) return;
        try {
            initAudioContext();
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log('Audio FX error:', e);
        }
    }

    // Global sound toggle
    const globalAudioBtn = document.getElementById('global-audio-toggle');
    globalAudioBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            globalAudioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            globalAudioBtn.style.color = 'var(--primary-gold)';
            playBeep(600, 0.1);
        } else {
            globalAudioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            globalAudioBtn.style.color = 'var(--text-muted)';
        }
    });

    /* --- 2. Interactive AI Voice Guide (Audio Assistant) --- */
    const synth = window.speechSynthesis;
    let selectedLang = 'hi-IN';
    let currentTopic = 'intro';
    let isSpeaking = false;

    const audioData = {
        intro: {
            title: 'Why Choose Jaiswal Gypsum?',
            hi: 'Namaskar! Jaiswal Gypsum mein aapka swagat hai. Hum aapko dete hain 100 percent super smooth paint-ready plaster aur modern POP false ceiling solutions. Hamara plaster crack-free hota hai aur cement plaster ke mukable aadhay samay mein tayar ho jata hai.',
            en: 'Welcome to Jaiswal Gypsum. We provide 100 percent smooth paint-ready Gypsum Plaster and modern POP false ceiling solutions. Our plaster is crack-free and cures twice as fast as sand cement plaster.'
        },
        plaster_vs_cement: {
            title: 'Gypsum Plaster vs Sand Plaster',
            hi: 'Jaiswal Gypsum Plaster lagane ke baad kisi bhi curing ya pani chidakne ki zarurat nahi hoti. Isme shrinkage cracks nahi aate, surface mirror smooth hoti hai aur 72 ghante mein paint hone ke liye tayar ho jata hai.',
            en: 'With Jaiswal Gypsum Plaster, no water curing is needed. It prevents shrinkage cracks, gives a smooth mirror finish, and is ready for painting within 72 hours.'
        },
        false_ceiling: {
            title: 'POP & False Ceiling Designs',
            hi: 'Humare POP False Ceiling designs aapke living room aur bedroom ko luxury look dete hain. Hum heavy-duty GI channels aur moisture-resistant gypsum boards ka prayog karte hain jo cove LED lights ke sath behad khubsurat lagte hain.',
            en: 'Our POP false ceiling designs provide a luxury aesthetic for your living rooms and bedrooms using heavy-duty GI metal framing and moisture-resistant gypsum boards with ambient cove LED lighting.'
        },
        fire_safety: {
            title: 'Fire Safety & Thermal Comfort',
            hi: 'Gypsum mein natural crystal water hota hai jo aag se suraksha deta hai aur thermal insulation pradan karta hai. Isse aapka kamra garmiyon mein thanda aur sardiyo mein garam rehta hai, jisse AC bill kam aata hai.',
            en: 'Gypsum contains natural crystal water providing fire resistance and thermal insulation. It keeps your rooms cooler in summer, significantly reducing AC power bills.'
        }
    };

    const playPauseBtn = document.getElementById('audio-play-pause-btn');
    const audioBtnIcon = document.getElementById('audio-btn-icon');
    const nowPlayingText = document.getElementById('audio-now-playing');
    const transcriptBox = document.getElementById('audio-transcript-box');
    const soundwaveAnim = document.getElementById('soundwave-anim');
    const topicCards = document.querySelectorAll('.topic-card');
    const langBtns = document.querySelectorAll('.lang-btn');
    const heroVoiceBtn = document.getElementById('btn-play-voiceover');

    function speakCurrentTopic() {
        if (!synth) {
            alert('Speech synthesis is not supported in this browser.');
            return;
        }

        synth.cancel(); // stop previous speech

        const topicObj = audioData[currentTopic];
        const textToSpeak = selectedLang === 'hi-IN' ? topicObj.hi : topicObj.en;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = selectedLang;
        utterance.rate = 0.95; // slightly relaxed pace

        // Try to pick a natural voice if available
        const voices = synth.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes(selectedLang.slice(0,2)));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            isSpeaking = true;
            audioBtnIcon.className = 'fa-solid fa-pause';
            soundwaveAnim.classList.add('playing');
        };

        utterance.onend = () => {
            isSpeaking = false;
            audioBtnIcon.className = 'fa-solid fa-play';
            soundwaveAnim.classList.remove('playing');
        };

        utterance.onerror = () => {
            isSpeaking = false;
            audioBtnIcon.className = 'fa-solid fa-play';
            soundwaveAnim.classList.remove('playing');
        };

        synth.speak(utterance);
    }

    function toggleAudioPlayback() {
        playBeep(520, 0.1);
        if (isSpeaking) {
            synth.cancel();
            isSpeaking = false;
            audioBtnIcon.className = 'fa-solid fa-play';
            soundwaveAnim.classList.remove('playing');
        } else {
            speakCurrentTopic();
        }
    }

    playPauseBtn.addEventListener('click', toggleAudioPlayback);

    if (heroVoiceBtn) {
        heroVoiceBtn.addEventListener('click', () => {
            currentTopic = 'intro';
            updateTopicUI();
            speakCurrentTopic();
            document.getElementById('audio-guide').scrollIntoView({ behavior: 'smooth' });
        });
    }

    topicCards.forEach(card => {
        card.addEventListener('click', () => {
            topicCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentTopic = card.getAttribute('data-topic');
            playBeep(480, 0.08);
            updateTopicUI();
            speakCurrentTopic();
        });
    });

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedLang = btn.getAttribute('data-lang');
            playBeep(650, 0.08);
            updateTopicUI();
            if (isSpeaking) {
                speakCurrentTopic();
            }
        });
    });

    function updateTopicUI() {
        const topicObj = audioData[currentTopic];
        nowPlayingText.innerText = `Topic: ${topicObj.title}`;
        transcriptBox.innerText = selectedLang === 'hi-IN' ? `"${topicObj.hi}"` : `"${topicObj.en}"`;
    }

    /* --- 3. Video Showcase Gallery & Modal Player --- */
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const videoCards = document.querySelectorAll('.video-card');

    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPoster = document.getElementById('modal-video-poster');
    const modalPlayBtn = document.getElementById('modal-play-btn');
    const videoPlayingInd = document.getElementById('video-playing-ind');
    let isVideoPlaying = true;

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-video-title');
            const desc = card.getAttribute('data-video-desc');
            const img = card.getAttribute('data-video-img');

            modalTitle.innerText = title;
            modalDesc.innerText = desc;
            modalPoster.src = img;

            videoModal.classList.add('active');
            isVideoPlaying = true;
            modalPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            videoPlayingInd.style.display = 'flex';
            playBeep(700, 0.1);
        });
    });

    modalClose.addEventListener('click', () => {
        videoModal.classList.remove('active');
        playBeep(400, 0.08);
    });

    modalPlayBtn.addEventListener('click', () => {
        isVideoPlaying = !isVideoPlaying;
        playBeep(500, 0.08);
        if (isVideoPlaying) {
            modalPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            videoPlayingInd.style.display = 'flex';
        } else {
            modalPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            videoPlayingInd.style.display = 'none';
        }
    });

    /* --- 4. Interactive False Ceiling Studio (Cove Lighting Simulator) --- */
    const coveGlow = document.getElementById('cove-glow');
    const colorBtns = document.querySelectorAll('.color-btn');
    const lightModeLabel = document.getElementById('light-mode-label');
    const brightnessSlider = document.getElementById('light-brightness');

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const color = btn.getAttribute('data-color');
            const colorName = btn.getAttribute('data-name');

            const opacity = brightnessSlider.value;
            coveGlow.style.background = `radial-gradient(ellipse at top center, ${hexToRgba(color, opacity)} 0%, transparent 70%)`;
            lightModeLabel.innerHTML = `<i class="fa-solid fa-lightbulb"></i> ${colorName} Cove Light Active`;

            playBeep(880, 0.09, 'triangle');
        });
    });

    brightnessSlider.addEventListener('input', () => {
        const activeBtn = document.querySelector('.color-btn.active');
        const color = activeBtn ? activeBtn.getAttribute('data-color') : '#f59e0b';
        coveGlow.style.background = `radial-gradient(ellipse at top center, ${hexToRgba(color, brightnessSlider.value)} 0%, transparent 70%)`;
    });

    function hexToRgba(hex, alpha = 0.5) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
        }
        return `rgba(245, 158, 11, ${alpha})`;
    }

    /* --- 5. Gypsum Cost & Bag Estimator --- */
    const serviceType = document.getElementById('service-type');
    const roomWidth = document.getElementById('room-width');
    const roomLength = document.getElementById('room-length');
    const resArea = document.getElementById('res-area');
    const resPrice = document.getElementById('res-price');
    const resBags = document.getElementById('res-bags');
    const speakEstimateBtn = document.getElementById('btn-speak-estimate');

    const rates = {
        plaster: 45,
        false_ceiling: 95,
        designer_ceiling: 135,
        combo: 130
    };

    function calculateEstimate() {
        const w = parseFloat(roomWidth.value) || 0;
        const l = parseFloat(roomLength.value) || 0;
        const area = w * l;
        const rate = rates[serviceType.value] || 95;
        const totalPrice = area * rate;

        // Approx 1 Bag (25kg) covers ~10-12 sq ft at 12mm thickness
        const bagsNeeded = Math.ceil(area / 10);

        resArea.innerText = `${area} Sq. Ft.`;
        resPrice.innerText = `₹${totalPrice.toLocaleString('en-IN')}`;
        resBags.innerText = `Approx ${bagsNeeded} Gypsum Bags (25kg) Needed`;
    }

    [serviceType, roomWidth, roomLength].forEach(elem => {
        elem.addEventListener('input', calculateEstimate);
    });

    calculateEstimate();

    speakEstimateBtn.addEventListener('click', () => {
        playBeep(620, 0.1);
        if (!synth) return;

        const w = roomWidth.value;
        const l = roomLength.value;
        const area = resArea.innerText;
        const price = resPrice.innerText;

        const speechText = `Aapke ${w} by ${l} room ka total area ${area} hai. Jaiswal Gypsum ka kul anumanit kharcha lagbhag ${price} hai. Humare expert site visit ke liye contact details form mein bharein.`;

        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.95;

        synth.speak(utterance);
    });

    // Populate voices for Speech Synthesis
    if (synth) {
        synth.onvoiceschanged = () => {
            synth.getVoices();
        };
    }
});
