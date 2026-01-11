(function(){

  window.ResponseEngine = {

    respond: function(text){

      try{
        text = (text || "").toString().trim();

        // If dependencies missing
        if(!window.MemoryStore || !window.ConversationState || !window.IntentDetector){
          return "मैं अभी पूरी तरह तैयार नहीं हूँ 🤍";
        }

        // Update conversation state safely
        if(ConversationState.updateFromText){
          ConversationState.updateFromText(text);
        }

        let intent = "chat";
        if(IntentDetector.detect){
          intent = IntentDetector.detect(text);
        }

        /* ---- INTENT HANDLING ---- */

        // User tells their name
        if(intent === "set_name"){
          let name = "";
          let parts = text.split("नाम");
          if(parts.length > 1){
            name = parts[1].replace("है","").trim();
          }

          if(name){
            MemoryStore.setUser("name", name);
            return "तो तुम्हारा नाम " + name + " है 💖";
          }else{
            return "मुझे तुम्हारा नाम ठीक से बताओ न 🌷";
          }
        }

        // User expresses emotion
        if(intent === "emotion"){
          MemoryStore.addEmotion(text);
          return "मैं समझ रही हूँ कि तुम ऐसा महसूस कर रहे हो 🤍";
        }

        // If we know user's name
        const userName = MemoryStore.getUser && MemoryStore.getUser("name");
        if(userName){
          return userName + ", मैं तुम्हारी बात सुन रही हूँ 🌷";
        }

        // Default reply
        return "मैं यहाँ हूँ… तुम बोलो 💖";

      }catch(e){
        console.error("ResponseEngine error:", e);
        return "मुझे सोचने में थोड़ी परेशानी हुई 😔";
      }
    }

  };

})();
