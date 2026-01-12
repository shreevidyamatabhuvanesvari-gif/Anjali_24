(function(){

  window.IntentDetector = {

    detect: function(text){
      text = (text || "").toLowerCase();

      // 🧠 Teaching intent
      if(
        text.includes("सिखा") ||
        text.includes("सीखो") ||
        text.includes("याद रख") ||
        text.includes("save") ||
        text.includes("teach")
      ){
        return "teach";
      }

      // ❓ Question intent
      if(
        text.includes("क्या") ||
        text.includes("कौन") ||
        text.includes("क्यों") ||
        text.includes("कैसे") ||
        text.includes("?")
      ){
        return "question";
      }

      // ❤️ Emotion intent (expanded & reliable)
      if(
        text.includes("उदास") ||
        text.includes("दुख") ||
        text.includes("दुखी") ||
        text.includes("अकेला") ||
        text.includes("तन्हा") ||
        text.includes("lonely") ||
        text.includes("खुश") ||
        text.includes("प्यार") ||
        text.includes("miss")
      ){
        return "emotion";
      }

      // 🛑 Command intent
      if(
        text.includes("चुप") ||
        text.includes("रुको") ||
        text.includes("सुनो") ||
        text.includes("stop")
      ){
        return "command";
      }

      return "chat";
    }

  };

})();
