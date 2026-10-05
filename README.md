# KodaStore API

E-commerce REST API built with Express & MongoDB, featuring 40+ endpoints for transactional order processing, Cloudinary image management, smart stock management, automated emails, Stripe payments, and admin analytics.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat&logo=stripe&logoColor=white)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [API Reference](#api-reference)
- [Business Logic Highlights](#business-logic-highlights)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## Features

- **Authentication** — OTP-based email verification on signup, JWT auth via an HTTP-only cookie, and a forgot/reset password flow
- **Products** — full CRUD, Cloudinary image uploads, category/brand/price filters, full-text search, and a review system
- **Cart** — add/update/remove items with live stock checks, plus a coupon system
- **Orders** — cash or Stripe checkout, atomic stock updates via a MongoDB transaction, cancellation, and a status pipeline from `pending` to `delivered`
- **Stripe integration** — PaymentIntents on checkout, webhook-driven payment confirmation
- **Wishlists** — save and manage favorite products
- **Admin dashboard** — revenue (total/monthly/growth), order counts by status, top-selling products, 7-day revenue trend, recent orders, and customer count — all via MongoDB aggregation pipelines
- **Transactional emails** — OTP codes, order confirmation, and order status updates

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | Routing, middleware, error handling |
| MongoDB + Mongoose | Database, schemas, validation, hooks |
| JWT | Stateless auth, issued as an HTTP-only cookie |
| bcryptjs | Password and OTP hashing |
| Joi | Request validation |
| Stripe | Online payments and webhooks |
| Cloudinary + Multer | Image upload and storage |
| Nodemailer | Transactional emails |
| Slugify | URL-friendly product slugs |
| cors, cookie-parser, dotenv | Standard Express middleware |

## Project Structure

```
ecommerce-api/
├── config/           # Cloudinary config
├── models/           # Mongoose schemas (User, Product, Order, Cart, Wishlist, OTP)
├── controllers/      # Business logic per resource
├── routes/           # Express route definitions
├── validators/        # Joi schemas
├── middleware/       # auth, role check, upload, validation, error handling
├── utils/            # asyncHandler, createError, sendEmail, uploadToCloudinary
├── db/               # Database connection
├── app.js          # App entry point
├── server.js
└── vercel.json        # Vercel deployment config
```

## Data Model
 
Six collections: `User`, `Product`, `Order`, `Cart`, `Wishlist`, `OTP`. A few relationships worth knowing before reading the endpoints:
 
- A `Cart` and a `Wishlist` each belong to exactly one `User`. Cart totals (`subtotal`, `discountAmount`, `total`, `itemCount`) are Mongoose virtuals, computed on read rather than stored — and coupon codes (`SAVE10`, `SAVE20`, `SAVE50`, `SAVE80`, `OFF50`) are defined server-side, not in the database.
- An `Order`'s `items[]` are a snapshot (name, image, price, quantity) taken at purchase time, independent of later changes to the `Product`. `status` moves forward through `pending → confirmed → processing → shipped → delivered`, with `cancelled` / `returned` as side branches.
- A `Product`'s `averageRating` / `numReviews` are recalculated whenever a review is added or removed, and `slug` is auto-generated from `name`.
Exact fields, types and validation rules for every model are in [`docs/swagger.json`](./docs/swagger.json).

## API Reference

40+ endpoints across authentication, users, products, carts, orders, wishlists, admin, and the Stripe webhook. Full request/response schemas, auth requirements, and query parameters are documented in the OpenAPI spec:
 
- **Spec file:** [`docs/swagger.json`](./docs/swagger.json)
- **Interactive docs:** served at `[/api-docs](https://ecommerce-api-kodastore.vercel.app/api-docs/)` (Swagger UI) when the server is running
Authentication across the API is a JWT stored in an HTTP-only `token` cookie, set by `POST /auth/login`.

## Business Logic Highlights

- **Order transactions** — `createOrder` and cancellation run inside a single Mongoose session: stock is validated and adjusted, the order is written, and the cart is cleared together. If any step fails, everything rolls back.
- **Stock tracking through the cart** — adding, updating, or removing a cart item adjusts product stock immediately, rather than only at checkout.
- **Image lifecycle** — product images are uploaded to Cloudinary on create, can be selectively added/removed on update, and are deleted from Cloudinary when the product is deleted.
- **Stripe webhook** — `payment_intent.succeeded` marks an order paid and confirmed; `payment_intent.payment_failed` marks it failed; `payment_intent.canceled` cancels the order and restores stock.
- **Admin dashboard** — built from several aggregation pipelines run in parallel (revenue by period, order counts by status, top 5 products by units sold, last 7 days of revenue, 5 most recent orders).

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Deployment

Deployed on Vercel with MongoDB Atlas (Network Access set to allow all, since Vercel's outgoing IPs aren't static).
