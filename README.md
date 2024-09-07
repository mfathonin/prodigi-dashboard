# Prodigi Dashboard

Prodigi Dashboard is an admin web application for managing digital book content. Built with modern web technologies, it offers a robust and user-friendly interface for content management.

## Tech Stack

- [Next.js 14](https://nextjs.org/docs) with App Router
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Supabase](https://supabase.com) for backend services

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

1. Ensure your Supabase project is properly configured and accessible

### Development

Run the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Supabase Scripts

The project includes several helpful scripts for working with Supabase:

- `pnpm supa:start`: Start the local Supabase service
- `pnpm supa:stop`: Stop the local Supabase service
- `pnpm supa:typegen`: Generate TypeScript types from your Supabase schema
- `pnpm supa:db:diff`: Generate a diff of your database changes
- `pnpm supa:db:check`: Check the status of your Supabase database
- `pnpm supa:db:push`: Push local changes to your Supabase database
- `pnpm supa:db:backup`: Create a backup of your Supabase database

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
