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
      chapters: [],
      timeline: []   // chronological memory
    };
  }

  function save(){
    localStorage.setItem("anjaliLifeStory", JSON.stringify(story));
  }

  function currentChapter(){
    if(story.chapters.length === 0){
      const ch = { title: "शुरुआत", from: Date.now() };
      story.chapters.push(ch);
      return ch;
    }
    return story.chapters[story.chapters.length - 1];
  }

  window.LifeStory = {

    record(text, mood, closeness){
      const entry = {
        text,
        mood,
        closeness,
        time: Date.now()
      };

      story.timeline.push(entry);

      const ch = currentChapter();

      // open new chapter when emotional shift happens
      if(ch.mood && Math.abs(ch.mood - mood) > 0.5){
        story.chapters.push({
          title: "एक नया दौर",
          from: Date.now()
        });
      }

      save();
    },

    getStory(){
      return story;
    },

    getLast(){
      if(story.timeline.length === 0) return null;
      return story.timeline[story.timeline.length - 1];
    }

  };

})();
