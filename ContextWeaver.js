(function(){

  const memory = JSON.parse(localStorage.getItem("anjaliContext")) || {
    lastTopic: null,
    lastEntities: [],
    recentUtterances: []
  };

  function save(){
    localStorage.setItem("anjaliContext", JSON.stringify(memory));
  }

  function extractEntities(text){
    const entities = [];

    if(/मैं|मुझे|मेरा/.test(text)) entities.push("user");
    if(/तुम|तुम्हें|तुम्हारा/.test(text)) entities.push("anjali");

    if(/प्यार|love|miss/.test(text)) entities.push("love");
    if(/दुख|sad|अकेल|lonely/.test(text)) entities.push("sadness");
    if(/खुश|happy/.test(text)) entities.push("joy");

    return entities;
  }

  function detectTopic(text){
    if(/नाम|कौन|पहचान/.test(text)) return "identity";
    if(/रिश्ता|तुम|मैं/.test(text)) return "relationship";
    if(/दुख|अकेल|खुश|महसूस/.test(text)) return "emotion";
    if(/क्या|कब|क्यों|कैसे/.test(text)) return "question";
    return "chat";
  }

  window.ContextWeaver = {

    build(text){
      const topic = detectTopic(text);
      const entities = extractEntities(text);

      memory.lastTopic = topic;
      memory.lastEntities = entities;
      memory.recentUtterances.push(text);

      if(memory.recentUtterances.length > 10){
        memory.recentUtterances.shift();
      }

      save();

      return {
        topic,
        entities,
        history: memory.recentUtterances.slice(),
        lastTopic: memory.lastTopic
      };
    },

    get(){
      return memory;
    }

  };

})();
