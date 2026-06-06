(function () {
  "use strict";

  let instanceIndex = -1;
  if (typeof window.RAMA_BOOKMARK_LOAD !== "undefined") {
    instanceIndex = 0;
  } else {
    for (let i = 1; i <= 500; i++) {
      if (typeof window["RAMA" + i + "_BOOKMARK_LOAD"] !== "undefined") {
        instanceIndex = i;
        break;
      }
    }
  }
  if (instanceIndex === -1) {
    console.log(
      "%cAccess Denied - Bookmark Required",
      "color:#ff0000;font-size:15px;font-weight:bold"
    );
    return;
  }

  const CONFIG = {
    r: "https://raw.githubusercontent.com/yuhb8756-lab/RAMA-MODZ-DOMAIN/main/ramamodz.txt",
    t: "https://raw.githubusercontent.com/yuhb8756-lab/RAMA-MODZ-BUTTON/main/button.txt",
    m: "https://raw.githubusercontent.com/yuhb8756-lab/RAMA-MODZ-MUSIC/main/music.mp3",
    
        n: "https://zxi-file-loader.ah4734536.workers.dev/?file=name.txt",
    s: "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
       "background:rgba(6,10,23,0.95);backdrop-filter:blur(12px);" +
       "-webkit-backdrop-filter:blur(12px);color:#fff;padding:30px 25px;" +
       "border-radius:16px;z-index:2147483647;" +
       'font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
       "text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.6);" +
       "border:2px solid #00ffcc;width:300px;box-sizing:border-box;" +
       "animation: rama-lightning-glow 3s linear infinite;",
  };

  const FALLBACK_MUSIC_URL = "https://raw.githubusercontent.com/yuhb8756-lab/RAMA-MODZ-MUSIC/main/music.mp3";
  let audioPlayer = null;


  (async function () {

    document.getElementById("rama-auth-box")?.remove();
    document.getElementById("rama-floating-credit")?.remove();


    let titleName    = "RAMA MODZ";
    let telegramLink = "https://t.me/ramachanel";
    let masterKey    = "";
    try {
      const nameRes  = await fetch(CONFIG.n + "&t=" + Date.now());
      const nameText = await nameRes.text();
      const lines    = nameText.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");
      if (lines[instanceIndex]) {
        const parts = lines[instanceIndex].match(/"([^"]+)"/g);
        if (parts && parts.length >= 3) {
          titleName    = parts[0].replace(/"/g, "");
          telegramLink = parts[1].replace(/"/g, "");
          masterKey    = parts[2].replace(/"/g, "");
        }
      }
    } catch (err) {
      console.error("Data loading failed:", err);
    }


    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes rama-lightning-glow {
        0%   { box-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2);  border-color: #00ffcc; }
        25%  { box-shadow: 0 0 15px #00e6b8, 0 0 25px #00ffcc, inset 0 0 10px rgba(0,255,204,0.4); border-color: #00e6b8; }
        30%  { box-shadow: 0 0 8px #00ffcc,  0 0 12px #00ffcc, inset 0 0 6px rgba(0,255,204,0.3);  border-color: #00ffcc; }
        35%  { box-shadow: 0 0 25px #00ffff, 0 0 40px #00ffcc, inset 0 0 15px rgba(0,255,204,0.5); border-color: #00ffff; }
        70%  { box-shadow: 0 0 15px #00e6b8, 0 0 25px #00ffcc, inset 0 0 10px rgba(0,255,204,0.4); border-color: #00e6b8; }
        73%  { box-shadow: 0 0 5px #00ffcc,  0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2);  border-color: #00ffcc; }
        100% { box-shadow: 0 0 5px #00ffcc,  0 0 10px #00ffcc, inset 0 0 5px rgba(0,255,204,0.2);  border-color: #00ffcc; }
      }
      @keyframes rama-spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes rama-fire-spin {
        0%   { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      @keyframes rama-rainbow-glow {
        0%   { color: #ff0000; text-shadow: 0 0 6px #ff0000; }
        16%  { color: #ff7f00; text-shadow: 0 0 6px #ff7f00; }
        33%  { color: #ffff00; text-shadow: 0 0 6px #ffff00; }
        50%  { color: #00ff00; text-shadow: 0 0 6px #00ff00; }
        66%  { color: #00ffff; text-shadow: 0 0 6px #00ffff; }
        83%  { color: #0000ff; text-shadow: 0 0 6px #0000ff; }
        100% { color: #8b00ff; text-shadow: 0 0 6px #8b00ff; }
      }

      .rama-clickable-credit {
        position: fixed;
        bottom: 14px;
        right: 20px;
        font-size: 18px;
        font-weight: bold;
        font-family: 'Courier New', Courier, monospace;
        letter-spacing: 1px;
        z-index: 2147483647;
        text-decoration: none;
        cursor: pointer;
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        animation: rama-rainbow-glow 3s linear infinite;
      }

      .rama-mode-btn {
        width: 100%;
        border: 1px solid rgba(0,255,204,0.3);
        padding: 12px;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        font-size: 14px;
        letter-spacing: 1.5px;
        margin-bottom: 12px;
        color: #fff;
        transition: all 0.3s ease;
        text-transform: uppercase;
      }
      .rama-btn-fast   { background: linear-gradient(90deg, rgba(0,255,150,0.1), rgba(0,255,150,0.2)); border-color: #00ff96; box-shadow: 0 0 8px rgba(0,255,150,0.2); }
      .rama-btn-fast:hover   { background: #00ff96; color: #030712; box-shadow: 0 0 15px #00ff96; }
      .rama-btn-secure { background: linear-gradient(90deg, rgba(255,170,0,0.1), rgba(255,170,0,0.2)); border-color: #ffaa00; box-shadow: 0 0 8px rgba(255,170,0,0.2); }
      .rama-btn-secure:hover { background: #ffaa00; color: #030712; box-shadow: 0 0 15px #ffaa00; }
      .rama-btn-safe   { background: linear-gradient(90deg, rgba(0,204,255,0.1), rgba(0,204,255,0.2)); border-color: #00ccff; box-shadow: 0 0 8px rgba(0,204,255,0.2); }
      .rama-btn-safe:hover   { background: #00ccff; color: #030712; box-shadow: 0 0 15px #00ccff; }
    `;
    document.head.appendChild(styleEl);


    const creditLink     = document.createElement("a");
    creditLink.id        = "rama-floating-credit";
    creditLink.className = "rama-clickable-credit";
    creditLink.innerText = "RAMA MODZ TEAM";
    creditLink.href      = "https://t.me/ramachanel";
    creditLink.target    = "_blank";
    document.body.appendChild(creditLink);


    const authBox         = document.createElement("div");
    authBox.id            = "rama-auth-box";
    authBox.style.cssText = CONFIG.s;
    authBox.innerHTML     = `
      <button id="rama-music-btn" style="
        position:absolute;top:15px;right:15px;
        background:rgba(255,255,255,0.05);border:1px solid rgba(0,255,204,0.3);
        color:#ff4444;border-radius:50%;width:32px;height:32px;
        cursor:pointer;font-size:14px;display:flex;align-items:center;
        justify-content:center;box-shadow:0 0 8px rgba(0,0,0,0.3);
        transition:all 0.3s ease;z-index:10;">🔇</button>

      <h3 style="margin:0 0 6px 0;color:#00ffcc;font-size:20px;letter-spacing:1.5px;
                 font-weight:800;text-shadow:0 0 12px rgba(0,255,204,0.5);text-transform:uppercase;">
        ${titleName} TEAM
      </h3>
      <p style="margin:0 0 20px 0;color:#64748b;font-size:11px;letter-spacing:2px;font-weight:600;">
        ENTER LICENSE KEY
      </p>

      <input type="text" id="rama-key-input" placeholder="ENTER KEY HERE" style="
        width:100%;padding:12px;margin-bottom:16px;
        border:1px solid rgba(0,255,204,0.4);border-radius:8px;
        background:rgba(7,11,25,0.6);color:#fff;text-align:center;
        box-sizing:border-box;font-size:13px;font-weight:600;
        letter-spacing:1px;outline:none;transition:all 0.3s ease;
        box-shadow:inset 0 2px 4px rgba(0,0,0,0.5);">

      <button id="rama-login-btn" style="
        width:100%;background:#00ffcc;color:#030712;border:none;
        padding:12px;border-radius:8px;font-weight:700;cursor:pointer;
        font-size:14px;letter-spacing:0.5px;margin-bottom:12px;
        box-shadow:0 4px 12px rgba(0,255,204,0.3);transition:all 0.2s ease;">
        VERIFY
      </button>

      <button id="rama-telegram-btn" style="
        width:100%;background:#229ED9;color:#fff;border:none;
        padding:12px;border-radius:8px;font-weight:700;cursor:pointer;
        font-size:14px;letter-spacing:0.5px;
        box-shadow:0 4px 12px rgba(34,158,217,0.25);">
        TELEGRAM RAMA MODZ
      </button>

      <div id="rama-status" style="margin-top:16px;font-size:11px;font-weight:700;
                                   color:#64748b;letter-spacing:1.5px;">
        RAMA MODZ TEAM
      </div>
    `;
    document.body.appendChild(authBox);

    const musicBtn    = document.getElementById("rama-music-btn");
    const keyInput    = document.getElementById("rama-key-input");
    const loginBtn    = document.getElementById("rama-login-btn");
    const telegramBtn = document.getElementById("rama-telegram-btn");
    const statusEl    = document.getElementById("rama-status");

    setTimeout(() => {
      authBox.style.zIndex = "2147483647";
      if (window.innerWidth < 600) {
        authBox.style.width    = "90%";
        authBox.style.maxWidth = "300px";
      }
    }, 10);


    let musicLoading = false;
    musicBtn.addEventListener("click", async () => {
      if (musicLoading) return; // cegah double-click saat loading

      if (!audioPlayer) {
        musicLoading         = true;
        musicBtn.textContent = "⏳";
        let resolvedUrl      = FALLBACK_MUSIC_URL; // default fallback
        try {
          const res      = await fetch(CONFIG.m + "&t=" + Date.now());
          const audioUrl = (await res.text()).trim();
          if (audioUrl && audioUrl.startsWith("http")) {
            resolvedUrl = audioUrl;
          } else {
            console.log("Invalid audio URL in music.txt, using fallback.");
          }
        } catch (err) {
          console.log("Failed to fetch music URL, using fallback:", err);
        }
        audioPlayer      = new Audio(resolvedUrl);
        audioPlayer.loop = true;
        musicLoading     = false;
      }

      // Toggle play / pause
      if (audioPlayer.paused) {
        audioPlayer.play()
          .then(() => {
            musicBtn.textContent       = "🔊";
            musicBtn.style.color       = "#00ffcc";
            musicBtn.style.borderColor = "#00ffcc";
            musicBtn.style.boxShadow   = "0 0 10px rgba(0,255,204,0.4)";
          })
          .catch(err => {
            console.log("Playback failed:", err);
            musicBtn.textContent = "🔇";
          });
      } else {
        audioPlayer.pause();
        musicBtn.textContent       = "🔇";
        musicBtn.style.color       = "#ff4444";
        musicBtn.style.borderColor = "rgba(0,255,204,0.3)";
        musicBtn.style.boxShadow   = "0 0 8px rgba(0,0,0,0.3)";
      }
    });

    keyInput.addEventListener("focus", () => {
      keyInput.style.border    = "1px solid #00ffcc";
      keyInput.style.boxShadow = "0 0 10px rgba(0,255,204,0.25), inset 0 2px 4px rgba(0,0,0,0.5)";
    });
    keyInput.addEventListener("blur", () => {
      keyInput.style.border    = "1px solid rgba(0,255,204,0.4)";
      keyInput.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.5)";
    });
    
    telegramBtn.addEventListener("click", () => {
      if (telegramLink && telegramLink.startsWith("http")) {
        window.open(telegramLink, "_blank");
      }
    });


    function runRedirect(countdownSeconds) {
      authBox.remove();
      const loadingOverlay = document.createElement("div");
      loadingOverlay.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(3,7,18,0.85); backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px); z-index:2147483647;
        display:flex; align-items:center; justify-content:center;
        font-family:system-ui,-apple-system,sans-serif;
      `;
      loadingOverlay.innerHTML = `
        <div style="text-align:center; background:rgba(6,10,23,0.95);
                    padding:35px 30px; border-radius:16px;
                    border:1px solid #00ffcc; width:290px;
                    animation: rama-lightning-glow 3s linear infinite;">
          <div style="width:45px; height:45px;
                      border:4px solid rgba(0,255,204,0.1);
                      border-top:4px solid #00ffcc; border-radius:50%;
                      margin:0 auto 20px auto;
                      animation:rama-spin 0.8s linear infinite;
                      box-shadow:0 0 15px rgba(0,255,204,0.2);"></div>
          <p id="rama-check-text" style="color:#00ffcc; font-size:15px;
             font-weight:700; margin:0; letter-spacing:1.5px;
             text-shadow:0 0 8px rgba(0,255,204,0.3);">CHECKING UPDATE...</p>
        </div>
      `;
      document.body.appendChild(loadingOverlay);

      setTimeout(async () => {
        let hasUpdate = false;
        try {
          const updateRes  = await fetch("https://rm.rama-modz.workers.dev/");
          const updateText = await updateRes.text();
          if (updateText.includes("GitHub Updated")) hasUpdate = true;
        } catch { }

        const checkText = document.getElementById("rama-check-text");
        checkText.innerHTML = hasUpdate
          ? "<span style='color:#00ffcc;'>Link Updated Successfully! ✓</span>"
          : "<span style='color:#ff4444; text-shadow:0 0 8px rgba(255,68,68,0.3);'>No Update Available!</span>";

        setTimeout(async () => {
          loadingOverlay.remove();
          try {
            const redirectRes = await fetch(CONFIG.r + "&t=" + Date.now());
            const redirectUrl = (await redirectRes.text()).trim();

            if (!redirectUrl.startsWith("http")) return;
            const DASH_TOTAL       = 597;
            const countdownOverlay = document.createElement("div");
            countdownOverlay.style.cssText = `
              position:fixed; top:0; left:0; width:100%; height:100%;
              background:rgba(3,7,18,0.05); backdrop-filter:blur(1px);
              -webkit-backdrop-filter:blur(1px); z-index:2147483647;
              display:flex; align-items:center; justify-content:center;
              font-family:system-ui,-apple-system,sans-serif;
            `;
            countdownOverlay.innerHTML = `
              <div style="text-align:center;">
                <div style="position:relative; width:250px; height:250px;
                            margin:0 auto; display:flex; align-items:center;
                            justify-content:center;">

                  <div style="position:absolute; top:50%; left:50%;
                              width:214px; height:214px; border-radius:50%;
                              background:conic-gradient(transparent 0deg,#ff3300 90deg,#ffaa00 180deg,#00ffcc 270deg,transparent 360deg);
                              filter:blur(14px); opacity:0.85;
                              animation:rama-fire-spin 1.5s linear infinite; z-index:1;"></div>

                  <div style="position:absolute; top:50%; left:50%;
                              width:206px; height:206px; border-radius:50%;
                              background:conic-gradient(transparent 0deg,#ff0055 60deg,#ff5500 120deg,#ffcc00 240deg,transparent 360deg);
                              filter:blur(6px); opacity:0.9;
                              animation:rama-fire-spin 1s linear infinite reverse; z-index:2;"></div>

                  <svg width="240" height="240"
                       style="transform:rotate(-90deg); position:relative; z-index:3;">
                    <circle cx="120" cy="120" r="95"
                            fill="rgba(6,10,23,0.65)"
                            stroke="rgba(0,255,204,0.1)"
                            stroke-width="14"></circle>
                    <circle id="progress" cx="120" cy="120" r="95"
                            fill="none" stroke="#00ffcc" stroke-width="14"
                            stroke-dasharray="${DASH_TOTAL}"
                            stroke-dashoffset="${DASH_TOTAL}"
                            stroke-linecap="round"
                            style="filter:drop-shadow(0 0 6px #00ffcc);
                                   transition:stroke-dashoffset 1s linear;"></circle>
                  </svg>

                  <div id="countdown-text" style="
                    position:absolute; top:50%; left:50%;
                    transform:translate(-50%,-50%);
                    font-size:54px; font-weight:900; color:#fff;
                    text-shadow:0 0 20px #00ffcc, 0 0 30px rgba(0,255,204,0.3);
                    z-index:4;">${countdownSeconds}</div>
                </div>

                <p style="margin-top:30px; color:#00ffcc; font-size:16px;
                           font-weight:700; letter-spacing:3px;
                           text-shadow:0 0 12px rgba(0,255,204,0.4);
                           position:relative; z-index:4;">REDIRECTING...</p>
              </div>
            `;
            document.body.appendChild(countdownOverlay);

            let remaining        = countdownSeconds;
            const progressCircle = countdownOverlay.querySelector("#progress");
            const countdownText  = countdownOverlay.querySelector("#countdown-text");

            const timer = setInterval(() => {
              remaining--;
              countdownText.textContent             = remaining;
              progressCircle.style.strokeDashoffset = DASH_TOTAL * (remaining / countdownSeconds);

              if (remaining <= 0) {
                clearInterval(timer);
                if (audioPlayer) {
                  audioPlayer.pause();
                  audioPlayer = null;
                }
                countdownOverlay.remove();
                window.location.replace(redirectUrl);
              }
            }, 1000);

          } catch {
            alert("REDIRECT ERROR!");
          }
        }, 1500);
      }, 5000);
    }

    loginBtn.addEventListener("click", async () => {
      const inputKey = keyInput.value.trim();

      if (!inputKey) {
        statusEl.innerHTML = "<span style='color:#ff4444;'>PLEASE INPUT KEY!</span>";
        return;
      }

      statusEl.innerHTML = "<span style='color:#00ffcc; text-shadow:0 0 8px rgba(0,255,204,0.3);'>CONNECTING SERVER...</span>";
      loginBtn.disabled = telegramBtn.disabled = true;

      if (masterKey !== "" && inputKey === masterKey) {
        statusEl.innerHTML = "<span style='color:#00ffcc;'>KEY VALIDATED! ✓</span>";

        setTimeout(() => {
          authBox.innerHTML = `
            <h3 style="margin:0 0 8px 0;color:#00ffcc;font-size:18px;letter-spacing:1px;
                       font-weight:800;text-shadow:0 0 12px rgba(0,255,204,0.5);">
              SYSTEM MODE
            </h3>
            <p style="margin:0 0 22px 0;color:#64748b;font-size:10px;letter-spacing:1.5px;font-weight:600;">
              CHOOSE SECURITY BYPASS METHOD
            </p>

            <button id="rama-btn-fast"   class="rama-mode-btn rama-btn-fast">🔹 FAST MODE (BAN RISK) 🔹</button>
            <button id="rama-btn-secure" class="rama-mode-btn rama-btn-secure">🔹 SECURE MODE (MIDDLE) 🔹</button>
            <button id="rama-btn-safe"   class="rama-mode-btn rama-btn-safe">🔹 SAFE MODE (FULL SAFE) 🔹</button>
          `;
          document.getElementById("rama-btn-fast").addEventListener("click",   () => runRedirect(30));
          document.getElementById("rama-btn-secure").addEventListener("click", () => runRedirect(45));
          document.getElementById("rama-btn-safe").addEventListener("click",   () => runRedirect(60));
        }, 800);

      } else {
        statusEl.innerHTML = "<span style='color:#ff4444;'>INVALID LICENSE KEY!</span>";
        loginBtn.disabled = telegramBtn.disabled = false;
      }
    });

  })();
})();
