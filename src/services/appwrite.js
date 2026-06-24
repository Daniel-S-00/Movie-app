import { Client, Databases, Query, ID } from "appwrite";
import { config } from "../config.js";

const client = new Client()
    .setEndpoint(config.appwrite.endpoint)
    .setProject(config.appwrite.projectId);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listDocuments(
            config.appwrite.databaseId,
            config.appwrite.collectionId,
            [Query.equal("searchTerm", searchTerm)]
        );

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(
                config.appwrite.databaseId,
                config.appwrite.collectionId,
                doc.$id,
                { count: doc.count + 1 }
            );
        } else {
            await database.createDocument(
                config.appwrite.databaseId,
                config.appwrite.collectionId,
                ID.unique(),
                {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            );
        }
    } catch (error) {
        console.error("Error updating search count:", error);
    }
};

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(
            config.appwrite.databaseId,
            config.appwrite.collectionId,
            [Query.orderDesc("count"), Query.limit(5)]
        );
        return result.documents;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};