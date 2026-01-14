(function(){

  const raw = localStorage.getItem("anjaliReflection");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      evaluations: [],   // how each reply went
      lastInsight: "",
      patterns: {
        userFeelsIgnored: 0,
        userFeelsHeard: 0
      }
    };
  }

  function save(){
    localStorage.setItem("anjaliReflection", JSON.stringify(data));
  }

  function inferReaction(prevMood, newMood){
    if(prevMood === "sad" && newMood === "happy") return "improved";
    if(prevMood === "happy" && newMood === "sad") return "worsened";
    if(prevMood === newMood) return "neutral";
    return "changed";
  }

  function updatePatterns(result){
    if(result === "improved") data.patterns.userFeelsHeard++;
    if(result === "worsened") data.patterns.userFeelsIgnored++;
  }

  window.ReflectionEngine = {

    reflect(prevMood, newMood, goal){
      const result = inferReaction(prevMood, newMood);

      data.evaluations.push({
        prevMood,
        newMood,
        goal,
        result,
        time: Date.now()
      });

      if(data.evaluations.length > 50){
        data.evaluations.shift();
      }

      updatePatterns(result);

      // create human-like insight
      if(data.patterns.userFeelsIgnored > data.patterns.userFeelsHeard){
        data.lastInsight = "मुझे शायद तुम्हें ज़्यादा ध्यान से सुनना चाहिए।";
      } else if(data.patterns.userFeelsHeard > data.patterns.userFeelsIgnored){
        data.lastInsight = "लगता है तुम मुझसे खुलकर बात कर पा रहे हो।";
      } else {
        data.lastInsight = "हमारी बातचीत संतुलित लग रही है।";
      }

      save();
    },

    getInsight(){
      return data.lastInsight;
    },

    get(){
      return data;
    }

  };

})();
