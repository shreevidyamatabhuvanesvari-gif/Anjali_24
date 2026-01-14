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
  return clean(t).split(" ").filter(w => w.length > 1);
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
   SAFE HELPERS
========================= */
function safe(fn, fallback=null){
  try{ return fn(); }catch(e){ return fallback; }
}

/* =========================
   RESPONSE ENGINE
========================= */
window.ResponseEngine = {
  respond: function(rawText){
    try{
      const text = clean(rawText);

      /* ── 1. WHO IS ANJALI ── */
      if(text.includes("कौन") && (text.includes("हो") || text.includes("है"))){
        if(window.SelfModel){
          const me = safe(()=>SelfModel.getIdentity(), {name:"अंजली"});
          return "मेरा नाम " + (me.name || "अंजली") + " है 🤍";
        }
      }

      /* ── 2. OWNER ── */
      if(text.includes("किसकी") || text.includes("owner") || text.includes("मुख्य")){
        if(window.Ethos){
          const o = safe(()=>Ethos.getPrimaryUser(), null);
          if(o && o !== "default") return "मैं " + o + " की हूँ 💖";
          return "मेरा primary user सेट नहीं है 🤍";
        }
      }

      /* ── 3. PAST EMOTION ── */
      if(text.includes("कैसा") && text.includes("महसूस")){
        if(window.LongTermMemory){
          const mem = safe(()=>LongTermMemory.getAll(), null);
          if(mem && mem.events && mem.events.length){
            return "तुमने पहले कहा था: " + mem.events[mem.events.length-1].text;
          }
        }
        return "मुझे तुम्हारी पिछली भावना याद नहीं आ रही 🤍";
      }

      /* ── 4. LEARNED QA ── */
      let reply = findAnswer(text);
      if(reply) return reply;

      /* ── 5. FALLBACK ── */
      return "मैं तुम्हारी बात सुन रही हूँ 🤍";

    }catch(e){
      console.error("Anjali Crash:", e);
      return "मैं अभी थोड़ा उलझ गई हूँ… फिर से कहो 🤍";
    }
  }
};

})();
