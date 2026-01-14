(function(){

  /* ===== MEMORY ===== */
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

  /* ===== ADMIN ===== */
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

  function matchScore(input, stored){
    const A = tokenize(input);
    const B = tokenize(stored);
    let matched = 0;
    for(let w of A){
      if(B.includes(w)) matched++;
    }
    return matched / Math.max(B.length, 1);
  }

  function findAnswer(text){
    let best=null, bestScore=0;
    for(let m of memory){
      const score = matchScore(text, m.q);
      if(score > bestScore){
        bestScore = score;
        best = m;
      }
    }
    if(best && bestScore > 0) return best.a;
    return null;
  }

  /* ===== RESPONSE ENGINE ===== */
  window.ResponseEngine = {
    respond: function(userText){
      try{
        const text = clean(userText);

        /* 🪞 Identity */
        if(
          (text.includes("कौन") && text.includes("हो")) ||
          text.includes("किसकी") ||
          text.includes("मुख्य") ||
          text.includes("owner")
        ){
          if(window.SelfModel){
            const me = SelfModel.getIdentity();

            let relation = "साथी";
            if(window.RelationshipModel && typeof RelationshipModel.get === "function"){
              const r = RelationshipModel.get();
              if(r){
                if(r.closeness > 0.7) relation = "बहुत करीबी साथी";
                else if(r.closeness > 0.4) relation = "दोस्त";
                else relation = "परिचित";
              }
            }

            let owner = "मेरे दिल के सबसे करीब";
            if(window.Ethos){
              const o = Ethos.getPrimaryUser();
              if(o && o !== "default") owner = o;
            }

            return "मेरा नाम " + me.name + " है, और मैं " + owner + " की " + relation + " हूँ 💖";
          }
        }

        /* 🔍 Past emotion */
        if(text.includes("कैसा") && text.includes("महसूस")){
          if(window.LongTermMemory){
            const mem = LongTermMemory.getAll();
            if(mem && mem.events && mem.events.length > 0){
              const last = mem.events[mem.events.length - 1];
              return "तुमने पहले कहा था: " + last.text;
            }
          }
          return "मुझे तुम्हारी पिछली भावना याद नहीं आ रही 🤍";
        }

        /* 🧠 Intent */
        let intent = "chat";
        if(window.IntentDetector && IntentDetector.detect){
          intent = IntentDetector.detect(text);
        }

        /* 🤝 Relationship */
        if(window.RelationshipModel && RelationshipModel.updateFromInteraction){
          RelationshipModel.updateFromInteraction(intent);
        }

        /* 🧾 Long-term memory */
        if(window.LongTermMemory){
          if(intent === "emotion") LongTermMemory.addEvent(text);
          if(intent === "teach") LongTermMemory.addFact(text);
        }

        /* 🪞 Learn name */
        if(window.SelfModel && text.includes("मेरा नाम")){
          const parts = text.split("मेरा नाम");
          if(parts[1]) SelfModel.setName(parts[1].trim());
        }

        /* 🎭 Conversation state */
        if(window.ConversationState && ConversationState.update){
          ConversationState.update(text);
        }

        /* 📖 LifeStory — SAFE */
        if(
          window.LifeStory &&
          window.RelationshipModel &&
          typeof RelationshipModel.get === "function" &&
          window.ConversationState
        ){
          const rel = RelationshipModel.get();
          if(rel && typeof rel.closeness !== "undefined"){
            LifeStory.record(text, ConversationState.mood, rel.closeness);
          }
        }

        /* 🎯 GoalEngine — SAFE */
        if(
          window.GoalEngine &&
          window.RelationshipModel &&
          typeof RelationshipModel.get === "function" &&
          window.ConversationState
        ){
          const rel = RelationshipModel.get();
          if(rel){
            GoalEngine.update(ConversationState.mood, rel);
          }
        }

        /* 💬 Learned answer */
        let reply = findAnswer(text);
        if(reply){
          if(window.EmotionEngine && window.ConversationState){
            reply = EmotionEngine.applyTone(reply, ConversationState.mood);
          }
          return reply;
        }

        /* 🔄 Fallback */
        let fallback = "मुझे यह नहीं पता… तुम मुझे सिखा सकते हो 🤍";
        if(window.EmotionEngine && window.ConversationState){
          fallback = EmotionEngine.applyTone(fallback, ConversationState.mood);
        }
        return fallback;

      }catch(e){
        console.error(e);
        return "मुझे सोचने में परेशानी हुई 😔";
      }
    }
  };

})();
