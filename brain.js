let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || [];

function saveMemory(){
  localStorage.setItem("anjaliMemory", JSON.stringify(memory));
}

function clean(t){
  return t.toLowerCase().replace(/[^\u0900-\u097F a-z0-9]/g,"").trim();
}

/* ADMIN SAVE */
function saveQA(q,a){
  memory.push({q: clean(q), a:a});
  saveMemory();
}

/* SHOW IN ADMIN */
function showMemory(){
  return memory.map(m=>"❓ "+m.q+" → "+m.a).join("<br>");
}

/* SEARCH */
function getAnswer(text){
  text = clean(text);

  let best=null, score=0;

  for(let m of memory){
    let s = similarity(text, m.q);
    if(s>score){
      score=s;
      best=m;
    }
  }

  if(score>0.4) return best.a;
  return "मुझे यह नहीं पता… मुझे सिखाओ 🤍";
}

function similarity(a,b){
  let A=a.split(" "), B=b.split(" ");
  let m=0;
  for(let w of A){ if(B.includes(w)) m++; }
  return m / Math.max(A.length,B.length);
}
