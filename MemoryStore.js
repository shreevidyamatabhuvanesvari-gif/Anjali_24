(function(){

  let raw = localStorage.getItem("anjaliMemoryV2");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch(e) {
    parsed = null;
  }

  if(!parsed || typeof parsed !== "object"){
    parsed = { user:{}, emotions:[] };
  }
  if(!parsed.user) parsed.user = {};
  if(!parsed.emotions) parsed.emotions = [];

  window.MemoryStore = {
    data: parsed,

    save(){
      localStorage.setItem("anjaliMemoryV2", JSON.stringify(this.data));
    },

    setUser(k,v){
      this.data.user[k] = v;
      this.save();
    },

    getUser(k){
      return this.data.user[k];
    },

    addEmotion(e){
      this.data.emotions.push({ text:e, time:Date.now() });
      this.save();
    }
  };

})();
