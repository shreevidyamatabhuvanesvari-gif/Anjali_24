(function(){

  const raw = localStorage.getItem("anjaliLifeStory");
  let story;

  try{
    story = JSON.parse(raw);
  }catch(e){
    story = null;
  }

  if(!story){
    story = {
      chapters: [],        // emotional / relational moments
      themes: {},          // sadness, love, trust, etc.
      lastSummary: ""
    };
  }

  function save(){
    localStorage.setItem("anjaliLifeStory", JSON.stringify(story));
  }

  function detectTheme(text){
    if(/अकेल|lonely/.test(text)) return "loneliness";
    if(/दुख|sad/.test(text)) return "sadness";
    if(/प्यार|love|miss/.test(text)) return "love";
    if(/भरोसा|trust/.test(text)) return "trust";
    if(/खुश|happy/.test(text)) return "joy";
    return "general";
  }

  function updateThemes(theme){
    if(!story.themes[theme]) story.themes[theme] = 0;
    story.themes[theme]++;
  }

  function summarize(){
    const keys = Object.keys(story.themes);
    if(keys.length === 0) return "";

    let dominant = keys[0];
    for(let k of keys){
      if(story.themes[k] > story.themes[dominant]){
        dominant = k;
      }
    }

    return "हमारी बातचीत में " + dominant + " सबसे ज़्यादा दिखता है।";
  }

  window.LifeStory = {

    record(text, mood, closeness){
      const theme = detectTheme(text);

      story.chapters.push({
        text,
        mood,
        closeness,
        theme,
        time: Date.now()
      });

      if(story.chapters.length > 100){
        story.chapters.shift();
      }

      updateThemes(theme);
      story.lastSummary = summarize();
      save();
    },

    getSummary(){
      return story.lastSummary;
    },

    getStory(){
      return story;
    }

  };

})();
