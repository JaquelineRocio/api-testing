import request from "supertest";
import app from "../app";
import { describe, it, expect } from "vitest";

describe("Tasks API", () => {
  it("GET /api/tasks - should retrieve all tasks", async () => {
    const response = await request(app).get("/api/tasks");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("GET /api/tasks/:id - should retrieve a single task by id", async () => {
    const response = await request(app).get("/api/tasks/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("title");
  });

  it("GET /api/tasks/:id - should return 404 for non-existing task", async () => {
    const response = await request(app).get("/api/tasks/999");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Task not found with id: 999"
    );
  });

  it("POST /api/tasks - should create a new task", async () => {
    const newTask = { title: "New Task", description: "New task description" };
    const response = await request(app).post("/api/tasks").send(newTask);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title", newTask.title);
    expect(response.body).toHaveProperty("description", newTask.description);
  });

  it("POST /api/tasks - should return 400 if title or description is missing", async () => {
    const response = await request(app).post("/api/tasks").send({ title: "" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Description is required");
  });

  it("PATCH /api/tasks/:id - should update an existing task", async () => {
    const updatedTask = { title: "Updated Task" };
    const response = await request(app).patch("/api/tasks/1").send(updatedTask);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Task");
  });

  it("PATCH /api/tasks/:id - should return 404 for non-existing task", async () => {
    const response = await request(app)
      .patch("/api/tasks/999")
      .send({ title: "Non-existing task" });
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Task not found with id: 999"
    );
  });

  it("DELETE /api/tasks/:id - should delete a task", async () => {
    const response = await request(app).delete("/api/tasks/1");
    expect(response.statusCode).toBe(204);
  });

  it("DELETE /api/tasks/:id - should return 404 for non-existing task", async () => {
    const response = await request(app).delete("/api/tasks/999");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Task not found with id: 999"
    );
  });
});
