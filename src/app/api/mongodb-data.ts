import clientPromise from "./mongodb";

export async function getAllColorThemes() {
    try {
        const client = await clientPromise;
        const db = client.db("chroma_ai");
        // console.log("you got it! db:", db);
        const themes = await db.collection('themes').find().toArray();

        // console.log(`we got ${themes.length} themes!`);

        return {
            'message': 'success',
            'themes': JSON.stringify(themes),
        }
    } catch (e) {
        console.error(e);
      }
}

export async function insertColorTheme(keyword: string, model?: string) {
    try {
        const client = await clientPromise;
        const db = client.db("chroma_ai");
        const themes = db.collection("themes");
        console.log("themes???:::", (await themes.find({}).toArray()).length);

    } catch (e) {

    }
}