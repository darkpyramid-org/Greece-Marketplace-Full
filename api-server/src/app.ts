import express, { type Express } from "express";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { corsConfig, errorHandler, requestLogger, securityHeaders } from "./middlewares";
import { swaggerConfig } from "./lib/swagger";
import webhooksRouter from "./routes/webhooks";

const app: Express = express();

// Behind a reverse proxy (Vercel, Render, nginx) `req.ip` must be taken from
// `X-Forwarded-For`, otherwise every client shares the proxy's IP and the
// rate limiter throttles the whole internet as one client.
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Logging middleware
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Security headers
app.use(securityHeaders);

// CORS middleware
app.use(corsConfig);

// Stripe webhooks need the raw body for signature verification.
// Mount before express.json() so the payload is not pre-parsed.
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json", limit: "100kb" }),
  webhooksRouter,
);

// Body parsing middleware.
// The explicit size cap matters: `express.json()` defaults to 100kb, but an
// unbounded/oversized body can still be used to exhaust memory before any
// route-level validation runs.
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Request logging
app.use(requestLogger);

// API routes
app.use("/api", router);

// Swagger/OpenAPI documentation
app.get("/api-docs", (_req, res) => {
  res.json(swaggerConfig);
});

// Health check at root
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "GREECE HIEROGLYPHS API is running. Built with Dark Pyramid." });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: {
      message: "Not Found",
      statusCode: 404,
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
