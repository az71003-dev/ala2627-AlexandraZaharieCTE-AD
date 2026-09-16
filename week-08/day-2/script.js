
var NL = String.fromCharCode(10);
var RC = null;

/* modals */
document.querySelectorAll("[data-open]").forEach(function(b){
  b.addEventListener("click", function(){
    var d = document.getElementById(b.getAttribute("data-open"));
    if (d && d.showModal) d.showModal();
  });
});
document.querySelectorAll("[data-close]").forEach(function(b){
  b.addEventListener("click", function(){ b.closest("dialog").close(); });
});
document.querySelectorAll("dialog").forEach(function(d){
  d.addEventListener("click", function(e){ if (e.target === d) d.close(); });
});

/* success criteria progress */
var scBoxes = [].slice.call(document.querySelectorAll("input[data-sc]"));
var scBar = document.getElementById("scbar"), scNum = document.getElementById("scnum");
function scSync(){
  var n = scBoxes.filter(function(b){ return b.checked; }).length;
  if (scBar) scBar.style.width = (scBoxes.length ? (n / scBoxes.length) * 100 : 0) + "%";
  if (scNum) scNum.textContent = n + "/" + scBoxes.length;
}
scBoxes.forEach(function(b){ b.addEventListener("change", scSync); });
scSync();

/* copy buttons */
document.querySelectorAll(".codewrap .cp").forEach(function(b){
  b.addEventListener("click", function(){
    var t = b.parentElement.querySelector("pre").innerText;
    function done(){ b.textContent = "Copied"; b.classList.add("ok");
      setTimeout(function(){ b.textContent = "Copy"; b.classList.remove("ok"); }, 1600); }
    function fb(){ var r = document.createRange(); r.selectNodeContents(b.parentElement.querySelector("pre"));
      var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Press Ctrl+C";
      setTimeout(function(){ b.textContent = "Copy"; }, 2200); }
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, fb); else fb();
  });
});

