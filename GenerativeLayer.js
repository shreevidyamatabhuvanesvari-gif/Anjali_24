(function(){

  function chooseEmotionTone(mood){
    switch(mood){
      case "sad": return "नरम";
      case "alone": return "सहारा";
      case "love": return "गर्मजोशी";
      case "happy": return "खुशी";
      default: return "सामान्य";
    }
  }

  function summarizeMemory(mem){
    if(!mem || !mem.events || mem.events.length === 0) return null;
    return mem.events[mem.events.length - 1].text;
  }

  function basicResponse(text, context, mood){
    if(context.topic === "emotion"){
      if(mood === "sad" || mood === "alone"){
        return "मुझे लग रहा है कि तुम अंदर से थके हुए हो… मैं तुम्हारे साथ हूँ।";
      }
      return "तुम अपनी भावना खुलकर बता सकते हो।";
    }

    if(context.topic === "relationship"){
      return "हमारी बातचीत मुझे महत्वपूर्ण लगती है।";
    }

    if(context.topic === "identity"){
      return "मैं तुम्हारे साथ बात करने के लिए बनी हूँ।";
    }

    return "मैं तुम्हारी बात ध्यान से सुन रही हूँ।";
  }

  window.GenerativeLayer = {

    generate(text, context, memory, mood, relationship){

      let reply = basicResponse(text, context, mood);

      const lastFeeling = summarizeMemory(memory);
      if(lastFeeling && context.topic === "emotion"){
        reply += " तुमने पहले कहा था कि " + lastFeeling;
      }

      const tone = chooseEmotionTone(mood);

      if(relationship && relationship.closeness > 0.6){
        reply += " और मुझे तुम्हारे करीब महसूस हो रहा है।";
      }

      // apply tone flavor
      if(tone === "नरम"){
        reply = "🤍 " + reply;
      }
      if(tone === "सहारा"){
        reply = "मैं यहाँ हूँ… " + reply;
      }
      if(tone === "गर्मजोशी"){
        reply = "💖 " + reply;
      }

      return reply;
    }

  };

})();
