import fs from "fs";
import path from "path";
import https from "https";
import { vowels, consonants, guninthalu, ottulu, words } from "./src/data/teluguData";

const OUT_DIR = path.join(process.cwd(), "public", "sounds", "telugu");

// Create directory if it doesn't exist
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const downloadAudio = (text: string, filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUT_DIR, `${filename}.mp3`);
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${filename}.mp3, already exists.`);
      return resolve();
    }

    const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=te&q=${encodeURIComponent(text)}`;

    console.log(`Downloading ${filename}.mp3...`);

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          console.error(`Failed to download ${text} (Status: ${res.statusCode})`);
          return reject(new Error(`Status Code: ${res.statusCode}`));
        }

        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });

        fileStream.on("error", (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("Starting audio generation...");
  let count = 0;

  // Process Vowels
  for (const item of vowels) {
    if (item.letter) {
      await downloadAudio(item.letter, `vowel_${item.pronunciation}`);
      count++;
      await delay(100);
    }
    if (item.exampleWord) {
      await downloadAudio(item.exampleWord, `word_${item.pronunciation}`);
      count++;
      await delay(100);
    }
  }

  // Process Consonants
  for (const item of consonants) {
    if (item.letter) {
      await downloadAudio(item.letter, `consonant_${item.pronunciation}`);
      count++;
      await delay(100);
    }
    if (item.exampleWord) {
      await downloadAudio(item.exampleWord, `word_${item.pronunciation}`);
      count++;
      await delay(100);
    }
  }

  console.log(`Successfully processed ${count} audio files.`);
}

main().catch(console.error);
