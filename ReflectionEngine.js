(function(){

  const raw = localStorage.getItem("anjaliReflectionV2");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      history: [],

      // how effective different styles are for THIS user
      effectiveness: {
        comfort: 0.5,
        listening: 0.5,
        deepen: 0.5,
        connect: 0.5
      }
    };
  }

  function save(){
    localStorage.setItem("anjaliReflectionV2", JSON.stringify(data));
  }

  function clamp(v){
    return Math.max(0, Math.min(1, v));
  }

  window.ReflectionEngine = {

    /**
     * Call this AFTER Anjali speaks and user replies
     */
    reflect(beforeMood, afterMood, usedMode){
      let delta = 0;

      // did mood improve?
      if(beforeMood === "sad" || beforeMood === "alone"){
        if(afterMood === "calm" || afterMood === "happy") delta = +0.1;
        else delta = -0.05;
      }

      if(beforeMood === afterMood){
        delta = -0.02; // no change → weak effect
      }

      // update effectiveness of that mode
      if(data.effectiveness[usedMode] !== undefined){
        data.effectiveness[usedMode] = clamp(
          data.effectiveness[usedMode] + delta
        );
      }

      data.history.push({
        time: Date.now(),
        beforeMood,
        afterMood,
        mode: usedMode,
        delta
      });

      save();
    },

    /**
     * Which communication style works best for this user?
     */
    getBestMode(){
      let best = "connect";
      let max = 0;

      for(let k in data.effectiveness){
        if(data.effectiveness[k] > max){
          max = data.effectiveness[k];
          best = k;
        }
      }
      return best;
    },

    get(){
      return data;
    }

  };

})();
