# SUPER VITRIER - Website

This is the official website for SUPER VITRIER, a company specializing in high-quality glass and aluminum solutions in Côte d'Ivoire. The site is built with modern web technologies to be fast, responsive, and easy to maintain.

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_BADGE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE_NAME/deploys)

## ✨ Features

- **Multi-Page Architecture**: A classic, fast-loading website structure.
- **Responsive Design**: Looks great on all devices, from mobile phones to desktops, thanks to Tailwind CSS.
- **Multi-language Support**: Content available in both French (fr) and English (en).
- **Performance Optimized**: Uses Vite for a fast development experience and an optimized production build.
- **Offline Capable**: Implements a Service Worker for basic offline access and improved performance.
- **CMS Ready**: Configured for content management using Netlify CMS.

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Deployment**: [Netlify](https://www.netlify.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or another package manager like pnpm or yarn

### Installation & Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Rashymad/supervitriermodern.git
    cd supervitriermodern
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This will start a local server, typically at `http://localhost:5173`, with hot module replacement.
    ```bash
    npm run dev
    ```

### Building for Production

To create an optimized version of the site for deployment, run:

```bash
npm run build
```

This command will generate a `dist` folder with all the static assets ready to be hosted.

## 📝 Content Management

Content for the site can be managed via Netlify CMS. Access the admin panel by navigating to `/admin/` on the deployed site URL (e.g., `https://your-site.netlify.app/admin/`).