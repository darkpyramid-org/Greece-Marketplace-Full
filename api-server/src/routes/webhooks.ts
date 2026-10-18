/**
 * Stripe webhooks — marks orders paid and decrements stock.
 * Requires raw request body for signature verification.
 */

import { Router, type Request, type Response, type NextFunction } from "express";
import { env, isStripeConfigured } from "../lib/env";
import { logger } from "../lib/logger";
import { orderService } from "../services/order.service";

const router = Router();

async function handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    if (env.isProduction && isStripeConfigured() && !env.stripeWebhookSecret) {
      logger.error("STRIPE_WEBHOOK_SECRET missing in production while Stripe is configured");
      res.status(503).json({ error: { message: "Webhook not configured", statusCode: 503 } });
      return;
    }

    const signature = req.headers["stripe-signature"];
    if (!signature || typeof signature !== "string") {
      res.status(400).json({ error: { message: "Missing stripe-signature header", statusCode: 400 } });
      return;
    }

    if (!env.stripeWebhookSecret) {
      logger.warn("Stripe webhook received but STRIPE_WEBHOOK_SECRET is unset — ignoring");
      res.status(200).json({ received: true, ignored: true });
      return;
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(env.stripeSecretKey as string);

    const rawBody = req.body;
    const payload = Buffer.isBuffer(rawBody)
      ? rawBody
      : Buffer.from(typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody));

    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
    } catch (err) {
      logger.warn({ err }, "Stripe webhook signature verification failed");
      res.status(400).json({ error: { message: "Invalid signature", statusCode: 400 } });
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as { id: string; payment_status?: string };
      if (
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required" ||
        !session.payment_status
      ) {
        await orderService.markPaidFromStripe(session.id);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
}

router.post("/stripe", handleStripeWebhook);

export default router;
