import clientPromise from "./mongodb";
import { Theme } from "./types";

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

// Check if a theme by name exists
export async function colorThemeByNameExists(name: string): Promise<boolean> {
    try {
        const client = await clientPromise;
        const db = client.db("chroma_ai");

        const formattedName = name.replace(/-/g, ' ').toLowerCase(); // Replace hyphens with spaces and convert to lowercase

        // Check if a theme with the given name exists
        const theme = await db.collection('themes').findOne({
            $or: [
                { $expr: { $eq: [{ $toLower: "$name" }, formattedName] } }, // Match after normalizing both
                { $expr: { $eq: [{ $toLower: "$name" }, name.toLowerCase()] } } // Exact lowercase match
            ]
        });

        return !!theme; // Return true if theme exists, false otherwise
    } catch (e) {
        console.error(e);
        return false; // Return false in case of an error
    }
}

// Original function now calls the new function
export async function getColorThemesByName(name: string) {
    try {
        const client = await clientPromise;
        const db = client.db("chroma_ai");

        const formattedName = name.replace(/-/g, ' ').toLowerCase(); // Replace hyphens with spaces and convert to lowercase

        const themes = await db.collection('themes').find({
            $or: [
                { $expr: { $eq: [{ $toLower: "$name" }, formattedName] } }, // Match after normalizing both
                { $expr: { $eq: [{ $toLower: "$name" }, name.toLowerCase()] } } // Exact lowercase match
            ]
        }).toArray();

        return {
            message: 'success',
            themes: JSON.stringify(themes),
        };
    } catch (e) {
        console.error(e);
    }
}


export async function insertColorTheme(theme: Theme) {
    try {
        const client = await clientPromise;
        const db = client.db("chroma_ai");
        const themes = db.collection("themes");

        // Insert the theme into the collection
        const result = await themes.insertOne(theme);
        console.log("Inserted theme with ID:", result.insertedId);
        
        // Return a plain object with the inserted theme data
        return {
            ...theme,
            _id: result.insertedId.toString() // Convert ObjectId to string
        };
    } catch (e) {
        console.error("Error inserting theme:", e);
        throw new Error("Failed to insert theme into MongoDB");
    }
}