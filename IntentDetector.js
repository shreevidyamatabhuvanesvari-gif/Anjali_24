(function(){

  window.IntentDetector = {

    detect: function(text){
      text = (text || "").toLowerCase();

      // Teaching intent
      if(text.includes("सिखा") || text.includes("याद रख") || text.includes("सीखो")){
        return "teach";
      }

      // Question intent
      if(text.includes("क्या") || text.includes("कौन") || text.includes("क्यों") || text.includes("कैसे")){
        return "question";
      }

      // Emotion intent
      if(text.includes("उदास") || text.includes("खुश") || text.includes("अकेला") || text.includes("प्यार")){
        return "emotion";
      }

      // Command intent
      if(text.includes("चुप") || text.includes("रुको") || text.includes("सुनो")){
        return "command";
      }

      return "chat";
    }

  };

})();
