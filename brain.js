let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || [];

function clean(text){
  return text.toLowerCase()
             .replace(/[^\u0900-\u097F a-z0-9]/g, "") // remove ? ! ।
             .trim();
}

function saveQA(q, a){
  memory.push({q: clean(q), a: a});
  localStorage.setItem("anjaliMemory", JSON.stringify(memory));
}

function getAnswer(userText){
  const user = clean(userText);

  let bestMatch = null;
  let bestScore = 0;

  for(let item of memory){
    let score = similarity(user, item.q);
    if(score > bestScore){
      bestScore = score;
      bestMatch = item;
    }
  }

  if(bestScore > 0.4){
    return bestMatch.a;
  }

  return "मैं ठीक से समझ नहीं पाई… मुझे सिखाओ न 🤍";
}

function similarity(a, b){
  const aWords = a.split(" ");
  const bWords = b.split(" ");
  let match = 0;

  for(let w of aWords){
    if(bWords.includes(w)) match++;
  }
  return match / Math.max(aWords.length, bWords.length);
}

function showMemory(){
  return memory.map(m => "❓ " + m.q + " → " + m.a).join("<br>");
}
