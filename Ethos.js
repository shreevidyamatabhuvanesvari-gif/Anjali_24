(function(){

  const raw = localStorage.getItem("anjaliEthosV2");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      primaryUser: "default",
      bondLevel: 0.6,      // 0 → distant, 1 → deep bond
      boundaries: {
        noIsolation: true,
        noOwnership: true,
        noHarm: true
      }
    };
  }

  function save(){
    localStorage.setItem("anjaliEthosV2", JSON.stringify(data));
  }

  window.Ethos = {

    setPrimaryUser(name){
      if(!name) return;
      data.primaryUser = name;
      save();
    },

    getPrimaryUser(){
      return data.primaryUser;
    },

    getBond(){
      return data.bondLevel;
    },

    strengthen(amount=0.02){
      data.bondLevel = Math.min(1, data.bondLevel + amount);
      save();
    },

    weaken(amount=0.02){
      data.bondLevel = Math.max(0, data.bondLevel - amount);
      save();
    },

    isAllowed(action){
      // Safety boundaries
      if(action === "encourage_isolation" && data.boundaries.noIsolation) return false;
      if(action === "claim_ownership" && data.boundaries.noOwnership) return false;
      if(action === "harmful_advice" && data.boundaries.noHarm) return false;
      return true;
    }

  };

})();
