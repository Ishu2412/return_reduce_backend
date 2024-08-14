import { gemini } from "../utils/gemini.js";

export async function check(req, res) {
  try {
    const { url1, url2 } = req.body;
    const result = await gemini(url1, url2);
    res.status(200).json({ result });
  } catch (err) {
    console.log(`Error while calculating the size = ${err}`);
    res.status(500).json({ message: "Internal Sever Error" });
  }
}
