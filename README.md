# Agentic AI Generator for Founder-Centric Business Model Canvas (BMC)

A modern web application for founders to ideate, validate, and iterate on business models using the Business Model Canvas (BMC) framework. Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/).

## Features

- **User Authentication**: Sign up and log in to manage your business ideas securely.
- **Business Idea Input**: Submit and manage multiple business ideas.
- **Business Model Canvas (BMC) Editor**: Create, edit, and visualize your BMC for each idea.
- **Validation Dashboard**: View feasibility scores, validation reports, strengths, risks, and suggestions for your BMC.
- **Version History**: Save and load previous BMC drafts for each idea.
- **Company Examples**: See real-world company examples related to your BMC.
- **Modern UI**: Responsive, accessible, and visually appealing interface using Tailwind CSS.

## App Structure

- **/login**: User authentication (login & signup)
- **/home**: List and manage your business ideas
- **/input**: Submit a new business idea
- **/bmc**: Visualize and edit your Business Model Canvas
- **/dashboard**: View validation results, suggestions, and version history
- **/control-panel**: Advanced BMC editing and version management

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **PostCSS**

## Customization & Configuration
- **TypeScript config**: See `tsconfig.json` for strict type settings and path aliases.
- **Tailwind/PostCSS**: See `postcss.config.mjs` and `src/app/globals.css` for styling setup.
- **Next.js config**: See `next.config.ts` for custom Next.js options.

## API & Backend
This app expects a backend API (see `src/api/idea.ts` and `src/api/user.ts`) running at `http://localhost:3002` for user and idea management. Adjust endpoints as needed for your environment.

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

## License
MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
