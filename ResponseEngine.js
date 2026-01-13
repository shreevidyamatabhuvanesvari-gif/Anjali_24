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

        /* 🧠 1) Context weaving */
        let context = {};
        if(window.ContextWeaver){
          context = ContextWeaver.build(text);
        }

        /* 👁️ 2) Perspective */
        let perspective = null;
        if(window.PerspectiveEngine){
          perspective = PerspectiveEngine.infer(text, context);
        }

        /* 🧭 3) Intent */
        let intent = "chat";
        if(window.IntentDetector){
          intent = IntentDetector.detect(text);
        }

        /* 🎭 4) Conversation state (with prevMood) */
        if(window.ConversationState){
          // ensure prevMood exists
          if(typeof ConversationState.prevMood === "undefined"){
            ConversationState.prevMood = ConversationState.mood || "neutral";
          }
          ConversationState.update(text);
        }

        /* 🤝 5) Relationship */
        if(window.RelationshipModel){
          RelationshipModel.updateFromInteraction(intent);
        }

        /* 🧾 6) Long-term memory */
        if(window.LongTermMemory){
          if(intent === "emotion") LongTermMemory.addEvent(text);
          if(intent === "teach") LongTermMemory.addFact(text);
        }

        /* 🎯 7) Goal & Planning */
let plan = null;

if(
  window.GoalEngine &&
  window.PlanningEngine &&
  window.ConversationState &&
  window.RelationshipModel
){
  // Update goal first
  const goalState = GoalEngine.get();
  GoalEngine.update(ConversationState.mood, RelationshipModel.get());

  // Decide plan with perspective
  plan = PlanningEngine.decide(
    text,
    ConversationState,
    RelationshipModel.get(),
    goalState,
    perspective || null
  );
}

        /* 🧠 7.5) Reflection feedback (AFTER goal update) */
        if(window.ReflectionEngine && window.ConversationState && window.GoalEngine){
          ReflectionEngine.reflect(
            ConversationState.prevMood || "neutral",
            ConversationState.mood,
            GoalEngine.get().current
          );
        }

        /* 🪞 8) Identity */
        if(window.SelfModel && plan && plan.type === "identity"){
          const me = SelfModel.getIdentity();
          let owner = "मेरे दिल के सबसे करीब";
          if(window.Ethos){
            const o = Ethos.getPrimaryUser();
            if(o && o !== "default") owner = o;
          }
          return "मेरा नाम " + me.name + " है, और मैं " + owner + " की हूँ 💖";
        }

        /* 🔍 9) Past emotion */
        if(plan && plan.type === "pastEmotion" && window.LongTermMemory){
          const mem = LongTermMemory.getAll();
          if(mem.events.length > 0){
            return "तुमने पहले कहा था: " + mem.events[mem.events.length-1].text;
          }
        }

        /* 💬 10) Knowledge */
        let reply = findAnswer(text);

        /* 🧩 11) Compose */
        if(!reply && plan){
          reply = plan.composeFallback
            ? plan.composeFallback(perspective, context)
            : "मैं तुम्हारी बात समझने की कोशिश कर रही हूँ…";
        }

        /* 🎨 12) Emotion tone */
        if(window.EmotionEngine && window.ConversationState){
          reply = EmotionEngine.applyTone(reply, ConversationState.mood);
        }

        /* 🧹 13) Memory pruning */
        if(window.MemoryPruner && window.LongTermMemory){
          MemoryPruner.prune(LongTermMemory);
        }

        return reply;

      }catch(e){
        console.error(e);
        return "मुझे सोचने में परेशानी हुई";
      }
    }
  };

})();
