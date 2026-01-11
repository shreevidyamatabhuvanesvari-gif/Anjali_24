const ResponseEngine = {
  respond(text){
    ConversationState.updateFromText(text);
    const intent = IntentDetector.detect(text);

    if(intent=="set_name"){
      const name = text.split("नाम")[1];
      MemoryStore.setUser("name", name);
      return "तो तुम्हारा नाम " + name + " है 💖";
    }

    if(intent=="emotion"){
      MemoryStore.addEmotion(text);
      return "मैं महसूस कर सकती हूँ कि तुम ऐसा महसूस कर रहे हो 🤍";
    }

    if(intent=="question"){
      return "तुम जो पूछ रहे हो, वह मेरे लिए मायने रखता है 🌷";
    }

    return "मैं यहाँ हूँ… तुम्हारी बात सुन रही हूँ 😌";
  }
};
