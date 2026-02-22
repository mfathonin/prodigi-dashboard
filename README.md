# Prodigi Dashboard

Prodigi Dashboard is an admin web application for managing digital book content. Built with modern web technologies, it offers a robust and user-friendly interface for content management.

## Tech Stack

- [Next.js 14](https://nextjs.org/docs) with App Router
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- SQLite/libSQL (migration in progress)

## Getting Started

### Prerequisites

- Node.js v18
- pnpm package manager

### Setup

1. Install dependencies:

   ```
   pnpm install
   ```

1. Set up environment variables:

   - Copy `.env.example` to `.env.local`
   - Update the variables in `.env.local` with your Supabase credentials

1. Configure database mode:

   - `DATABASE_DRIVER=sqlite-file` with `DATABASE_URL=file:./dev.db` for local
   - `DATABASE_DRIVER=libsql` with `LIBSQL_URL` and `LIBSQL_AUTH_TOKEN` for remote

### Development

Run the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Scripts

The project includes scripts for local/remote SQLite:

- `pnpm db:init`: Create bootstrap auth/banner tables
- `pnpm db:generate`: Generate drizzle migrations
- `pnpm db:push`: Apply schema to DB
- `pnpm db:studio`: Open Drizzle Studio

For more details on these scripts, refer to the `package.json` file.

## Features

- Book content management
- Link shortener with QR code available
- In app promotion banner
- User management
- Responsive design

## Additional Setup advices

- To use gmail as SMTP server, you can follow [this discussion](https://github.com/orgs/supabase/discussions/19646)
- Setup a local supabase service using following command:
  ```bash
  pnpm dlx supabase start
  ```
  This will start a local supabase service with default configuration. I suggest to run this command on a separate folder of this project.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

For any questions or support, please open an issue in the GitHub repository.

> **Author**
>
> [mfathonin](https://github.com/mfathonin) <br/> > _individual contributor_
