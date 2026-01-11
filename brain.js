let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || { qa: [] };

function saveAll(){
  localStorage.setItem("anjaliMemory", JSON.stringify(memory));
}

function clean(text){
  return text.toLowerCase().replace(/[^\u0900-\u097F a-z0-9]/g,"").trim();
}

/* SAVE FROM ADMIN */
function saveQA(q,a){
  memory.qa.push({q: clean(q), a: a});
  saveAll();
}

/* SHOW IN ADMIN */
function showMemory(){
  return memory.qa.map(m => "❓ " + m.q + " → " + m.a).join("<br>");
}

/* SMART SEARCH */
function similarity(a,b){
  let A=a.split(" "), B=b.split(" ");
  let match=0;
  for(let w of A){ if(B.includes(w)) match++; }
  return match/Math.max(A.length,B.length);
}

function getAnswer(text){
  text = clean(text);
  let best=null, score=0;

  for(let item of memory.qa){
    let s = similarity(text, item.q);
    if(s>score){ score=s; best=item; }
  }

  if(score>0.4) return best.a;
  return "मैं समझ नहीं पाई… मुझे सिखाओ 🤍";
}
