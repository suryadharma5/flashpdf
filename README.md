# FlashAI

A modern web application for document-based learning, flashcards, and AI-powered Q&A, built with Next.js, TypeScript, and Pinecone.

## Features

- 🗂️ **Flashcard Generator**: Upload your PDF documents and turn it into interactive flashcard.
- 🧠 **AI Chat**: Ask questions about your study material and get context-aware answers.
- 📝 **Forum**: Discuss and comment on study material with other users.
- 📊 **History & Analytics**: Track your study progress and test results.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [React Query](https://tanstack.com/query/latest)
- [Prisma ORM](https://www.prisma.io/)
- [Pinecone](https://www.pinecone.io/) (Vector DB)
- [OpenAI API](https://platform.openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/) (Validation)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Pinecone account & API key
- OpenAI API key
- PostgreSQL or other supported database

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/flashpdf.git
   cd flashpdf
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env.local` file and add the following (fill in your values):

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/flashpdf
   NEXTAUTH_SECRET=your_secret
   OPENAI_API_KEY=your_openai_key
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_ENVIRONMENT=your_pinecone_env
   ```

4. **Run database migrations:**

   ```sh
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

6. **Visit [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

```
/app              # Next.js app directory
/components       # React components
/lib              # Utilities, API clients, and repositories
/pages            # (If used) legacy Next.js pages
/prisma           # Prisma schema and migrations
/public           # Static assets
/styles           # Global styles
```

## Scripts

- `dev` – Start development server
- `build` – Build for production
- `start` – Start production server
- `lint` – Run ESLint

---

**FlashAI** – Learn smarter, not harder.
