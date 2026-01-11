let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || [];

function saveQA(q, a){
  memory.push({q:q.toLowerCase(), a:a});
  localStorage.setItem("anjaliMemory", JSON.stringify(memory));
}

function getAnswer(userText){
  userText = userText.toLowerCase();
  for(let item of memory){
    if(userText.includes(item.q)){
      return item.a;
    }
  }
  return "मैं ठीक से समझ नहीं पाई… मुझे सिखाओ न 🤍";
}

function showMemory(){
  return memory.map(m => "❓ " + m.q + " → " + m.a).join("<br>");
}
