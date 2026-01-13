(function(){

/* ===== MEMORY (QA) ===== */
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

/* ===== MATCHING ===== */
function tokenize(t){
  return clean(t).split(" ").filter(w => w.length > 1);
}

function matchScore(a,b){
  const A = tokenize(a);
  const B = tokenize(b);
  let m=0;
  for(let w of A){ if(B.includes(w)) m++; }
  return m / Math.max(B.length,1);
}

function findAnswer(text){
  let best=null, score=0;
  for(let m of memory){
    const s = matchScore(text, m.q);
    if(s > score){
      score = s;
      best = m;
    }
  }
  if(best && score > 0) return best.a;
  return null;
}

/* ===== RESPONSE ENGINE ===== */
window.ResponseEngine = {
  respond: function(rawText){
    try{
      const text = clean(rawText);

      /* ─────────────────────────────
         0️⃣ HARD OVERRIDES (must win)
      ───────────────────────────── */

      // 🔑 Who owns Anjali?
      if(
        text.includes("किसकी") ||
        text.includes("किसका") ||
        text.includes("किसके") ||
        text.includes("owner") ||
        text.includes("मुख्य") ||
        text.includes("प्राथमिक") ||
        text.includes("primary")
      ){
        if(window.Ethos && window.SelfModel){
          const owner = Ethos.getPrimaryUser();
          const me = SelfModel.getIdentity();

          if(owner && owner !== "default"){
            return "मैं " + owner + " की " + (me.role || "साथी") + " हूँ 💖";
          }else{
            return "मेरा कोई primary user अभी सेट नहीं है 🤍";
          }
        }
      }

      // 🧠 What was my last feeling?
      if(
        (text.includes("कैसा") || text.includes("कैसे")) &&
        (text.includes("महसूस") || text.includes("feel"))
      ){
        if(window.LongTermMemory){
          const mem = LongTermMemory.getAll();
          if(mem && mem.events && mem.events.length > 0){
            const last = mem.events[mem.events.length - 1];
            return "तुमने पहले कहा था: " + last.text;
          }
        }
        return "मुझे तुम्हारी पिछली भावना याद नहीं आ रही 🤍";
      }

      // 🪞 Who is Anjali?
      if(
        text.includes("कौन") &&
        (text.includes("हो") || text.includes("है") || text.includes("हूँ"))
      ){
        if(window.SelfModel){
          const me = SelfModel.getIdentity();
          return "मेरा नाम " + me.name + " है 🤍";
        }
      }

      /* ─────────────────────────────
         1️⃣ Context + Perspective
      ───────────────────────────── */
      let context = {};
      if(window.ContextWeaver){
        context = ContextWeaver.build(text);
      }

      let perspective = null;
      if(window.PerspectiveEngine){
        perspective = PerspectiveEngine.infer(text, context);
      }

      /* ─────────────────────────────
         2️⃣ Intent
      ───────────────────────────── */
      let intent = "chat";
      if(window.IntentDetector){
        intent = IntentDetector.detect(text);
      }

      /* ─────────────────────────────
         3️⃣ Conversation state
      ───────────────────────────── */
      if(window.ConversationState){
        ConversationState.prevMood = ConversationState.mood || "neutral";
        ConversationState.update(text);
      }

      /* ─────────────────────────────
         4️⃣ Relationship
      ───────────────────────────── */
      if(window.RelationshipModel){
        RelationshipModel.updateFromInteraction(intent);
      }

      /* ─────────────────────────────
         5️⃣ Long-term memory
      ───────────────────────────── */
      if(window.LongTermMemory){
        if(intent === "emotion") LongTermMemory.addEvent(text);
        if(intent === "teach") LongTermMemory.addFact(text);
      }

      /* ─────────────────────────────
         6️⃣ Goal + Planning
      ───────────────────────────── */
      let plan = null;
      if(window.GoalEngine && window.RelationshipModel){
        GoalEngine.update(ConversationState.mood, RelationshipModel.get());
      }

      if(window.PlanningEngine && window.GoalEngine){
        plan = PlanningEngine.decide(
          text,
          ConversationState,
          RelationshipModel.get(),
          GoalEngine.get(),
          perspective
        );
      }

      /* ─────────────────────────────
         7️⃣ Reflection
      ───────────────────────────── */
      if(window.ReflectionEngine && window.GoalEngine){
        ReflectionEngine.reflect(
          ConversationState.prevMood || "neutral",
          ConversationState.mood,
          GoalEngine.get().current
        );
      }

      /* ─────────────────────────────
         8️⃣ Plan-based identity
      ───────────────────────────── */
      if(plan && plan.type === "identity" && window.SelfModel){
        const me = SelfModel.getIdentity();
        let owner = "मेरे दिल के सबसे करीब";
        if(window.Ethos){
          const o = Ethos.getPrimaryUser();
          if(o && o !== "default") owner = o;
        }
        return "मेरा नाम " + me.name + " है, और मैं " + owner + " की हूँ 💖";
      }

      /* ─────────────────────────────
         9️⃣ Knowledge base
      ───────────────────────────── */
      let reply = findAnswer(text);

      if(!reply && plan && plan.composeFallback){
        reply = plan.composeFallback(perspective, context);
      }

      if(!reply){
        reply = "मैं तुम्हारी बात समझने की कोशिश कर रही हूँ…";
      }

      /* ─────────────────────────────
         🔟 Emotion tone
      ───────────────────────────── */
      if(window.EmotionEngine && window.ConversationState){
        reply = EmotionEngine.applyTone(reply, ConversationState.mood);
      }

      /* ─────────────────────────────
         11️⃣ Memory pruning
      ───────────────────────────── */
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
