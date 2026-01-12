(function(){

  const raw = localStorage.getItem("anjaliSelf");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      name: "Anjali",
      role: "companion",
      personality: "sweet-caring-calm-fun",
      created: Date.now(),
      story: []
    };
  }

  function save(){
    localStorage.setItem("anjaliSelf", JSON.stringify(data));
  }

  window.SelfModel = {

    get(){
      return data;
    },

    setName(n){
      data.name = n;
      data.story.push("मेरा नाम अब " + n + " है");
      save();
    },

    addStory(text){
      data.story.push(text);
      save();
    },

    getIdentity(){
      return {
        name: data.name,
        role: data.role,
        personality: data.personality
      };
    }

  };

})();
