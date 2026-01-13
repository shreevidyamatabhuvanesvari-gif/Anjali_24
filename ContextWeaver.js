(function(){

  const raw = localStorage.getItem("anjaliContext");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      lastTexts: [],
      lastMood: "neutral",
      lastTopic: null
    };
  }

  function save(){
    localStorage.setItem("anjaliContext", JSON.stringify(data));
  }

  window.ContextWeaver = {

    build(text){

      // keep last 5 utterances
      data.lastTexts.push(text);
      if(data.lastTexts.length > 5){
        data.lastTexts.shift();
      }

      if(window.ConversationState){
        data.lastMood = ConversationState.mood;
        data.lastTopic = ConversationState.lastTopic;
      }

      save();

      return {
        recent: data.lastTexts.slice(),
        mood: data.lastMood,
        topic: data.lastTopic
      };
    },

    get(){
      return data;
    }

  };

})();
