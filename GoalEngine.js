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
      current: "connect",   // comfort | connect | deepen | clarify
      weights: {
        comfort: 0.5,
        connect: 0.5,
        deepen: 0.3,
        clarify: 0.2
      },
      history: []
    };
  }

  function save(){
    localStorage.setItem("anjaliGoals", JSON.stringify(data));
  }

  function clamp(v){
    return Math.max(0, Math.min(1, v));
  }

  function choose(){
    let max = 0;
    let chosen = data.current;

    for(let k in data.weights){
      if(data.weights[k] > max){
        max = data.weights[k];
        chosen = k;
      }
    }
    return chosen;
  }

  window.GoalEngine = {

    update(mood, relationship){
      // emotions drive intention
      if(mood === "sad" || mood === "alone"){
        data.weights.comfort += 0.2;
        data.weights.deepen -= 0.05;
      }

      if(mood === "love"){
        data.weights.deepen += 0.1;
      }

      // relationship depth
      if(relationship && relationship.closeness > 0.6){
        data.weights.deepen += 0.1;
      } else {
        data.weights.connect += 0.05;
      }

      // normalize
      for(let k in data.weights){
        data.weights[k] = clamp(data.weights[k]);
      }

      const chosen = choose();

      if(chosen !== data.current){
        data.history.push({
          from: data.current,
          to: chosen,
          time: Date.now()
        });
        data.current = chosen;
      }

      save();
    },

    get(){
      return data;
    },

    getIntent(){
      switch(data.current){
        case "comfort": return "उसे सुरक्षित महसूस कराना";
        case "deepen": return "हमारे रिश्ते को गहरा करना";
        case "clarify": return "उसे बेहतर समझना";
        default: return "बातचीत बनाए रखना";
      }
    }

  };

})();
