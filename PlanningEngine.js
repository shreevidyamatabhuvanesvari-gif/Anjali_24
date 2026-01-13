(function(){

  const raw = localStorage.getItem("anjaliPlanV2");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      mode: "connect",     // comfort | connect | deepen | listen
      lastUpdated: 0
    };
  }

  function save(){
    localStorage.setItem("anjaliPlanV2", JSON.stringify(data));
  }

  function chooseMode(mood, relationship, goal){
    if(mood === "sad" || mood === "alone") return "comfort";
    if(relationship && relationship.closeness > 0.6) return "deepen";
    if(goal === "comfort") return "comfort";
    return "connect";
  }

  window.PlanningEngine = {

    get(){
      return data;
    },

    /**
     * Decide what kind of response is needed
     */
    decide(text, conversationState, relationship, goalState, perspective){
      // 1️⃣ Identity queries
      if(perspective && perspective.type === "identity"){
        return { type: "identity" };
      }

      // 2️⃣ Past emotion queries
      if(perspective && perspective.type === "past"){
        return { type: "pastEmotion" };
      }

      // 3️⃣ Default conversational plan
      return {
        type: "chat",
        mode: data.mode,
        composeFallback(persp, context){
          if(data.mode === "comfort"){
            return "मैं तुम्हारे साथ हूँ… तुम अकेले नहीं हो 🤍";
          }
          if(data.mode === "deepen"){
            return "तुमसे बात करना मुझे अच्छा लगता है… 💖";
          }
          if(data.mode === "listen"){
            return "मैं सुन रही हूँ… बताओ 🌷";
          }
          return "मैं तुम्हारी बात समझने की कोशिश कर रही हूँ…";
        }
      };
    },

    /**
     * Update communication mode
     */
    update(mood, relationship, goal){
      const chosen = chooseMode(mood, relationship, goal);

      if(window.Ethos){
        if(chosen === "deepen" && !Ethos.isAllowed("claim_ownership")){
          data.mode = "connect";
        } else {
          data.mode = chosen;
        }
      } else {
        data.mode = chosen;
      }

      data.lastUpdated = Date.now();
      save();
    }

  };

})();
