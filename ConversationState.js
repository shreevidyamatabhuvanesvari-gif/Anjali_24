(function(){

  window.ConversationState = {
    mood: "neutral",
    lastTopic: null,
    lastUserText: "",

    update(text){
      this.lastUserText = text;

      const t = (text || "").toLowerCase();

      if(t.includes("अकेला") || t.includes("lonely") || t.includes("तन्हा")){
        this.mood = "alone";
        this.lastTopic = "emotion";
      }
      else if(t.includes("उदास") || t.includes("sad") || t.includes("दुख")){
        this.mood = "sad";
        this.lastTopic = "emotion";
      }
      else if(t.includes("प्यार") || t.includes("love") || t.includes("miss")){
        this.mood = "love";
        this.lastTopic = "relationship";
      }
      else if(t.includes("कौन") || t.includes("क्या")){
        this.lastTopic = "question";
      }
      else{
        this.lastTopic = "chat";
      }
    }
  };

})();
