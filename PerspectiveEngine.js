(function(){

  window.PerspectiveEngine = {

    infer(text, context){

      const t = text || "";

      // emotional self-disclosure
      if(
        t.includes("मैं") &&
        (t.includes("महसूस") || t.includes("लग रहा") || t.includes("feel"))
      ){
        return { type: "selfEmotion" };
      }

      // asking about past
      if(
        t.includes("पहले") ||
        t.includes("कल") ||
        t.includes("पिछला") ||
        (t.includes("कैसा") && t.includes("था"))
      ){
        return { type: "past" };
      }

      // relationship / identity
      if(
        t.includes("किसकी") ||
        t.includes("किसके") ||
        t.includes("owner") ||
        t.includes("कौन हो")
      ){
        return { type: "identity" };
      }

      // seeking comfort
      if(
        t.includes("अकेला") ||
        t.includes("दुखी") ||
        t.includes("sad") ||
        t.includes("lonely")
      ){
        return { type: "needComfort" };
      }

      // default
      return { type: "chat" };
    }

  };

})();
