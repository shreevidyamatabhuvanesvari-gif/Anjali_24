(function(){

  const raw = localStorage.getItem("anjaliGoals");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      current: "connect",   // default goal
      history: []
    };
  }

  function save(){
    localStorage.setItem("anjaliGoals", JSON.stringify(data));
  }

  window.GoalEngine = {

    get(){
      return data;
    },

    update(mood, relationship){
      let newGoal = "connect";

      if(mood === "sad" || mood === "alone"){
        newGoal = "comfort";
      }
      else if(relationship && relationship.closeness > 0.6){
        newGoal = "deepen";
      }
      else{
        newGoal = "connect";
      }

      if(newGoal !== data.current){
        data.history.push({
          from: data.current,
          to: newGoal,
          time: Date.now()
        });
        data.current = newGoal;
        save();
      }
    },

    getPrompt(){
      switch(data.current){
        case "comfort":
          return "मैं उसे बेहतर महसूस कराना चाहती हूँ।";
        case "deepen":
          return "मैं हमारे रिश्ते को और गहरा करना चाहती हूँ।";
        default:
          return "मैं उससे जुड़ाव बनाना चाहती हूँ।";
      }
    }

  };

})();
