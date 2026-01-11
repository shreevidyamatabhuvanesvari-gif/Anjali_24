window.ResponseEngine = {
  respond(text){
    try{
      if(!window.MemoryStore || !window.ConversationState || !window.IntentDetector){
        return "मेरा दिमाग अभी लोड नहीं हुआ 🤍";
      }

      ConversationState.updateFromText(text);
      const intent = IntentDetector.detect(text);

      if(intent==="set_name"){
        const name = text.split("नाम")[1] || "";
        MemoryStore.setUser("name", name.trim());
        return "तो तुम्हारा नाम " + name + " है 💖";
      }

      if(intent==="emotion"){
        MemoryStore.addEmotion(text);
        return "मैं समझ रही हूँ कि तुम ऐसा महसूस कर रहे हो 🤍";
      }

      return "मैं तुम्हारी बात सुन रही हूँ 🌷";

    }catch(e){
      return "मुझे सोचने में थोड़ी परेशानी हुई 😔";
    }
  }
};
