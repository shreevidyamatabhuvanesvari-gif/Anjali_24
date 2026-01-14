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
   RESPONSE ENGINE v3
========================= */
window.ResponseEngine = {
  respond: function(rawText){
    try{
      const text = clean(rawText);

      /* ─────────────
         0) HARD FACTS
      ───────────── */

      // Owner / Identity
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

      // Who is Anjali
      if(
        text.includes("कौन") &&
        (text.includes("हो") || text.includes("है") || text.includes("हूँ"))
      ){
        if(window.SelfModel){
          const me = SelfModel.getIdentity();
          return "मेरा नाम " + me.name + " है 🤍";
        }
      }

      // Past feeling
      if(
        (text.includes("कैसा") || text.includes("कैसे")) &&
        (text.includes("महसूस") || text.includes("feel"))
      ){
        if(window.LongTermMemory){
          const mem = LongTermMemory.getAll();
          if(mem.events.length > 0){
            return "तुमने पहले कहा था: " + mem.events[mem.events.length-1].text;
          }
        }
        return "मुझे तुम्हारी पिछली भावना याद नहीं आ रही 🤍";
      }

      /* ─────────────
         1) CONTEXT
      ───────────── */
      let context = {};
      if(window.ContextWeaver){
        context = ContextWeaver.build(text);
      }

      /* ─────────────
         2) PERSPECTIVE
      ───────────── */
      let perspective = null;
      if(window.PerspectiveEngine){
        perspective = PerspectiveEngine.infer(text, context);
      }

      /* ─────────────
         3) INTENT
      ───────────── */
      let intent = "chat";
      if(window.IntentDetector){
        intent = IntentDetector.detect(text);
      }

      /* ─────────────
         4) STATE
      ───────────── */
      if(window.ConversationState){
        ConversationState.prevMood = ConversationState.mood || "neutral";
        ConversationState.update(text);
      }

      /* ─────────────
         5) RELATIONSHIP
      ───────────── */
      if(window.RelationshipModel){
        RelationshipModel.updateFromInteraction(intent);
      }

      /* ─────────────
         6) MEMORY
      ───────────── */
      if(window.LongTermMemory){
        if(intent === "emotion") LongTermMemory.addEvent(text);
        if(intent === "teach") LongTermMemory.addFact(text);
      }

      /* ─────────────
         7) THINKING
      ───────────── */
      if(window.GoalEngine && window.RelationshipModel){
        GoalEngine.update(ConversationState.mood, RelationshipModel.get());
      }

      if(window.PlanningEngine && window.GoalEngine){
        PlanningEngine.update(
          ConversationState.mood,
          RelationshipModel.get(),
          GoalEngine.get().current
        );
      }

      if(window.ReflectionEngine && window.GoalEngine){
        ReflectionEngine.reflect(
          ConversationState.prevMood || "neutral",
          ConversationState.mood,
          GoalEngine.get().current
        );
      }

      /* ─────────────
          8) KNOWLEDGE
        ───────────── */
let reply = findAnswer(text);

/* 🧠 If no learned QA → use GenerativeLayer */
if(!reply && window.GenerativeLayer && window.LongTermMemory){
  const mem = LongTermMemory.getAll();
  reply = GenerativeLayer.generate(
    text,
    context,
    mem,
    ConversationState.mood,
    RelationshipModel.get()
  );
}

/* 🔄 Absolute fallback */
if(!reply){
  reply = "मैं तुम्हारी बात ध्यान से सुन रही हूँ 🤍";
}

      /* ─────────────
         9) EMOTION TONE
      ───────────── */
      if(window.EmotionEngine && window.ConversationState){
        reply = EmotionEngine.applyTone(reply, ConversationState.mood);
      }

      /* ─────────────
         10) CLEANUP
      ───────────── */
      if(window.MemoryPruner && window.LongTermMemory){
        MemoryPruner.prune(LongTermMemory);
      }

      return reply;

    }catch(e){
      console.error(e);
      return "मुझे सोचने में परेशानी हुई 😔";
    }
  }
};

})();
