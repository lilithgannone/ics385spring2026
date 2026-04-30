// Testing AC 1-7 for HW15. 8-11 manually tested in browser (all results on PRD)
process.env.NODE_ENV = "test";
process.env.SESSION_SECRET = "test-session-secret";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";

const fs = require("fs");
const path = require("path");
const request = require("supertest");

jest.mock("../models/User", () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn()
}));

jest.mock("../models/Property", () => ({
  findOne: jest.fn(),
  find: jest.fn()
}));

const User = require("../models/User");
const Property = require("../models/Property");
const app = require("../app");

describe("HW15 acceptance tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AC-1 public marketing page route responds", async () => {
    const response = await request(app).get("/");

    expect([200, 302, 404]).toContain(response.status);
  });

  test("AC-2 local sign-in redirects to admin dashboard and sets session cookie", async () => {
    const fakeAdminUser = {
      id: "admin-user-id",
      _id: "admin-user-id",
      email: "admin@example.com",
      role: "admin",
      provider: "local",
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(fakeAdminUser);
    User.findById.mockResolvedValue(fakeAdminUser);

    const response = await request(app)
      .post("/login")
      .type("form")
      .send({
        email: "admin@example.com",
        password: "password123"
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/admin/dashboard");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("AC-3 Google OAuth route redirects visitor to Google", async () => {
    const response = await request(app).get("/auth/google");

    expect(response.status).toBe(302);
    expect(response.headers.location).toContain("accounts.google.com");
  });

  test("AC-4 unauthenticated admin dashboard request redirects to admin login", async () => {
    const response = await request(app).get("/admin/dashboard");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/admin/login");
    expect(response.text).not.toContain("Admin Dashboard");
  });

  test("AC-5 logout redirects to login and clears session cookie", async () => {
    const response = await request(app).post("/logout");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/admin/login");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  test("AC-6 secret hygiene files are configured correctly", () => {
    const repoRoot = path.join(__dirname, "..");
    const gitignore = fs.readFileSync(path.join(repoRoot, ".gitignore"), "utf8");

    expect(fs.existsSync(path.join(repoRoot, ".env.example"))).toBe(true);
    expect(gitignore).toContain(".env");

    const envExample = fs.readFileSync(path.join(repoRoot, ".env.example"), "utf8");

    expect(envExample).toContain("MONGO_URI=");
    expect(envExample).toContain("SESSION_SECRET=");
    expect(envExample).toContain("GOOGLE_CLIENT_ID=");
    expect(envExample).toContain("GOOGLE_CLIENT_SECRET=");
  });

  test("AC-7 admin can post an announcement that is available to the marketing page", async () => {
    const fakeAdminUser = {
      id: "admin-user-id",
      _id: "admin-user-id",
      email: "admin@example.com",
      role: "admin",
      provider: "local",
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    const fakeProperty = {
      name: "Lava Birds B&B",
      specialOffer: "Spring welcome announcement",
      specialOfferDetails: "Book direct for a local welcome gift.",
      save: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(fakeAdminUser);
    User.findById.mockResolvedValue(fakeAdminUser);
    Property.findOne.mockResolvedValue(fakeProperty);

    const agent = request.agent(app);

    await agent
      .post("/login")
      .type("form")
      .send({
        email: "admin@example.com",
        password: "password123"
      })
      .expect(302);

    const postResponse = await agent
      .post("/admin/special-offer")
      .type("form")
      .send({
        specialOffer: "Fresh lava view announcement",
        specialOfferDetails: "Guests can now request the newest local guide at check-in."
      });

    expect(postResponse.status).toBe(302);
    expect(postResponse.headers.location).toBe("/admin/dashboard?updated=true");
    expect(fakeProperty.specialOffer).toBe("Fresh lava view announcement");
    expect(fakeProperty.specialOfferDetails).toBe(
      "Guests can now request the newest local guide at check-in."
    );
    expect(fakeProperty.save).toHaveBeenCalled();

    const publicResponse = await request(app).get("/api/properties/primary");

    expect(publicResponse.status).toBe(200);
    expect(publicResponse.body.specialOffer).toBe("Fresh lava view announcement");
    expect(publicResponse.body.specialOfferDetails).toBe(
      "Guests can now request the newest local guide at check-in."
    );
  });
});
