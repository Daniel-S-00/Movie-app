const required = (name, value) => {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Check your .env.local file. See .env.example for reference.`
    );
  }
  return value;
};

export const config = {
  tmdb: {
    apiKey: required("VITE_TMDB_API_KEY", import.meta.env.VITE_TMDB_API_KEY),
  },
  appwrite: {
    endpoint: required(
      "VITE_APPWRITE_ENDPOINT",
      import.meta.env.VITE_APPWRITE_ENDPOINT
    ),
    projectId: required(
      "VITE_APPWRITE_PROJECT_ID",
      import.meta.env.VITE_APPWRITE_PROJECT_ID
    ),
    databaseId: required(
      "VITE_APPWRITE_DATABASE_ID",
      import.meta.env.VITE_APPWRITE_DATABASE_ID
    ),
    collectionId: required(
      "VITE_APPWRITE_COLLECTION_ID",
      import.meta.env.VITE_APPWRITE_COLLECTION_ID
    ),
  },
};
