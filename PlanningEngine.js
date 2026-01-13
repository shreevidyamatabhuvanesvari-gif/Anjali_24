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
    // 1. If user is hurting → comfort
    if(mood === "sad" || mood === "alone"){
      return "comfort";
    }

    // 2. If closeness high → deepen
    if(relationship && relationship.closeness > 0.6){
      return "deepen";
    }

    // 3. If goal wants comfort
    if(goal === "comfort"){
      return "comfort";
    }

    // 4. Default
    return "connect";
  }

  window.PlanningEngine = {

    get(){
      return data;
    },

    update(mood, relationship, goal){
      const chosen = chooseMode(mood, relationship, goal);

      // Ethos safety check
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
