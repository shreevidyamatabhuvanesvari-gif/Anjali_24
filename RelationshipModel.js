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
      trust: 0.5,      // 0 → no trust, 1 → full trust
      closeness: 0.5,  // emotional proximity
      interactions: 0
    };
  }

  function save(){
    localStorage.setItem("anjaliRelationship", JSON.stringify(data));
  }

  window.RelationshipModel = {

    get(){
      return data;
    },

    updateFromInteraction(intent){
      data.interactions++;

      if(intent === "emotion"){
        data.closeness += 0.02;
      }
      if(intent === "love"){
        data.closeness += 0.03;
      }
      if(intent === "question"){
        data.trust += 0.01;
      }

      // clamp values
      data.trust = Math.max(0, Math.min(1, data.trust));
      data.closeness = Math.max(0, Math.min(1, data.closeness));

      save();
    }

  };

})();
