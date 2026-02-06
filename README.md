# 🧱 Start Project From Zero (Dependency Checklist)

Kalau kamu membuat project NestJS baru dari nol, install dependency berikut 👇

---

## 1️⃣ Create NestJS Project

```bash
npx @nestjs/cli new nestjs-todo
cd nestjs-todo
```

## 2️⃣ Install Prisma (Recommended v6.19)

```bash
npm install prisma@6.19.0 @prisma/client@6.19.0
npx prisma init
```

## 3️⃣ Authentication Dependencies (JWT + Passport)

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

```
## 4️⃣ Validation & Transformation

```bash
npm install class-validator class-transformer
```
## 5️⃣ Cookie Authentication (Google OAuth + JWT Cookie)

```bash
npm install cookie-parser
npm install -D @types/cookie-parser
```

## 6️⃣ Environment Variables

```bash
npm install @nestjs/config
```