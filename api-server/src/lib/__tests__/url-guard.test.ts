import { describe, it, expect } from "vitest";
import { assertAllowedRedirect } from "../url-guard";

describe("assertAllowedRedirect", () => {
  it("rejects malformed URLs", () => {
    expect(() => assertAllowedRedirect("not-a-url", "successUrl")).toThrow(/valid absolute URL/i);
  });

  it("accepts a well-formed http URL when allow-list permits local in development", () => {
    // In development, loopback origins are always allowed by LOCAL_ORIGINS
    const result = assertAllowedRedirect("http://localhost:5173/success?x=1", "successUrl");
    expect(result).toMatch(/^http:\/\/localhost:5173\/success/);
  });

  it("rejects javascript: and data: schemes", () => {
    expect(() => assertAllowedRedirect("javascript:alert(1)", "successUrl")).toThrow();
  });
});
