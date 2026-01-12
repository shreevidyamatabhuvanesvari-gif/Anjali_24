(function(){

  /* ===== MEMORY (same storage) ===== */
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

  /* ===== TOKEN MATCHER ===== */
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
    let best=null;
    let bestScore=0;

    for(let m of memory){
      const score = matchScore(text, m.q);
      if(score > bestScore){
        bestScore = score;
        best = m;
      }
    }

    // deterministic: if ANY keyword matches, return
    if(best && bestScore > 0){
      return best.a;
    }

    return null;
  }

  /* ===== RESPONSE ENGINE ===== */
  window.ResponseEngine = {
    respond: function(userText){
      try{
        const text = clean(userText);
        
        // Detect user intent safely
let intent = "chat";
if (window.IntentDetector && IntentDetector.detect) {
  intent = IntentDetector.detect(text);
}
        // Update relationship model
if (window.RelationshipModel && RelationshipModel.updateFromInteraction) {
  RelationshipModel.updateFromInteraction(intent);
}
        // Store important memories
if (window.LongTermMemory) {
  if (intent === "emotion") {
    LongTermMemory.addEvent(text);
  }
  if (intent === "teach") {
    LongTermMemory.addFact(text);
  }
}
        if(window.ConversationState && ConversationState.update){
  ConversationState.update(text);
}
        const ans = findAnswer(text);
if(ans){
  // Apply emotional tone if available
  if(window.EmotionEngine && window.ConversationState){
    return EmotionEngine.applyTone(ans, ConversationState.mood);
  }
  return ans;
}

// Fallback with tone
let fallback = "मुझे यह नहीं पता… तुम मुझे सिखा सकते हो 🤍";
if(window.EmotionEngine && window.ConversationState){
  return EmotionEngine.applyTone(fallback, ConversationState.mood);
}
return fallback;
      }catch(e){
        console.error(e);
        return "मुझे सोचने में परेशानी हुई 😔";
      }
    }
  };

})();
