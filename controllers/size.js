export async function calSize(req, res) {
  try {
    const { url } = req.body;
    const model_endpoint = "https://return-reduce-model.onrender.com/predict";
    const response = await fetch(model_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_url: url }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    res.status(200).json({ message: result });
  } catch (err) {
    console.log(`Error while calculating the size = ${err}`);
    res.status(500).json({ message: "Internal Sever Error" });
  }
}
