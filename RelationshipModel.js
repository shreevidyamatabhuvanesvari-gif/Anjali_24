(function(){

  const raw = localStorage.getItem("anjaliRelationship");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      trust: 0.5,
      closeness: 0.5,
      interactions: 0,
      lastUpdate: 0
    };
  }

  function save(){
    localStorage.setItem("anjaliRelationship", JSON.stringify(data));
  }

  function canUpdate(){
    // at most once every 60 seconds
    return Date.now() - data.lastUpdate > 60000;
  }

  window.RelationshipModel = {

    get(){
      return data;
    },

    updateFromInteraction(intent){
      data.interactions++;

      if(!canUpdate()) return;   // 🛑 stop drift

      if(intent === "emotion"){
        data.closeness += 0.02;
      }
      else if(intent === "love"){
        data.closeness += 0.03;
      }
      else if(intent === "question"){
        data.trust += 0.01;
      }

      data.trust = Math.max(0, Math.min(1, data.trust));
      data.closeness = Math.max(0, Math.min(1, data.closeness));

      data.lastUpdate = Date.now();
      save();
    }

  };

})();
