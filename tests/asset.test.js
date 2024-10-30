import request from "supertest";
import app from "../app";
import { describe, it, expect } from "vitest";

describe("Assets API", () => {
  it("GET /api/assets - should retrieve all assets", async () => {
    const response = await request(app).get("/api/assets");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("GET /api/assets/:id - should retrieve a single asset by id", async () => {
    const response = await request(app).get("/api/assets/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", "1");
    expect(response.body).toHaveProperty("name");
  });

  it("GET /api/assets/:id - should return 404 for non-existing asset", async () => {
    const response = await request(app).get("/api/assets/999");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Asset not found");
  });

  // Prueba para GET /api/assets/slug/:slug
  it("GET /api/assets/slug/:slug - should retrieve a single asset by slug", async () => {
    const response = await request(app).get("/api/assets/slug/asset-1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("slug", "asset-1");
  });

  it("GET /api/assets/slug/:slug - should return 404 for non-existing slug", async () => {
    const response = await request(app).get(
      "/api/assets/slug/non-existing-slug"
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Asset not found");
  });

  // Prueba para POST /api/assets
  it("POST /api/assets - should create a new asset", async () => {
    const newAsset = {
      name: "New Asset",
      price: 300,
      slug: "new-asset",
      image: "https://via.placeholder.com/150",
      tokenAssetAddress: "BQhCiUcQfDgoLLx6XUf6ne7kYe5YE8ZKMHpJ9j2yaW5N",
    };
    const response = await request(app).post("/api/assets").send(newAsset);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", newAsset.name);
  });

  it("POST /api/assets - should return 500 for invalid data", async () => {
    const response = await request(app).post("/api/assets").send({});
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  // Prueba para PATCH /api/assets/:id
  it("PATCH /api/assets/:id - should update an existing asset", async () => {
    const updatedAsset = { name: "Updated Asset", price: 400 };
    const response = await request(app)
      .patch("/api/assets/1")
      .send(updatedAsset);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name", "Updated Asset");
    expect(response.body).toHaveProperty("price", 400);
  });

  it("PATCH /api/assets/:id - should return 404 for non-existing asset", async () => {
    const response = await request(app)
      .patch("/api/assets/999")
      .send({ name: "Non-existing asset" });
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Asset not found");
  });

  // Prueba para DELETE /api/assets/:id
  it("DELETE /api/assets/:id - should delete an asset", async () => {
    const response = await request(app).delete("/api/assets/1");
    expect(response.statusCode).toBe(204);
  });

  it("DELETE /api/assets/:id - should return 404 for non-existing asset", async () => {
    const response = await request(app).delete("/api/assets/999");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Asset not found");
  });
});
