(function(){

/* =========================
   CORE QA MEMORY
========================= */
let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || [];

function saveMemory(){
  localStorage.setItem("anjaliMemory", JSON.stringify(memory));
}

function clean(t){
  return (t||"").toLowerCase()
    .replace(/[^\u0900-\u097F a-z0-9 ]/g,"")
    .replace(/\s+/g," ")
    .trim();
}

/* Admin */
window.saveQA = function(q,a){
  if(!q || !a) return;
  memory.push({ q: clean(q), a: a });
  saveMemory();
};

window.showMemory = function(){
  return memory.map(m=>"❓ "+m.q+" → "+m.a).join("<br>");
};

/* =========================
   MATCHING
========================= */
function tokenize(t){
  return clean(t).split(" ").filter(w=>w.length>1);
}

function similarity(a,b){
  const A = tokenize(a), B = tokenize(b);
  let m = 0;
  for(let w of A){ if(B.includes(w)) m++; }
  return m / Math.max(B.length,1);
}

function findAnswer(text){
  let best=null, score=0;
  for(let m of memory){
    const s = similarity(text, m.q);
    if(s > score){
      score = s;
      best = m;
    }
  }
  if(best && score > 0) return best.a;
  return null;
}

/* =========================
   RESPONSE ENGINE v3
========================= */
window.ResponseEngine = {
  respond: function(rawText){
    try{
      const text = clean(rawText);

      /* 🪞 Identity & Owner */
      if(
        text.includes("किसकी") ||
        text.includes("किसका") ||
        text.includes("किसके") ||
        text.includes("owner") ||
        text.includes("मुख्य") ||
        text.includes("प्राथमिक")
      ){
        if(window.Ethos && window.SelfModel){
          const owner = Ethos.getPrimaryUser();
          const me = SelfModel.getIdentity();
          if(owner && owner !== "default"){
            return "मैं " + owner + " की " + (me.role || "साथी") + " हूँ 💖";
          }
          return "मेरा कोई primary user अभी सेट नहीं है 🤍";
        }
      }

      /* Who is Anjali */
      if(text.includes("कौन") && (text.includes("हो") || text.includes("है") || text.includes("हूँ"))){
        if(window.SelfModel){
          const me = SelfModel.getIdentity();
          return "मेरा नाम " + me.name + " है 🤍";
        }
      }

      /* Past feeling */
      if(
        (text.includes("कैसा") || text.includes("कैसे")) &&
        text.includes("महसूस")
      ){
        if(window.LongTermMemory){
          const mem = LongTermMemory.getAll();
          if(mem.events.length > 0){
            return "तुमने पहले कहा था: " + mem.events[mem.events.length-1].text;
          }
        }
        return "मुझे तुम्हारी पिछली भावना याद नहीं आ रही 🤍";
      }

      /* Mood update */
      if(window.ConversationState){
        ConversationState.update(text);
      }

      /* Relationship update */
      if(window.RelationshipModel){
        RelationshipModel.updateFromInteraction("chat");
      }

      /* Emotion memory */
      if(window.LongTermMemory){
        if(text.includes("अकेला") || text.includes("उदास") || text.includes("खुश") || text.includes("प्यार")){
          LongTermMemory.addEvent(text);
        }
      }

      /* ─────────────
          8) KNOWLEDGE
        ───────────── */
let reply = findAnswer(text);

/* अगर memory में जवाब नहीं है → Ollama से पूछो */
if(!reply && window.OllamaBrain){
  reply = await OllamaBrain.ask(text);
}

/* अगर Ollama भी न मिले */
if(!reply){
  reply = "मैं सोच रही हूँ… थोड़ा समय दो 🤍";
}

      /* Absolute fallback */
      if(!reply){
        reply = "मैं तुम्हारी बात ध्यान से सुन रही हूँ 🤍";
      }

      /* Emotion tone */
      if(window.EmotionEngine && window.ConversationState){
        reply = EmotionEngine.applyTone(reply, ConversationState.mood);
      }

      return reply;

    }catch(e){
      console.error(e);
      return "मुझे सोचने में परेशानी हुई 😔";
    }
  }
};

})();
