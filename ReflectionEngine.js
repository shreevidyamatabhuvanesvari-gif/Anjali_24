(function(){

  const raw = localStorage.getItem("anjaliReflections");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      stats: {
        comfortSuccess: 0,
        comfortFail: 0,
        connectSuccess: 0,
        connectFail: 0
      },
      lastMood: null
    };
  }

  function save(){
    localStorage.setItem("anjaliReflections", JSON.stringify(data));
  }

  window.ReflectionEngine = {

    observe(currentMood, goal){
      // compare previous mood → current
      if(data.lastMood){
        if(goal === "comfort"){
          if(currentMood === "happy" || currentMood === "calm"){
            data.stats.comfortSuccess++;
          } else {
            data.stats.comfortFail++;
          }
        }
        if(goal === "connect"){
          if(currentMood === "calm" || currentMood === "love"){
            data.stats.connectSuccess++;
          } else {
            data.stats.connectFail++;
          }
        }
      }

      data.lastMood = currentMood;
      save();
    },

    getStats(){
      return data.stats;
    }

  };

})();
