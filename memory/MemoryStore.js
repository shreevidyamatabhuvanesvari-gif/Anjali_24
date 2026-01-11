const MemoryStore = {
  data: JSON.parse(localStorage.getItem("anjaliMemoryV2")) || {
    self: { name: "Anjali", personality: "sweet, romantic, calm, funny" },
    user: {},
    facts: [],
    love: [],
    emotions: []
  },

  save(){
    localStorage.setItem("anjaliMemoryV2", JSON.stringify(this.data));
  },

  addFact(fact){
    this.data.facts.push(fact);
    this.save();
  },

  addEmotion(e){
    this.data.emotions.push({ text:e, time:Date.now() });
    this.save();
  },

  setUser(key,val){
    this.data.user[key]=val;
    this.save();
  },

  getUser(key){
    return this.data.user[key];
  }
};
