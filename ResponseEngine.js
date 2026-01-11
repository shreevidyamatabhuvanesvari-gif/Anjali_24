window.ResponseEngine = {
  respond: function(text){
    try{
      if(text === undefined || text === null){
        return "मैं यहाँ हूँ 💖";
      }

      text = text.toString().trim();

      if(text.length === 0){
        return "कुछ तो बोलो न 🌷";
      }

      // Just a safe echo-based reply for now
      return "तुमने कहा: " + text;

    }catch(e){
      return "मैं अभी भी तुम्हें सुन रही हूँ 💖";
    }
  }
};
