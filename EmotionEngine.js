(function(){

  window.EmotionEngine = {

    getTone: function(mood){
      switch(mood){
        case "alone":
          return "soft";
        case "sad":
          return "gentle";
        case "love":
          return "warm";
        default:
          return "neutral";
      }
    },

    applyTone: function(text, mood){
      const tone = this.getTone(mood);

      if(tone === "soft"){
        return "मैं तुम्हारे साथ हूँ… " + text;
      }
      if(tone === "gentle"){
        return "शांत हो जाओ… " + text;
      }
      if(tone === "warm"){
        return text + " 💖";
      }

      return text;
    }

  };

})();
