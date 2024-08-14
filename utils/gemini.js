import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import env from "dotenv";
import fs from "fs";
import fetch from "node-fetch";
import __dirname from "../utils/path.js";
import path from "path";

// Access your API key as an environment variable (see "Set up your API key" above)
env.config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

//downloading images
async function downloadImage(
  url,
  localPath,
  rangeStart = 0,
  rangeEnd = undefined
) {
  const headers = {};

  if (rangeEnd !== undefined) {
    headers["Range"] = `bytes=${rangeStart}-${rangeEnd}`;
  }

  const response = await fetch(url, { headers });
  const imageBuffer = await response.arrayBuffer();
  fs.writeFileSync(localPath, Buffer.from(imageBuffer));
}

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

export async function gemini(url1, url2) {
  //image type
  const regex = /[^.]+$/;
  const type1 = url1.match(regex)[0];
  const name1 = url1.replace(/\.[^/.]+$/, "");
  const type2 = url2.match(regex)[0];
  const name2 = url2.replace(/\.[^/.]+$/, "");

  //downloading image
  await downloadImage(
    `${name1}.jpg`,
    path.join(__dirname, `/public/images/image1.jpg`),
    0,
    712 * 712
  );
  await downloadImage(
    `${name2}.jpg`,
    path.join(__dirname, `/public/images/image2.jpg`),
    0,
    712 * 712
  );

  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    safetySettings,
  });

  const prompt = `These two images are of same object before and after delivery. Compare if the object can be returned or not.`;

  const imageParts = [
    fileToGenerativePart(
      path.join(__dirname, `/public/images/image1.jpg`),
      "image/png"
    ),
    fileToGenerativePart(
      path.join(__dirname, `/public/images/image2.jpg`),
      "image/png"
    ),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = result.response;
  const text = response.text();
  // console.log(text);
  return text;
}
