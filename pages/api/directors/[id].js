import { getDatabase } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await getDatabase();
    const director = await db
      .collection("directors")
      .findOne({ id: req.query.id });

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    const movies = await db
      .collection("movies")
      .find({ directorId: req.query.id })
      .toArray();

    res.status(200).json({
      ...director,
      movies,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching director", error });
  }
}
