(function(){

  /* ===== EXISTING MEMORY (unchanged) ===== */
  let memory = JSON.parse(localStorage.getItem("anjaliMemory")) || [];

  function saveMemory(){
    localStorage.setItem("anjaliMemory", JSON.stringify(memory));
  }

  function clean(t){
    return (t||"").toLowerCase()
      .replace(/[^\u0900-\u097F a-z0-9 ]/g,"")
      .replace(/\s+/g," ")
      .trim();
  }

  /* ===== ADMIN (unchanged) ===== */
  window.saveQA = function(q,a){
    if(!q || !a) return;
    memory.push({ q: clean(q), a: a });
    saveMemory();
  };

  window.showMemory = function(){
    return memory.map(m=>"❓ "+m.q+" → "+m.a).join("<br>");
  };

  /* ===== भाव शब्दकोश (expanded but safe) ===== */
  const emotionMap = {
    ALONE: ["अकेला","अकेलापन","तन्हा","lonely","अकेले","अकेल","खाली"],
    SAD: ["उदास","दुखी","sad","रोना","दुख","टूट","थका"],
    TRUST: ["भरोसा","विश्वास","trust","यकीन"],
    LOVE: ["प्यार","love","मोहब्बत","चाहत","miss"]
  };

  function detectEmotion(text){
    for(let key in emotionMap){
      for(let w of emotionMap[key]){
        if(text.includes(w)) return key;
      }
    }
    return null;
  }

  /* ===== SIMILARITY (unchanged) ===== */
  function similarity(a,b){
    let A=a.split(" "), B=b.split(" ");
    let m=0;
    for(let w of A){
      if(B.includes(w)) m++;
    }
    return m / Math.max(A.length,B.length);
  }

  function findAnswer(text){
    let best=null, score=0;
    for(let m of memory){
      let s = similarity(text, m.q);
      if(s>score){
        score=s;
        best=m;
      }
    }
    if(best && score>0.35) return best.a;
    return null;
  }

  /* ===== CONTEXT MEMORY (new, non-breaking) ===== */
  let lastEmotion = null;

  /* ===== RESPONSE ENGINE ===== */
  window.ResponseEngine = {
    respond: function(userText){
      try{
        const raw = userText || "";
        const text = clean(raw);

        // 1️⃣ Direct Q-A match
        let ans = findAnswer(text);
        if(ans){
          const emo = detectEmotion(text);
          if(emo) lastEmotion = emo;
          return ans;
        }

        // 2️⃣ Emotion-based match
        const emo = detectEmotion(text);
        if(emo){
          lastEmotion = emo;
          for(let m of memory){
            if(detectEmotion(m.q) === emo){
              return m.a;
            }
          }
        }

        // 3️⃣ Contextual follow-up
        if(lastEmotion){
          for(let m of memory){
            if(detectEmotion(m.q) === lastEmotion){
              return m.a;
            }
          }
        }

        // 4️⃣ Fallback
        return "मुझे यह ठीक से समझ नहीं आया… तुम चाहो तो मुझे सिखा सकते हो 🤍";

      }catch(e){
        console.error(e);
        return "मुझे सोचने में थोड़ी परेशानी हुई 😔";
      }
    }
  };

})();
