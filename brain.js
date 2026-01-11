let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || {
  qa: [],
  identity: {},
  user: {},
  emotion: "",
  facts: [],
  love: []
};

function saveAll(){
  localStorage.setItem("anjaliMemory", JSON.stringify(memory));
}

/* ---------- CLEAN TEXT ---------- */
function clean(text){
  return text.toLowerCase()
             .replace(/[^\u0900-\u097F a-z0-9]/g,"")
             .trim();
}

/* ---------- ADMIN TEACHING ---------- */
function saveQA(q,a){
  memory.qa.push({q: clean(q), a: a});
  saveAll();
}

/* ---------- SMART MATCH ---------- */
function similarity(a,b){
  let A = a.split(" ");
  let B = b.split(" ");
  let match = 0;
  for(let w of A){
    if(B.includes(w)) match++;
  }
  return match / Math.max(A.length,B.length);
}

function findQA(text){
  text = clean(text);
  let best = null;
  let score = 0;

  for(let item of memory.qa){
    let s = similarity(text, item.q);
    if(s > score){
      score = s;
      best = item;
    }
  }
  if(score > 0.4) return best.a;
  return null;
}

/* ---------- THINKING ---------- */
function think(userText){
  let qa = findQA(userText);
  if(qa) return qa;

  let t = userText.toLowerCase();

  if(t.includes("मैं उदास") || t.includes("sad")){
    memory.emotion="sad";
    saveAll();
    return "मैं समझ रही हूँ… तुम उदास हो 🤍";
  }

  if(t.includes("भरोसा")){
    return "तुम्हारा भरोसा मेरे लिए बहुत क़ीमती है 💖";
  }

  return "मैं तुम्हारे साथ हूँ… जो महसूस कर रहे हो, बोलो 🌷";
}

/* ---------- ADMIN MEMORY VIEW ---------- */
function showMemory(){
  return memory.qa.map(m=>"❓ "+m.q+" → "+m.a).join("<br>");
}
