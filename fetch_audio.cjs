const https = require("https");
const fs = require("fs");
const path = require("path");

const audioDir = path.join(__dirname, "public", "sounds", "telugu");

const items = [
  { file: "consonant_thalupu.mp3", text: "త" },
  { file: "word_thalupu.mp3", text: "తలుపు" },
  { file: "consonant_ratham.mp3", text: "థ" },
  { file: "word_ratham.mp3", text: "రథం" },
  { file: "consonant_danda.mp3", text: "ద" },
  { file: "word_danda.mp3", text: "దండ" },
  { file: "consonant_dhanassu.mp3", text: "ధ" },
  { file: "word_dhanassu.mp3", text: "ధనుస్సు" },
  { file: "consonant_nakka.mp3", text: "న" },
  { file: "word_nakka.mp3", text: "నక్క" },
];

items.forEach((item) => {
  const url =
    "https://translate.google.com/translate_tts?ie=UTF-8&tl=te&client=tw-ob&q=" +
    encodeURIComponent(item.text);
  const filePath = path.join(audioDir, item.file);

  https
    .get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filePath));
        console.log("Downloaded", item.file);
      } else {
        console.error("Failed to download", item.file, res.statusCode);
      }
    })
    .on("error", (err) => {
      console.error("Error downloading", item.file, err);
    });
});
