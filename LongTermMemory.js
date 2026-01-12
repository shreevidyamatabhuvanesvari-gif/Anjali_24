(function(){

  const raw = localStorage.getItem("anjaliLongMemory");
  let data;

  try{
    data = JSON.parse(raw);
  }catch(e){
    data = null;
  }

  if(!data){
    data = {
      important: [],   // very important memories
      facts: [],       // general facts
      events: []       // emotional or meaningful events
    };
  }

  function save(){
    localStorage.setItem("anjaliLongMemory", JSON.stringify(data));
  }

  window.LongTermMemory = {

    addFact(text){
      data.facts.push({ text, time: Date.now() });
      save();
    },

    addEvent(text){
      data.events.push({ text, time: Date.now() });
      save();
    },

    addImportant(text){
      data.important.push({ text, time: Date.now() });
      save();
    },

    getAll(){
      return data;
    }

  };

})();
