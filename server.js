const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/compile", async (req, res) => {
  const { language_id, source_code, stdin } = req.body;
  const apiKey = process.env.RAPIDAPI_KEY; 

  try {
    const response = await fetch("https://judge029.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "judge029.p.rapidapi.com",
      },
      body: JSON.stringify({ language_id, source_code, stdin }),
    });

    const data = await response.json();
    res.json(data); 

  } catch (error) {
    res.status(500).json({ error: "Server Error", message: error.message });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Aapka secure server chal raha hai!");
});
