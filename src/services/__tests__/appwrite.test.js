import { describe, it, expect, beforeEach, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  listDocuments: vi.fn(),
  updateDocument: vi.fn(),
  createDocument: vi.fn(),
  equal: vi.fn(() => "equal-clause"),
  orderDesc: vi.fn(() => "orderDesc-clause"),
  limit: vi.fn(() => "limit-clause"),
  unique: vi.fn(() => "unique-id"),
}));

const Mocks = vi.hoisted(() => {
  class MockClient {
    setEndpoint() {
      return this;
    }
    setProject() {
      return this;
    }
  }
  class MockDatabases {
    listDocuments = mocks.listDocuments;
    updateDocument = mocks.updateDocument;
    createDocument = mocks.createDocument;
  }
  return { MockClient, MockDatabases };
});

vi.mock("appwrite", () => ({
  Client: Mocks.MockClient,
  Databases: Mocks.MockDatabases,
  Query: {
    equal: mocks.equal,
    orderDesc: mocks.orderDesc,
    limit: mocks.limit,
  },
  ID: {
    unique: mocks.unique,
  },
}));

import { updateSearchCount, getTrendingMovies } from "../appwrite.js";

describe("Appwrite service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateSearchCount", () => {
    it("creates a new document when no existing one is found", async () => {
      mocks.listDocuments.mockResolvedValueOnce({ documents: [] });
      mocks.createDocument.mockResolvedValueOnce({ $id: "new-id" });

      await updateSearchCount("matrix", { id: 603, poster_path: "/abc.jpg" });

      expect(mocks.equal).toHaveBeenCalledWith("searchTerm", "matrix");
      expect(mocks.createDocument).toHaveBeenCalledWith(
        "test-database",
        "test-collection",
        "unique-id",
        {
          searchTerm: "matrix",
          count: 1,
          movie_id: 603,
          poster_url: "https://image.tmdb.org/t/p/w500/abc.jpg",
        }
      );
      expect(mocks.updateDocument).not.toHaveBeenCalled();
    });

    it("increments the count when an existing document is found", async () => {
      mocks.listDocuments.mockResolvedValueOnce({
        documents: [{ $id: "doc-1", count: 5 }],
      });
      mocks.updateDocument.mockResolvedValueOnce({});

      await updateSearchCount("matrix", { id: 603, poster_path: "/abc.jpg" });

      expect(mocks.updateDocument).toHaveBeenCalledWith(
        "test-database",
        "test-collection",
        "doc-1",
        { count: 6 }
      );
      expect(mocks.createDocument).not.toHaveBeenCalled();
    });

    it("swallows errors so the UI is not affected", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mocks.listDocuments.mockRejectedValueOnce(new Error("boom"));

      await expect(
        updateSearchCount("matrix", { id: 1, poster_path: "/p.jpg" })
      ).resolves.toBeUndefined();
    });
  });

  describe("getTrendingMovies", () => {
    it("lists documents ordered by count desc, limited to 5", async () => {
      const docs = [{ $id: "1" }, { $id: "2" }];
      mocks.listDocuments.mockResolvedValueOnce({ documents: docs });

      const result = await getTrendingMovies();

      expect(mocks.orderDesc).toHaveBeenCalledWith("count");
      expect(mocks.limit).toHaveBeenCalledWith(5);
      expect(mocks.listDocuments).toHaveBeenCalledWith(
        "test-database",
        "test-collection",
        ["orderDesc-clause", "limit-clause"]
      );
      expect(result).toBe(docs);
    });

    it("returns an empty array on error", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mocks.listDocuments.mockRejectedValueOnce(new Error("fail"));

      const result = await getTrendingMovies();
      expect(result).toEqual([]);
    });
  });
});
