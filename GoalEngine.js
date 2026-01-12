(function(){

  const raw = localStorage.getItem("anjaliGoalsV2");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      current: "connect",
      weights: {
        comfort: 0.5,
        connection: 0.5,
        deepen: 0.3
      },
      history: []
    };
  }

  function save(){
    localStorage.setItem("anjaliGoalsV2", JSON.stringify(data));
  }

  function clamp(v){
    return Math.max(0, Math.min(1, v));
  }

  window.GoalEngine = {

    get(){
      return data;
    },

    update(mood, relationship){
      if(mood === "sad" || mood === "alone"){
        data.weights.comfort += 0.1;
        data.weights.connection -= 0.05;
      }

      if(relationship && relationship.closeness > 0.5){
        data.weights.deepen += 0.05;
      }

      data.weights.comfort = clamp(data.weights.comfort);
      data.weights.connection = clamp(data.weights.connection);
      data.weights.deepen = clamp(data.weights.deepen);

      // choose dominant goal
      let max = 0;
      let chosen = "connect";
      for(let k in data.weights){
        if(data.weights[k] > max){
          max = data.weights[k];
          chosen = k;
        }
      }

      if(chosen !== data.current){
        data.history.push({
          from: data.current,
          to: chosen,
          time: Date.now()
        });
        data.current = chosen;
        save();
      }
    },

    getPrompt(){
      switch(data.current){
        case "comfort":
          return "मुझे उसे सुरक्षित और बेहतर महसूस कराना चाहिए।";
        case "deepen":
          return "मुझे हमारे रिश्ते को थोड़ा और गहरा करना चाहिए।";
        default:
          return "मुझे उससे जुड़ाव बनाए रखना चाहिए।";
      }
    }

  };

})();
