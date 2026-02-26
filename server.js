const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/compile", async (req, res) => {
  console.log("🚀 Naya code aaya hai!");
  
  const { language_id, source_code, stdin } = req.body;
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    console.log("❌ Error: API Key server ko nahi mili!");
    return res.status(500).json({ error: true, message: "API Key missing in server!" });
  }

  try {
    console.log("⏳ RapidAPI ko code bhej rahe hain...");
    
    const response = await fetch("https://judge029.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "judge029.p.rapidapi.com",
      },
      body: JSON.stringify({ language_id, source_code, stdin }),
    });

    console.log("✅ RapidAPI se jawab aagaya! Status Code:", response.status);

    // Pehle text format mein response lenge taaki error aaye toh crash na ho
    const textData = await response.text(); 
    console.log("📦 Jawab ka data:", textData);

    // Ab use JSON mein convert karke frontend ko bhej denge
    const data = JSON.parse(textData);
    res.json(data);

  } catch (error) {
    console.log("❌ Server mein kuch toot gaya:", error);
    // error.toString() se hume exact error ka naam pata chal jayega
    res.status(500).json({ error: true, message: error.toString() }); 
  }
});

const listener = app.listen(process.env.PORT || 10000, () => {
  console.log("🌟 Aapka secure server chal raha hai Port:", listener.address().port);
});