/* ---- labs ---- */
var fx = document.getElementById("fx"), ro = document.getElementById("ro"), axis = document.getElementById("axis");
var state = {};
function segWire(onChange){
  document.querySelectorAll(".seg").forEach(function(seg){
    var prop = seg.getAttribute("data-prop");
    var pressed = seg.querySelector("[aria-pressed=true]");
    state[prop] = pressed ? pressed.getAttribute("data-v") : null;
    seg.querySelectorAll("button").forEach(function(btn){
      btn.addEventListener("click", function(){
        seg.querySelectorAll("button").forEach(function(o){ o.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        state[prop] = btn.getAttribute("data-v");
        onChange();
      });
    });
  });
  onChange();
}
function css(rules){
  return rules.map(function(r){
    return '<span class="p">' + r[0] + '</span>: <span class="v">' + r[1] + '</span>;';
  }).join("<br>");
}

if (fx && document.querySelector('.seg[data-prop="flex-direction"]')) {
  segWire(function(){
    fx.style.flexDirection  = state["flex-direction"];
    fx.style.justifyContent = state["justify-content"];
    fx.style.alignItems     = state["align-items"];
    ro.innerHTML = ".cards {<br>&nbsp;&nbsp;" + css([
      ["display","flex"],["flex-direction",state["flex-direction"]],
      ["justify-content",state["justify-content"]],["align-items",state["align-items"]]
    ]).split("<br>").join("<br>&nbsp;&nbsp;") + "<br>}";
    var col = state["flex-direction"] === "column";
    axis.innerHTML = col
      ? "Direction is <b>column</b>, so the main axis runs <b>down</b>. justify-content is now moving things <b>vertically</b> and align-items is moving them <b>across</b>. They swapped."
      : "Direction is <b>row</b>, so the main axis runs <b>across</b>. justify-content moves things <b>horizontally</b>, align-items moves them <b>vertically</b>.";
  });
}

if (fx && document.querySelector('.seg[data-prop="tool"]')) {
  var b1 = document.getElementById("sb1"), b2 = document.getElementById("sb2"), b3 = document.getElementById("sb3");
  segWire(function(){
    var n = state["size"] + "px", tool = state["tool"];
    fx.style.gap = tool === "gap" ? n : "0px";
    [b1,b2,b3].forEach(function(b){
      b.style.padding = tool === "padding" ? n : "0.7rem 0.9rem";
      b.style.margin  = tool === "margin"  ? n : "0px";
    });
    ro.innerHTML = tool === "gap"
      ? ".cards {<br>&nbsp;&nbsp;" + css([["display","flex"],["gap",n]]).split("<br>").join("<br>&nbsp;&nbsp;") + "<br>}"
      : ".card {<br>&nbsp;&nbsp;" + css([[tool,n]]) + "<br>}";
    axis.innerHTML = tool === "gap"
      ? "<b>gap</b> sits between the boxes and adds nothing to the outside edges. It only works because the parent is a flex container."
      : tool === "padding"
        ? "<b>padding</b> is inside each box, so the boxes grow. The space between them has not changed."
        : "<b>margin</b> is outside each box, so it pushes the neighbours away &mdash; and it also pushes against the container edge, which gap does not.";
  });
}

if (document.getElementById("dbtn")) {
  var ro2 = document.getElementById("ro");
  ro2.innerHTML = ".btn:hover&nbsp;&nbsp;&nbsp;&nbsp;{ " + '<span class="p">filter</span>: <span class="v">brightness(1.15)</span>;' + " }<br>" +
    ".btn:focus-visible { " + '<span class="p">box-shadow</span>: <span class="v">0 0 0 4px</span>;' + " }<br>" +
    ".btn:active&nbsp;&nbsp;&nbsp;{ " + '<span class="p">transform</span>: <span class="v">translateY(2px)</span>;' + " }";
}

/* ---- JavaScript labs ---- */
function escH(t){ return String(t).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;"); }
var cout = document.getElementById("cout");
function logLine(text, bad){
  if (!cout) return;
  var row = document.createElement("div"); row.className = bad ? "err" : "ok"; row.textContent = text;
  cout.appendChild(row); cout.scrollTop = cout.scrollHeight;
}

if (document.querySelector('[data-lab="console"]')) {
  var cin = document.getElementById("cin");
  var cline = function(){
    var msg = cin.value;
    return state["quotes"] === "forgot" ? "console.log(" + msg + ");" : 'console.log("' + msg + '");';
  };
  segWire(function(){ ro.innerHTML = '<span class="p">// script.js</span><br>' + escH(cline()); });
  cin.addEventListener("input", function(){ ro.innerHTML = '<span class="p">// script.js</span><br>' + escH(cline()); });
  document.getElementById("crun").addEventListener("click", function(){
    var msg = cin.value;
    if (state["quotes"] === "forgot") {
      /* the real browser error, not a made-up one: one word is a name nobody defined;
         several words are not even valid code, so the browser stops before running it */
      var parts = msg.trim().split(" ").filter(function(w){ return w.length; });
      if (parts.length > 1) {
        logLine("Uncaught SyntaxError: missing ) after argument list", true);
        axis.innerHTML = "Red. Without quotes, JavaScript reads <b>" + escH(parts[0]) + " " + escH(parts[1]) + "</b> as code, and that is not valid code &mdash; so nothing in the file runs. Quotes mean <b>this is text</b>.";
      } else {
        var word = parts[0] || "message";
        logLine("Uncaught ReferenceError: " + word + " is not defined", true);
        axis.innerHTML = "Red. Without quotes JavaScript thinks <b>" + escH(word) + "</b> is the name of something, and nothing has that name. Quotes mean <b>this is text</b>.";
      }
    } else {
      logLine(msg, false);
      axis.innerHTML = "It printed. That is JavaScript talking back to you &mdash; every day this week starts here.";
    }
  });
}

if (document.querySelector('[data-lab="click"]')) {
  var kb = document.getElementById("cbtn"), kt = document.getElementById("ctext");
  var kcol = ["#3effa0", "#f5c842", "#818cf8", "#f43f5e"], kci = 0, kev = null;
  var kdo = function(){
    var d = state["does"];
    if (d === "log") logLine("The button was used (" + state["event"] + ")", false);
    if (d === "text") kt.textContent = "You did it. The page changed.";
    if (d === "colour") { kci = (kci + 1) % kcol.length; kb.style.background = kcol[kci]; kb.style.borderColor = kcol[kci]; }
  };
  segWire(function(){
    if (kev) kb.removeEventListener(kev, kdo);
    kev = state["event"]; kb.addEventListener(kev, kdo);
    kt.textContent = "Nothing has happened yet."; kb.style.background = ""; kb.style.borderColor = "";
    var inner = state["does"] === "log" ? 'console.log("The button was used");'
      : state["does"] === "text" ? 'output.textContent = "You did it. The page changed.";'
      : 'button.style.background = "gold";';
    var lines = ['const button = document.querySelector("#action");'];
    if (state["does"] === "text") lines.push('const output = document.querySelector("#output");');
    lines.push("");
    lines.push('button.addEventListener("' + kev + '", function () {');
    ro.innerHTML = lines.map(escH).join("<br>") + "<br>&nbsp;&nbsp;" + escH(inner) + "<br>" + escH("});");
    axis.innerHTML = kev === "click" ? "<b>click</b> runs the function once the button is pressed and let go."
      : kev === "dblclick" ? "<b>dblclick</b> needs two quick clicks. Try one click &mdash; nothing happens now."
      : "<b>mouseenter</b> runs the moment the pointer arrives. No click at all.";
  });
}

if (document.querySelector('[data-lab="state"]')) {
  var sb = document.getElementById("sbtn"), sv = document.getElementById("sval");
  var count = 0, isOn = false, spot = 0, msgs = ["Go team!", "Practice starts at 3", "Big game Friday"];
  var sdraw = function(){
    var f = state["feature"], code = [];
    if (f === "counter") { sv.textContent = String(count); sb.textContent = "Add one";
      code = ["let count = " + count + ";", "", "function addOne() {", "  count = count + 1;", "  output.textContent = count;", "}", "", 'button.addEventListener("click", addOne);']; }
    if (f === "toggle") { sv.textContent = isOn ? "ON" : "OFF"; sb.textContent = "Switch";
      code = ["let isOn = " + isOn + ";", "", "function flip() {", "  isOn = !isOn;", '  output.textContent = isOn ? "ON" : "OFF";', "}", "", 'button.addEventListener("click", flip);']; }
    if (f === "messages") { sv.textContent = msgs[spot]; sb.textContent = "Next";
      code = ['let messages = ["Go team!", "Practice starts at 3", "Big game Friday"];', "let spot = " + spot + ";", "", "function next() {", "  spot = (spot + 1) % messages.length;", "  output.textContent = messages[spot];", "}", "", 'button.addEventListener("click", next);']; }
    ro.innerHTML = code.map(function(l){ return escH(l).split("  ").join("&nbsp;&nbsp;"); }).join("<br>");
  };
  sb.addEventListener("click", function(){
    var f = state["feature"];
    if (f === "counter") count = count + 1;
    if (f === "toggle") isOn = !isOn;
    if (f === "messages") spot = (spot + 1) % msgs.length;
    sdraw();
    axis.innerHTML = "Look at the first line: the value changed. <b>That is a variable</b> &mdash; the page remembering something between clicks.";
  });
  segWire(sdraw);
}

/* receipt */
var rcGo = document.getElementById("rc-go");
if (rcGo) rcGo.addEventListener("click", function(){
  var name = (document.getElementById("rc-name").value || "").trim();
  var period = (document.getElementById("rc-period").value || "").trim();
  var msg = document.getElementById("rc-msg");
  if (!name) { msg.textContent = "Put your name in first — the receipt is no use without it."; return; }
  var boxes = [].slice.call(document.querySelectorAll("input[data-rc]"));
  var items = boxes.map(function(b){
    return { done: b.checked, text: b.parentElement.querySelector("span").textContent.trim() };
  });
  var doneN = items.filter(function(i){ return i.done; }).length;
  var L = [];
  L.push("RECEIPT — " + RC.course);
  L.push(RC.title);
  L.push("Week " + RC.week + " · Day " + RC.day + " · " + RC.date);
  L.push("");
  L.push("Name:      " + name);
  L.push("Period:    " + (period || "not given"));
  L.push("Finished:  " + new Date().toLocaleString());
  L.push("Completed: " + doneN + " of " + items.length);
  L.push("");
  L.push("WHAT I DID");
  items.forEach(function(i, n){ L.push("  [" + (i.done ? "x" : " ") + "] " + (n + 1) + ". " + i.text); });
  L.push("");
  var basis = name + "|" + period + "|" + RC.day + "|" + items.map(function(i){ return i.done ? 1 : 0; }).join("");
  var h = 0; for (var k = 0; k < basis.length; k++) { h = ((h << 5) - h + basis.charCodeAt(k)) | 0; }
  L.push("check: " + (h >>> 0).toString(36).toUpperCase());
  L.push("(If this line is edited it will not match the answers above.)");
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([L.join(NL)], { type: "text/plain" }));
  a.download = RC.file + "-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".txt";
  document.body.appendChild(a); a.click(); a.remove();
  msg.textContent = "Downloaded. Upload that file to the assignment.";
});
