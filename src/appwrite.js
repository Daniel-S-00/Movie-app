import { Client, Databases, Query, ID } from "appwrite"; //compiled SDK

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; //manual
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID; //auto
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID; //manual

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) //auto
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        // Check if document with the search term already exists
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal("searchTerm", searchTerm),
        ]);
        console.log("--RESULT--", result);
        // If exists, increment count, else create new document
        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });

        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
    }
};

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc("count"),
            Query.limit(5),
        ]);
        return result.documents;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
}


//class Client {
//   setEndpoint(url)
//   setProject(projectId)
//   setJWT(token)
// }
//
// class Databases {
//   constructor(client)
//
//   listDocuments()
//   getDocument()
//   createDocument()
//   updateDocument()
//   deleteDocument()
// }