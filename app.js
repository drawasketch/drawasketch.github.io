// app.js - Draw A Sketch Application Core
(function () {
  "use strict";

  // ── Canvas Setup ────────────────────────────────────────────────
  let canvas, ctx;
  let isDrawing = false;
  let lastX = 0, lastY = 0;
  let history = [], historyIndex = -1;
  let MAX_HISTORY = 30;

  // Tool state
  let state = {
    tool: "pencil",
    color: "#333333",
    brushSize: 4,
    opacity: 1,
    fillShape: false,
    textInput: "",
    startX: 0,
    startY: 0,
    snapshot: null,
    shapeType: "rect",
    zoom: 1,
    gridVisible: false,
  };

  // Colour palettes
  const PALETTES = {
    classic: ["#000000","#333333","#666666","#999999","#CCCCCC","#FFFFFF","#FF0000","#FF6600","#FFCC00","#00CC00","#0066FF","#9900CC","#FF99CC","#FFCC99","#99FFCC","#99CCFF","#CC99FF","#FF6699","#663300","#336600","#003366","#660066","#FF3300","#FF9900"],
    pastel:  ["#FFB3BA","#FFDFBA","#FFFFBA","#BAFFC9","#BAE1FF","#E8BAFF","#FFB3F0","#B3FFE8","#FFE4BA","#BAD7FF","#FFDDF0","#D4FFBA","#BAF0FF","#FFD4BA","#E0BAFF","#BAFFDE","#FFB3C6","#FFF0BA","#BAFFBA","#B3D4FF"],
    vivid:   ["#FF0040","#FF4500","#FF8C00","#FFD700","#39FF14","#00FF88","#00FFFF","#0080FF","#8000FF","#FF00FF","#FF1493","#00CED1","#FF6347","#7FFF00","#FF4081","#1DE9B6","#FFAB40","#40C4FF","#B388FF","#69F0AE"],
  };

  // ── Initialize ───────────────────────────────────────────────────
  function init() {
    canvas = document.getElementById("sketchCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    fillBackground();
    saveHistory();
    bindEvents();
    renderPalette("classic");
    updateCursor();
    window.addEventListener("resize", resizeCanvas);
  }

  function resizeCanvas() {
    const wrapper = canvas.parentElement;
    const w = wrapper.clientWidth;
    const h = Math.max(480, window.innerHeight * 0.55);
    const imageData = canvas.width > 0 ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    canvas.width = w;
    canvas.height = h;
    canvas.style.height = h + "px";
    fillBackground();
    if (imageData) ctx.putImageData(imageData, 0, 0);
  }

  function fillBackground() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (state.gridVisible) drawGrid();
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = "rgba(180,180,220,0.35)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
    ctx.restore();
  }

  // ── History ──────────────────────────────────────────────────────
  function saveHistory() {
    history = history.slice(0, historyIndex + 1);
    if (history.length >= MAX_HISTORY) history.shift();
    history.push(canvas.toDataURL());
    historyIndex = history.length - 1;
    updateHistoryButtons();
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    restoreHistory(history[historyIndex]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex++;
    restoreHistory(history[historyIndex]);
  }

  function restoreHistory(dataURL) {
    const img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); };
    img.src = dataURL;
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    if (undoBtn) undoBtn.disabled = historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
  }

  // ── Drawing ──────────────────────────────────────────────────────
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  }

  function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x; lastY = pos.y;
    state.startX = pos.x; state.startY = pos.y;
    state.snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (state.tool === "fill") { floodFill(Math.round(pos.x), Math.round(pos.y), hexToRgb(state.color)); saveHistory(); isDrawing = false; return; }
    if (state.tool === "eyedropper") { pickColor(pos.x, pos.y); isDrawing = false; return; }
    if (state.tool === "text") { addText(pos.x, pos.y); isDrawing = false; return; }

    ctx.globalAlpha = state.opacity;
    ctx.strokeStyle = state.color;
    ctx.fillStyle = state.color;
    ctx.lineWidth = state.brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (["pencil","brush","marker","eraser","highlighter"].includes(state.tool)) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
    }
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);

    ctx.globalAlpha = state.tool === "highlighter" ? 0.3 : state.opacity;
    ctx.strokeStyle = state.tool === "eraser" ? "#FFFFFF" : state.color;
    ctx.fillStyle = state.color;
    ctx.lineWidth = state.brushSize;
    ctx.lineCap = state.tool === "marker" ? "square" : "round";
    ctx.lineJoin = "round";

    switch (state.tool) {
      case "pencil":
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x; lastY = pos.y;
        break;
      case "brush":
        ctx.lineWidth = state.brushSize * 2;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x; lastY = pos.y;
        break;
      case "marker":
        ctx.lineWidth = state.brushSize * 2.5;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x; lastY = pos.y;
        break;
      case "eraser":
        ctx.lineWidth = state.brushSize * 2;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x; lastY = pos.y;
        break;
      case "highlighter":
        ctx.lineWidth = state.brushSize * 4;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x; lastY = pos.y;
        break;
      case "shape":
        ctx.putImageData(state.snapshot, 0, 0);
        drawShape(state.startX, state.startY, pos.x, pos.y);
        break;
      case "line":
        ctx.putImageData(state.snapshot, 0, 0);
        ctx.beginPath();
        ctx.moveTo(state.startX, state.startY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;
    }
  }

  function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.globalAlpha = 1;
    saveHistory();
  }

  function drawShape(x1, y1, x2, y2) {
    ctx.beginPath();
    const w = x2 - x1, h = y2 - y1;
    switch (state.shapeType) {
      case "rect": ctx.rect(x1, y1, w, h); break;
      case "circle": { const r = Math.sqrt(w * w + h * h) / 2; ctx.arc(x1 + w / 2, y1 + h / 2, r, 0, Math.PI * 2); break; }
      case "triangle": ctx.moveTo(x1 + w / 2, y1); ctx.lineTo(x2, y2); ctx.lineTo(x1, y2); ctx.closePath(); break;
      case "star": drawStar(ctx, x1 + w / 2, y1 + h / 2, 5, Math.abs(w / 2), Math.abs(w / 4)); break;
      case "arrow": drawArrow(ctx, x1, y1, x2, y2); break;
    }
    if (state.fillShape) ctx.fill();
    ctx.stroke();
  }

  function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
    let rot = (Math.PI / 2) * 3, step = Math.PI / spikes;
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR); rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR); rot += step;
    }
    ctx.closePath();
  }

  function drawArrow(ctx, x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const len = 20;
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - len * Math.cos(angle - 0.4), y2 - len * Math.sin(angle - 0.4));
    ctx.lineTo(x2 - len * Math.cos(angle + 0.4), y2 - len * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  // ── Fill Tool ────────────────────────────────────────────────────
  function floodFill(startX, startY, fillColor) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const idx = (startY * w + startX) * 4;
    const target = [data[idx], data[idx+1], data[idx+2], data[idx+3]];
    const fill = [fillColor.r, fillColor.g, fillColor.b, 255];
    if (target.every((v, i) => v === fill[i])) return;

    const stack = [[startX, startY]];
    const visited = new Uint8Array(w * canvas.height);
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= w || y < 0 || y >= canvas.height) continue;
      const i = (y * w + x) * 4;
      if (visited[y * w + x]) continue;
      if (!colorMatch(data, i, target)) continue;
      visited[y * w + x] = 1;
      data[i] = fill[0]; data[i+1] = fill[1]; data[i+2] = fill[2]; data[i+3] = fill[3];
      stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function colorMatch(data, i, target) {
    return Math.abs(data[i]-target[0]) < 30 && Math.abs(data[i+1]-target[1]) < 30 && Math.abs(data[i+2]-target[2]) < 30;
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return {r,g,b};
  }

  // ── Eyedropper & Text ────────────────────────────────────────────
  function pickColor(x, y) {
    const p = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    const hex = "#" + [p[0],p[1],p[2]].map(v=>v.toString(16).padStart(2,"0")).join("");
    state.color = hex;
    updateColorUI(hex);
    setTool("pencil");
  }

  function addText(x, y) {
    const txt = document.getElementById("textInput");
    const text = txt ? txt.value.trim() : "Hello";
    if (!text) return;
    ctx.font = `${state.brushSize * 5}px 'Nunito', sans-serif`;
    ctx.fillStyle = state.color;
    ctx.globalAlpha = state.opacity;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;
    saveHistory();
  }

  // ── UI Helpers ───────────────────────────────────────────────────
  function updateColorUI(hex) {
    const colorPicker = document.getElementById("colorPicker");
    if (colorPicker) colorPicker.value = hex;
    const colorPreview = document.getElementById("colorPreview");
    if (colorPreview) colorPreview.style.background = hex;
    document.querySelectorAll(".palette-swatch.active").forEach(s => s.classList.remove("active"));
  }

  function setTool(tool) {
    state.tool = tool;
    document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
    const btn = document.querySelector(`[data-tool="${tool}"]`);
    if (btn) btn.classList.add("active");
    updateCursor();
    const shapeOptions = document.getElementById("shapeOptions");
    if (shapeOptions) shapeOptions.style.display = tool === "shape" ? "flex" : "none";
    const textOptions = document.getElementById("textOptions");
    if (textOptions) textOptions.style.display = tool === "text" ? "flex" : "none";
  }

  function updateCursor() {
    const cursors = { pencil:"crosshair", brush:"crosshair", marker:"crosshair", eraser:"cell", fill:"copy", eyedropper:"zoom-in", text:"text", shape:"crosshair", line:"crosshair", highlighter:"crosshair" };
    if (canvas) canvas.style.cursor = cursors[state.tool] || "crosshair";
  }

  function renderPalette(name) {
    const grid = document.getElementById("paletteGrid");
    if (!grid) return;
    grid.innerHTML = "";
    (PALETTES[name] || PALETTES.classic).forEach(c => {
      const s = document.createElement("button");
      s.className = "palette-swatch";
      s.style.background = c;
      s.title = c;
      s.setAttribute("aria-label", `Color ${c}`);
      s.addEventListener("click", () => {
        state.color = c;
        updateColorUI(c);
        s.classList.add("active");
      });
      grid.appendChild(s);
    });
  }

  // ── Canvas Actions ───────────────────────────────────────────────
  function clearCanvas() {
    if (!confirm("Clear the canvas? This cannot be undone easily.")) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fillBackground();
    saveHistory();
  }

  function downloadCanvas(format) {
    const link = document.createElement("a");
    if (format === "png") {
      link.download = "drawasketch_" + Date.now() + ".png";
      link.href = canvas.toDataURL("image/png");
    } else if (format === "jpg") {
      link.download = "drawasketch_" + Date.now() + ".jpg";
      link.href = canvas.toDataURL("image/jpeg", 0.92);
    } else if (format === "svg") {
      // basic SVG export
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${canvas.toDataURL()}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
      const blob = new Blob([svgData], {type:"image/svg+xml"});
      link.href = URL.createObjectURL(blob);
      link.download = "drawasketch_" + Date.now() + ".svg";
    }
    link.click();
  }

  function toggleGrid() {
    state.gridVisible = !state.gridVisible;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    fillBackground();
    ctx.putImageData(snap, 0, 0);
    if (state.gridVisible) drawGrid();
    const btn = document.getElementById("gridBtn");
    if (btn) btn.classList.toggle("active", state.gridVisible);
  }

  // ── Bind Events ──────────────────────────────────────────────────
  function bindEvents() {
    // Drawing events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("touchstart", startDrawing, {passive:false});
    canvas.addEventListener("touchmove", draw, {passive:false});
    canvas.addEventListener("touchend", stopDrawing);

    // Tools
    document.querySelectorAll(".tool-btn").forEach(btn => {
      btn.addEventListener("click", () => setTool(btn.dataset.tool));
    });

    // Color picker
    const colorPicker = document.getElementById("colorPicker");
    if (colorPicker) colorPicker.addEventListener("input", e => { state.color = e.target.value; updateColorUI(e.target.value); });

    // Brush size
    const brushSlider = document.getElementById("brushSize");
    const brushVal = document.getElementById("brushVal");
    if (brushSlider) {
      brushSlider.addEventListener("input", e => { state.brushSize = +e.target.value; if (brushVal) brushVal.textContent = e.target.value; });
    }

    // Opacity
    const opacitySlider = document.getElementById("opacitySlider");
    const opacityVal = document.getElementById("opacityVal");
    if (opacitySlider) {
      opacitySlider.addEventListener("input", e => { state.opacity = +e.target.value / 100; if (opacityVal) opacityVal.textContent = e.target.value + "%"; });
    }

    // Palette tabs
    document.querySelectorAll(".palette-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".palette-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderPalette(tab.dataset.palette);
      });
    });

    // Shape type
    document.querySelectorAll(".shape-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.shapeType = btn.dataset.shape;
        document.querySelectorAll(".shape-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    // Fill checkbox
    const fillCheck = document.getElementById("fillShape");
    if (fillCheck) fillCheck.addEventListener("change", e => state.fillShape = e.target.checked);

    // Action buttons
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    const clearBtn = document.getElementById("clearBtn");
    const gridBtn = document.getElementById("gridBtn");
    if (undoBtn) undoBtn.addEventListener("click", undo);
    if (redoBtn) redoBtn.addEventListener("click", redo);
    if (clearBtn) clearBtn.addEventListener("click", clearCanvas);
    if (gridBtn) gridBtn.addEventListener("click", toggleGrid);

    // Download buttons
    document.querySelectorAll(".download-btn").forEach(btn => {
      btn.addEventListener("click", () => downloadCanvas(btn.dataset.format));
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", e => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const map = { "p":"pencil","b":"brush","e":"eraser","f":"fill","s":"shape","l":"line","t":"text","h":"highlighter","m":"marker","i":"eyedropper" };
      if (map[e.key]) setTool(map[e.key]);
      if ((e.ctrlKey||e.metaKey) && e.key==="z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey||e.metaKey) && (e.key==="y"||(e.shiftKey&&e.key==="Z"))) { e.preventDefault(); redo(); }
      if ((e.ctrlKey||e.metaKey) && e.key==="s") { e.preventDefault(); downloadCanvas("png"); }
    });
  }

  // ── Scroll Animations ─────────────────────────────────────────────
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".animate-in").forEach(el => observer.observe(el));
  }

  // ── Counter Animation ─────────────────────────────────────────────
  function initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const duration = 1800;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target).toLocaleString() + (el.dataset.suffix || "");
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".counter-num").forEach(el => observer.observe(el));
  }

  // ── FAQ Accordion ─────────────────────────────────────────────────
  function initFAQ() {
    document.querySelectorAll(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(i => i.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      });
    });
  }

  // ── Floating Particles ────────────────────────────────────────────
  function initParticles() {
    const container = document.getElementById("particles");
    if (!container) return;
    const icons = ["✏️","🎨","🖌️","✒️","🖍️","🎭","🌸","⭐","🌈","💫"];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = icons[i % icons.length];
      p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*8}s;animation-duration:${6+Math.random()*8}s;font-size:${14+Math.random()*16}px;opacity:${0.15+Math.random()*0.25}`;
      container.appendChild(p);
    }
  }

  // ── Boot ─────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    init();
    initScrollAnimations();
    initCounters();
    initFAQ();
    initParticles();
    setTool("pencil");
  });
})();
