(function() {
    "use strict";

    // ✅ LOCAL KEY MODE - Tidak perlu koneksi server
    // 🔑 Password lokal langsung di sini
    const LOCAL_PASSWORD = "RAMA MODZ";

    // 🔍 Bookmark tracking logic (tetap sama)
    let userIndex = -1;
    if (typeof window.RAMA_BOOKMARK_LOAD !== "undefined") {
        userIndex = 0;
    } else {
        for (let i = 1; i <= 500; i++) {
            if (typeof window['RAMA' + i + '_BOOKMARK_LOAD'] !== "undefined") {
                userIndex = i;
                break;
            }
        }
    }

    if (userIndex === -1) {
        console.log("%cAccess Denied - Bookmark Required", "color:#ff0000;font-size:15px;font-weight:bold");
        return;
    }

    const _d = {
    r: "https://raw.githubusercontent.com/yuhb8756-lab/RAMA-MODZ-DOMAIN/main/ramamodz.txt",
        t: "https://raw.githubusercontent.com/yuhb8756-lab/RAMA-MODZ-BUTTON/main/button.txt",
        m: "https://raw.githubusercontent.com/yuhb8756-lab/RAMA-MODZ-MUSIC/main/music.mp3",
        s: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(6,10,23,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;padding:30px 25px;border-radius:16px;z-index:2147483647;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.6);border:2px solid #00ffcc;width:300px;box-sizing:border-box;animation: rama-lightning-glow 3s linear infinite;'
    };

    let ramaAudio = null;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let source = null;
    let animationFrameId = null;
    let isMusicLoading = false;

    (async function() {
        const oldBox = document.getElementById('rama-auth-box');
        if(oldBox) oldBox.remove();
        
        const oldCredit = document.getElementById('rama-floating-credit');
        if(oldCredit) oldCredit.remove();

        const oldMusicBtn = document.getElementById('rama-music-btn');
        if(oldMusicBtn) oldMusicBtn.remove();

        // ✅ Data lokal - tidak perlu fetch dari server
        let systemName = "RAMA MODZ";
        let userTelegram = "https://t.me/ramachanel";
        let correctPassword = LOCAL_PASSWORD; // 🔑 Password langsung dari variabel lokal

        // 🎨 Stylesheet
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            @keyframes rama-lightning-glow {
                0% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
                25% { box-shadow: 0 0 15px #00e6b8, 0 0 25px #00ffcc, inset 0 0 10px rgba(0,255,204,0.4); border-color: #00e6b8; }
                30% { box-shadow: 0 0 8px #00ffcc, 0 0 12px #00ffcc, inset 0 0 6px rgba(0,255,204,0.3); border-color: #00ffcc; }
                35% { box-shadow: 0 0 25px #00ffff, 0 0 40px #00ffcc, inset 0 0 15px rgba(0,255,204,0.5); border-color: #00ffff; }
                70% { box-shadow: 0 0 15px #00e6b8, 0 0 25px #00ffcc, inset 0 0 10px rgba(0,255,204,0.4); border-color: #00e6b8; }
                73% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
                100% { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2); border-color: #00ffcc; }
            }
            @keyframes rama-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes rama-fire-spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
            
            .rama-clickable-credit {
                position: fixed;
                bottom: 14px; right: 20px; font-size: 18px; font-weight: bold;
                font-family: 'Courier New', Courier, monospace; letter-spacing: 1px;
                z-index: 2147483647; text-decoration: none; cursor: pointer;
                background: transparent; border: none; padding: 0; margin: 0;
                animation: rama-rainbow-glow 3s linear infinite;
            }
            @keyframes rama-rainbow-glow {
                0% { color: #ff0000; text-shadow: 0 0 6px #ff0000; }
                16% { color: #ff7f00; text-shadow: 0 0 6px #ff7f00; }
                33% { color: #ffff00; text-shadow: 0 0 6px #ffff00; }
                50% { color: #00ff00; text-shadow: 0 0 6px #00ff00; }
                66% { color: #00ffff; text-shadow: 0 0 6px #00ffff; }
                83% { color: #0000ff; text-shadow: 0 0 6px #0000ff; }
                100% { color: #8b00ff; text-shadow: 0 0 6px #8b00ff; }
            }
            
            .rama-mode-btn {
                width: 100%; border: 1px solid rgba(0,255,204,0.3); padding: 12px;
                border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;
                letter-spacing: 1.5px; margin-bottom: 12px; color: #fff;
                transition: all 0.3s ease; text-transform: uppercase;
            }
            .rama-btn-fast { background: linear-gradient(90deg, rgba(0,255,150,0.1), rgba(0,255,150,0.2)); border-color: #00ff96; box-shadow: 0 0 8px rgba(0,255,150,0.2); }
            .rama-btn-fast:hover { background: #00ff96; color: #030712; box-shadow: 0 0 15px #00ff96; }
            
            .rama-btn-secure { background: linear-gradient(90deg, rgba(255,170,0,0.1), rgba(255,170,0,0.2)); border-color: #ffaa00; box-shadow: 0 0 8px rgba(255,170,0,0.2); }
            .rama-btn-secure:hover { background: #ffaa00; color: #030712; box-shadow: 0 0 15px #ffaa00; }
            
            .rama-btn-safe { background: linear-gradient(90deg, rgba(0,204,255,0.1), rgba(0,204,255,0.2)); border-color: #00ccff; box-shadow: 0 0 8px rgba(0,204,255,0.2); }
            .rama-btn-safe:hover { background: #00ccff; color: #030712; box-shadow: 0 0 15px #00ccff; }

            .rama-btn-main-choice { background: linear-gradient(90deg, rgba(0,255,204,0.1), rgba(0,255,204,0.2)); border-color: #00ffcc; box-shadow: 0 0 8px rgba(0,255,204,0.2); }
            .rama-btn-main-choice:hover { background: #00ffcc; color: #030712; box-shadow: 0 0 15px #00ffcc; }
        `;
        document.head.appendChild(styleSheet);

        // 🔗 Floating credit link
        const creditLink = document.createElement('a');
        creditLink.id = 'rama-floating-credit';
        creditLink.className = 'rama-clickable-credit';
        creditLink.innerText = 'RAMA MODZ TEAM';
        creditLink.href = userTelegram; 
        creditLink.target = '_blank';
        document.body.appendChild(creditLink);

        // 🎵 Floating music button
        const musicBtn = document.createElement('button');
        musicBtn.id = 'rama-music-btn';
        musicBtn.style.cssText = 'position:fixed; bottom:15px; left:15px; background:rgba(6,10,23,0.95); border:2px solid rgba(0,255,204,0.5); color:#ff4444; border-radius:50%; width:45px; height:45px; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 15px rgba(0,0,0,0.5); transition:all 0.3s ease; z-index:2147483647; outline:none;';
        musicBtn.textContent = '🔇';
        document.body.appendChild(musicBtn);

        // 🕋 Main auth box
        const box = document.createElement('div');
        box.id = 'rama-auth-box';
        box.style.cssText = _d.s;
        
        box.innerHTML = `
          <h3 style="margin:0 0 6px 0;color:#00ffcc;font-size:20px;letter-spacing:1.5px;font-weight:800;text-shadow:0 0 12px rgba(0,255,204,0.5); text-transform: uppercase;">${systemName} TEAM</h3>
          <p style="margin:0 0 20px 0;color:#64748b;font-size:11px;letter-spacing:2px;font-weight:600;">ENTER LICENSE KEY</p>
          <input type="text" id="rama-key-input" placeholder="ENTER KEY HERE" style="width:100%;padding:12px;margin-bottom:16px;border:1px solid rgba(0,255,204,0.4);border-radius:8px;background:rgba(7,11,25,0.6);color:#fff;text-align:center;box-sizing:border-box;font-size:13px;font-weight:600;letter-spacing:1px;outline:none;transition:all 0.3s ease;box-shadow:inset 0 2px 4px rgba(0,0,0,0.5);">
          <button id="rama-login-btn" style="width:100%;background:#00ffcc;color:#030712;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;letter-spacing:0.5px;margin-bottom:12px;box-shadow:0 4px 12px rgba(0,255,204,0.3);transition:all 0.2s ease;">VERIFY</button>
          <button id="rama-telegram-btn" style="width:100%;background:#229ED9;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;letter-spacing:0.5px;box-shadow:0 4px 12px rgba(34,158,217,0.25);">TELEGRAM RAMA MODZ</button>
          <div id="rama-status" style="margin-top:16px;font-size:11px;font-weight:700;color:#64748b;letter-spacing:1.5px;">RAMA MODZ TEAM</div>
        `;
        document.body.appendChild(box);

        // 🎵 Music & Visualizer setup
        async function setupVisualizer() {
            if (audioContext) return;
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                analyser.smoothingTimeConstant = 0.3; 
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                source = audioContext.createMediaElementSource(ramaAudio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            } catch(e) {
                console.error("Audio Context setup failed:", e);
            }
        }

        musicBtn.addEventListener('click', async () => {
            if (isMusicLoading) return;
            if (!ramaAudio) {
                try {
                    isMusicLoading = true; musicBtn.textContent = '⏳';
                    const res = await fetch(_d.m + '&t=' + Date.now());
                    const audioUrl = (await res.text()).trim();
                    if(audioUrl && audioUrl.startsWith('http')) {
                        const audioFetch = await fetch(audioUrl);
                        const blobUrl = URL.createObjectURL(await audioFetch.blob());
                        ramaAudio = new Audio(blobUrl); ramaAudio.loop = true; ramaAudio.crossOrigin = "anonymous";
                    } else { isMusicLoading = false; musicBtn.textContent = '🔇'; return; }
                } catch(err) { isMusicLoading = false; musicBtn.textContent = '🔇'; return; }
                isMusicLoading = false;
            }
            if (audioContext && audioContext.state === 'suspended') { await audioContext.resume(); }
            if (ramaAudio.paused) {
                await setupVisualizer();
                ramaAudio.play().then(() => {
                    musicBtn.textContent = '🔊'; musicBtn.style.color = '#00ffcc';
                    musicBtn.style.borderColor = '#00ffcc'; musicBtn.style.boxShadow = '0 0 15px rgba(0,255,204,0.6)';
                }).catch(err => {});
            } else {
                ramaAudio.pause(); musicBtn.textContent = '🔇'; musicBtn.style.color = '#ff4444';
                musicBtn.style.borderColor = 'rgba(0,255,204,0.5)'; musicBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
            }
        });

        const keyInput = document.getElementById('rama-key-input');
        keyInput.addEventListener('focus', () => {
            keyInput.style.border = '1px solid #00ffcc';
            keyInput.style.boxShadow = '0 0 10px rgba(0,255,204,0.25), inset 0 2px 4px rgba(0,0,0,0.5)';
        });

        const loginBtn = document.getElementById('rama-login-btn');
        const tgBtn = document.getElementById('rama-telegram-btn');
        const statusDiv = document.getElementById('rama-status');

        tgBtn.addEventListener('click', () => window.open(userTelegram, '_blank'));

        // 🎇 Visualizer animation engine
        function startVisualizerAnimation(selectedSeconds, redirectUrl) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%; 
                background:rgba(3,7,18,0.4); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); z-index:2147483647; 
                display:flex; align-items:center; justify-content:center; font-family:system-ui,-apple-system,sans-serif;
            `;

            overlay.innerHTML = `
                <div style="text-align:center; position:relative;">
                    <div style="position:relative; width:400px; height:400px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
                        <canvas id="rama-visualizer-canvas" width="400" height="400" style="position:absolute; top:0; left:0; z-index:2; pointer-events:none;"></canvas>
                        <div id="rama-glow-core" style="position:absolute; top:50%; left:50%; width:180px; height:180px; border-radius:50%; background:conic-gradient(transparent 0deg, #ff3300 90deg, #ffaa00 180deg, #00ffcc 270deg, transparent 360deg); filter: blur(25px); opacity:0.4; animation: rama-fire-spin 4s linear infinite; z-index:1; transition: all 0.3s ease;"></div>
                        <svg width="240" height="240" style="transform:rotate(-90deg); position:relative; z-index:3;">
                            <circle cx="120" cy="120" r="85" fill="rgba(6,10,23,0.94)" stroke="rgba(255,255,255,0.05)" stroke-width="10"></circle>
                            <circle id="progress" cx="120" cy="120" r="85" fill="none" stroke="#00ccff" stroke-width="10" stroke-dasharray="534" stroke-dashoffset="534" stroke-linecap="round" style="transition: stroke-dashoffset 1s linear, stroke 0.4s ease, filter 0.4s ease;"></circle>
                        </svg>
                        <div id="countdown-text" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:52px; font-weight:900; color:#fff; text-shadow:0 0 15px #00ccff; z-index:4; transition: color 0.4s ease, text-shadow 0.4s ease;">${selectedSeconds}</div>
                    </div>
                    <p id="rama-redirect-label" style="margin-top:20px; color:#00ccff; font-size:15px; font-weight:700; letter-spacing:3px; text-shadow:0 0 10px rgba(0,204,255,0.4); position:relative; z-index:4; transition: color 0.4s ease;">REDIRECTING...</p>
                </div>
            `;
            document.body.appendChild(overlay);

            const canvas = document.getElementById('rama-visualizer-canvas');
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = 88; 
            let colorHue = 180; 
            
            const progressRing = overlay.querySelector('#progress');
            const countdownText = overlay.querySelector('#countdown-text');
            const redirectLabel = overlay.querySelector('#rama-redirect-label');

            function drawSpectrum() {
                animationFrameId = requestAnimationFrame(drawSpectrum);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                colorHue = (colorHue + 0.4) % 360; 
                const currentNeonColor = `hsl(${colorHue}, 100%, 55%)`;
                let dynamicRadiusPulse = baseRadius;

                if (analyser && ramaAudio && !ramaAudio.paused) {
                    analyser.getByteFrequencyData(dataArray);
                    let lowBass = 0;
                    for(let b = 0; b < 5; b++) { lowBass += dataArray[b] || 0; }
                    lowBass = lowBass / 5;
                    dynamicRadiusPulse = baseRadius + (lowBass / 12);
                } else if (dataArray) { dataArray.fill(0); }

                const totalPoints = 56; 
                if (!dataArray) return;

                progressRing.style.stroke = currentNeonColor;
                progressRing.style.filter = `drop-shadow(0 0 12px ${currentNeonColor})`;
                countdownText.style.color = '#ffffff';
                countdownText.style.textShadow = `0 0 15px ${currentNeonColor}`;
                redirectLabel.style.color = currentNeonColor;
                redirectLabel.style.textShadow = `0 0 10px ${currentNeonColor}`;

                ctx.beginPath();
                for (let i = 0; i <= totalPoints; i++) {
                    const angle = (i / totalPoints) * Math.PI * 2;
                    let mirrorAngle = (i % (totalPoints / 4)) / (totalPoints / 4) * Math.PI * 0.5;
                    let baseIdx = Math.floor(Math.sin(mirrorAngle) * (dataArray.length * 0.65));
                    let sideIdx = (baseIdx + 2) % dataArray.length;
                    let blendedVal = ((dataArray[baseIdx] || 0) * 0.7) + ((dataArray[sideIdx] || 0) * 0.3);
                    
                    let normalized = blendedVal / 255;
                    let boostedVal = Math.min(255, Math.pow(normalized, 1.1) * 255 * 5.8);

                    const isSpikeTip = (i % 2 === 0); 
                    let sharpHeight = isSpikeTip ? (5 + ((boostedVal / 255) * 47)) : (-3 + ((boostedVal / 255) * 4));
                    const finalPointsRadius = dynamicRadiusPulse + sharpHeight;

                    const x = centerX + Math.cos(angle) * finalPointsRadius;
                    const y = centerY + Math.sin(angle) * finalPointsRadius;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.lineWidth = 3.8; ctx.lineCap = 'square'; ctx.lineJoin = 'miter'; ctx.miterLimit = 4;
                ctx.strokeStyle = currentNeonColor; ctx.shadowBlur = 14; ctx.shadowColor = currentNeonColor;
                ctx.stroke();

                ctx.beginPath();
                for (let i = 0; i <= totalPoints; i++) {
                    const angle = (i / totalPoints) * Math.PI * 2;
                    let mirrorAngle = (i % (totalPoints / 4)) / (totalPoints / 4) * Math.PI * 0.5;
                    let baseIdx = Math.floor(Math.sin(mirrorAngle) * (dataArray.length * 0.65));
                    let sideIdx = (baseIdx + 2) % dataArray.length;
                    let blendedVal = ((dataArray[baseIdx] || 0) * 0.7) + ((dataArray[sideIdx] || 0) * 0.3);
                    
                    let normalized = blendedVal / 255;
                    let boostedVal = Math.min(255, Math.pow(normalized, 1.1) * 255 * 5.8);
                    
                    const isSpikeTip = (i % 2 === 0);
                    let sharpHeight = isSpikeTip ? (5 + ((boostedVal / 255) * 47)) : (-3 + ((boostedVal / 255) * 4));
                    const finalPointsRadiusInner = dynamicRadiusPulse + (sharpHeight * 0.92);

                    const x = centerX + Math.cos(angle) * finalPointsRadiusInner;
                    const y = centerY + Math.sin(angle) * finalPointsRadiusInner;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.lineWidth = 1.2; ctx.strokeStyle = '#ffffff'; ctx.shadowBlur = 4; ctx.shadowColor = '#ffffff';
                ctx.stroke();
                ctx.shadowBlur = 0; 
            }
            drawSpectrum();

            let timeLeft = selectedSeconds;
            const progress = overlay.querySelector('#progress');
            const circumference = 534;

            const timer = setInterval(() => {
                timeLeft--;
                countdownText.textContent = timeLeft;
                progress.style.strokeDashoffset = circumference * (timeLeft / selectedSeconds);

                if (timeLeft <= 0) {
                    clearInterval(timer); cancelAnimationFrame(animationFrameId);
                    if(ramaAudio) { ramaAudio.pause(); }
                    if(musicBtn) { musicBtn.remove(); }
                    overlay.remove(); window.location.replace(redirectUrl);
                }
            }, 1000);
        }

        // 🏰 Aincrad mode
        function triggerAincradExecutionFlow(selectedSeconds) {
            box.remove();
            const checkOverlay = document.createElement('div');
            checkOverlay.style.cssText = `
                position:fixed; top:0; left:0; width:100%; height:100%; 
                background:rgba(3,7,18,0.85); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); z-index:2147483647; 
                display:flex; align-items:center; justify-content:center; font-family:system-ui,-apple-system,sans-serif;
            `;
            checkOverlay.innerHTML = `
                <div style="text-align:center; background:rgba(6,10,23,0.95); padding:35px 30px; border-radius:16px; border:1px solid #00ffcc; width:290px; animation: rama-lightning-glow 3s linear infinite;">
                    <div style="width: 45px; height: 45px; border: 4px solid rgba(0,255,204,0.1); border-top: 4px solid #00ffcc; border-radius: 50%; margin: 0 auto 20px auto; animation: rama-spin 0.8s linear infinite;"></div>
                    <p id="rama-check-text" style="color:#00ffcc; font-size:15px; font-weight:700; margin:0; letter-spacing:1.5px; text-shadow:0 0 8px rgba(0,255,204,0.3);">CHECKING UPDATE...</p>
                </div>
            `;
            document.body.appendChild(checkOverlay);

            setTimeout(async () => {
                let isUpdated = false;
                try {
                    const updateRes = await fetch("https://rm.rama-modz.workers.dev/");
                    const workerText = await updateRes.text();
                    if (workerText.includes("GitHub Updated")) { isUpdated = true; }
                } catch (err) {}

                const checkTextNode = document.getElementById('rama-check-text');
                if (isUpdated) {
                    checkTextNode.innerHTML = "<span style='color:#00ffcc;'>Link Updated Successfully! ✓</span>";
                } else {
                    checkTextNode.innerHTML = "<span style='color:#ff4444;'>No Update Available!</span>";
                }

                setTimeout(async () => {
                    checkOverlay.remove();
                    try {
                        const rResp = await fetch(_d.r + '&t=' + Date.now()); 
                        const finalUrl = (await rResp.text()).trim();
                        if(finalUrl.startsWith('http')) { startVisualizerAnimation(selectedSeconds, finalUrl); }
                    } catch(err) { alert("REDIRECT ERROR!"); }
                }, 1500);
            }, 3500);
        }

        // 🚀 PowerZx bypass panel
        function triggerPowerZxPanel() {
            box.innerHTML = `
                <button id="rama-back-btn" style="position:absolute;top:15px;left:15px;background:none;border:none;color:#64748b;cursor:pointer;font-size:16px;font-weight:bold;">❮</button>
                <h3 style="margin:0 0 8px 0;color:#00ffcc;font-size:18px;font-weight:800;">POWER CHE@TS BYPASS</h3>
                <p style="margin:0 0 20px 0;color:#64748b;font-size:10px;letter-spacing:1px;">SUPPORTED: VPLINK ONLY</p>
                <input type="text" id="rama-bypass-input" placeholder="https://vplink.in/..." style="width:100%;padding:12px;margin-bottom:16px;border:1px solid rgba(0,255,204,0.4);border-radius:8px;background:rgba(7,11,25,0.6);color:#fff;text-align:center;box-sizing:border-box;">
                <button id="rama-fetch-bypass-btn" style="width:100%;background:#00ffcc;color:#030712;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;">START BYPASS</button>
                <div id="rama-bypass-status" style="margin-top:16px;font-size:11px;font-weight:700;color:#64748b;">READY</div>
            `;
            document.getElementById('rama-back-btn').addEventListener('click', showMainOptionsPanel);

            const bypassInput = document.getElementById('rama-bypass-input');
            const fetchBtn = document.getElementById('rama-fetch-bypass-btn');
            const bStatus = document.getElementById('rama-bypass-status');

            fetchBtn.addEventListener('click', async () => {
                const urlVal = bypassInput.value.trim();
                if (!urlVal || !urlVal.includes('vplink.in/')) {
                    bStatus.innerHTML = "<span style='color:#ff4444;'>INVALID LINK! URL MUST BE VPLINK.</span>"; return;
                }

                bStatus.innerHTML = "<span style='color:#00ffcc;'>BYPASSING LINK VIA RAMA MODZ TEAM... PLEASE WAIT</span>";
                fetchBtn.disabled = true;

                try {
                    const RAILWAY_SERVER_URL = "https://zxi-bypass-production.up.railway.app";
                    const response = await fetch(`${RAILWAY_SERVER_URL}/api/bypass?url=${encodeURIComponent(urlVal)}`);
                    const data = await response.json();
                    
                    if (data && data.status === "success" && data.bypassed_url) {
                        bStatus.innerHTML = "<span style='color:#00ff96;'>BYPASS SUCCESSFUL! ✓</span>";
                        fetchBtn.outerHTML = `<button id="rama-redirect-bypass-btn" style="width:100%;background:linear-gradient(90deg, #00ffcc, #00ccff);color:#030712;border:none;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 15px rgba(0,255,204,0.4);">REDIRECT FINAL</button>`;
                        
                        document.getElementById('rama-redirect-bypass-btn').addEventListener('click', () => {
                            box.remove(); startVisualizerAnimation(30, data.bypassed_url);
                        });
                    } else {
                        bStatus.innerHTML = "<span style='color:#ff4444;'>TRY AGAIN</span>"; fetchBtn.disabled = false;
                    }
                } catch (err) {
                    bStatus.innerHTML = "<span style='color:#ff4444;'>SERVER ERROR! TRY AGAIN</span>"; fetchBtn.disabled = false;
                }
            });
        }

        // 🏛️ Main options panel
        function showMainOptionsPanel() {
            box.innerHTML = `
                <h3 style="margin:0 0 8px 0;color:#00ffcc;font-size:18px;font-weight:800;">SELECT SYSTEM ENGINE</h3>
                <p style="margin:0 0 22px 0;color:#64748b;font-size:10px;letter-spacing:1px;">CHOOSE YOUR SPECIFIC MODULE</p>
                <button id="rama-choice-aincrad" class="rama-mode-btn rama-btn-main-choice">AINCRAD</button>
                <button id="rama-choice-powerzx" class="rama-mode-btn rama-btn-secure">POWER CHE@TS</button>
            `;

            document.getElementById('rama-choice-aincrad').addEventListener('click', () => {
                box.innerHTML = `
                    <button id="rama-back-to-main" style="position:absolute;top:15px;left:15px;background:none;border:none;color:#64748b;cursor:pointer;font-size:16px;font-weight:bold;">❮</button>
                    <h3 style="margin:0 0 8px 0;color:#00ffcc;font-size:18px;font-weight:800;">RAMA MODZ TEAM MODE</h3>
                    <p style="margin:0 0 22px 0;color:#64748b;font-size:10px;letter-spacing:1px;">CHOOSE SECURITY BYPASS METHOD</p>
                    <button id="rama-btn-fast" class="rama-mode-btn rama-btn-fast">FAST MODE (30s)</button>
                    <button id="rama-btn-secure" class="rama-mode-btn rama-btn-secure">SECURE MODE (45s)</button>
                    <button id="rama-btn-safe" class="rama-mode-btn rama-btn-safe">SAFE MODE (60s)</button>
                `;
                document.getElementById('rama-back-to-main').addEventListener('click', showMainOptionsPanel);
                document.getElementById('rama-btn-fast').addEventListener('click', () => triggerAincradExecutionFlow(30));
                document.getElementById('rama-btn-secure').addEventListener('click', () => triggerAincradExecutionFlow(45));
                document.getElementById('rama-btn-safe').addEventListener('click', () => triggerAincradExecutionFlow(60));
            });

            document.getElementById('rama-choice-powerzx').addEventListener('click', triggerPowerZxPanel);
        }

        // 🔑 LOCAL KEY VERIFICATION - Tanpa koneksi server
        loginBtn.addEventListener('click', () => {
            const inputKey = keyInput.value.trim();
            if(!inputKey) { statusDiv.innerHTML = "<span style='color:#ff4444;'>PLEASE INPUT KEY!</span>"; return; }
            
            // ✅ Langsung cek lokal, tanpa "CONNECTING SERVER..."
            statusDiv.innerHTML = "<span style='color:#00ffcc;'>VERIFYING KEY...</span>";
            
            setTimeout(() => {
                if (inputKey === correctPassword) {
                    statusDiv.innerHTML = "<span style='color:#00ffcc;'>KEY VALIDATED! ✓</span>";
                    setTimeout(showMainOptionsPanel, 800);
                } else {
                    statusDiv.innerHTML = "<span style='color:#ff4444;'>INVALID LICENSE KEY!</span>";
                }
            }, 500);
        });

    })();
})();
