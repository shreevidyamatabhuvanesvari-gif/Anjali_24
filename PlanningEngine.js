(function(){

  const raw = localStorage.getItem("anjaliPlanning");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      mode: "connect",      // comfort | connect | deepen | clarify | listen
      lastPlan: null,
      confidence: 0.5,     // how sure Anjali feels about her choices
      history: []
    };
  }

  function save(){
    localStorage.setItem("anjaliPlanning", JSON.stringify(data));
  }

  function clamp(v){
    return Math.max(0, Math.min(1, v));
  }

  function decideMode(mood, relationship, goal){
    // Emotion has highest priority
    if(mood === "sad" || mood === "alone") return "comfort";

    // If user is opening heart
    if(mood === "love" || mood === "happy"){
      if(relationship && relationship.closeness > 0.5){
        return "deepen";
      }
    }

    // If goal engine wants understanding
    if(goal === "clarify") return "clarify";

    // If relationship is weak → connect
    if(relationship && relationship.closeness < 0.3) return "connect";

    // Default human behaviour
    return "listen";
  }

  function decideAction(mode, intent){
    if(mode === "comfort"){
      return intent === "emotion"
        ? "soothe"
        : "support";
    }

    if(mode === "deepen"){
      return intent === "chat"
        ? "share_feeling"
        : "bond";
    }

    if(mode === "clarify"){
      return "ask_question";
    }

    if(mode === "listen"){
      return "listen";
    }

    return "talk";
  }

  window.PlanningEngine = {

    update(mood, relationship, goal, intent){
      const newMode = decideMode(mood, relationship, goal);
      const action = decideAction(newMode, intent);

      // confidence changes based on stability
      if(newMode === data.mode){
        data.confidence += 0.02;
      } else {
        data.confidence -= 0.05;
      }

      data.confidence = clamp(data.confidence);

      const plan = {
        mode: newMode,
        action: action,
        time: Date.now(),
        confidence: data.confidence
      };

      data.history.push(plan);
      data.mode = newMode;
      data.lastPlan = plan;

      save();
      return plan;
    },

    get(){
      return data;
    },

    getCurrentPlan(){
      return data.lastPlan;
    },

    getMode(){
      return data.mode;
    }

  };

})();
