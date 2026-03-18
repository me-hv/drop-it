# Twitter Clone (Next.js + Prisma)

A minimal social media clone with post creation and timeline view.

## Setup

1. `cd "g:/Social Media/twitter-clone"`
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run dev`

Open http://localhost:3000

## Notes

- API route: `src/app/api/posts/route.ts`
- Frontend post component: `src/app/components/PostBox.tsx`
- Feed page: `src/app/page.tsx`
- Database: `prisma/schema.prisma` (SQLite)
