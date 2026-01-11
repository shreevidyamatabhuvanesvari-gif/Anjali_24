alert("ResponseEngine loaded");
window.ResponseEngine = {
  respond: function(text){
    text = (text || "").toString().trim();

    if(!text){
      return "कुछ तो बोलो न 😊";
    }

    return "मैंने सुना: " + text;
  }
};
