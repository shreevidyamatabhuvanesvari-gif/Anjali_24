(function(){

  const memory = JSON.parse(localStorage.getItem("anjaliPerspective")) || {
    lastPerspective: "neutral",  // emotional | factual | relational | reflective
    history: []
  };

  function save(){
    localStorage.setItem("anjaliPerspective", JSON.stringify(memory));
  }

  function detectPerspective(text, context){
    // emotional view
    if(context.emotion || /अकेल|दुख|प्यार|खुश|sad|lonely|love/.test(text)){
      return "emotional";
    }

    // relational view
    if(/तुम|मैं|हम|रिश्ता|friend|relationship/.test(text)){
      return "relational";
    }

    // factual view
    if(/क्या|कब|क्यों|कैसे|who|what|when|why/.test(text)){
      return "factual";
    }

    // reflective view
    if(/सोच|महसूस|लगता|feel|think/.test(text)){
      return "reflective";
    }

    return "neutral";
  }

  window.PerspectiveEngine = {

    infer(text, context){
      const p = detectPerspective(text, context);

      memory.lastPerspective = p;
      memory.history.push({
        p,
        text,
        time: Date.now()
      });

      save();
      return p;
    },

    get(){
      return memory;
    }

  };

})();
