# Quotes App 📚

A modern, interactive quotes application with intelligent recommendation system built with React, Vite, and Tailwind CSS. Discover, save, and get personalized quote recommendations based on your preferences.

## ✨ Features

- **User Authentication** - Simple username-based login system
- **Quote Library** - Browse through an extensive collection of inspiring quotes
- **Smart Recommendations** - Get personalized quote suggestions based on your interactions
- **Like System** - Like your favorite quotes to improve recommendations
- **Add Quotes** - Contribute new quotes with author attribution and tags
- **Responsive Design** - Beautiful UI that works seamlessly on all devices
- **Real-time Feedback** - Toast notifications for all user actions

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant toast notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://127.0.0.1:8000`

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quotes-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173`

## 📦 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint to check code quality         |

## 🏗️ Project Structure

```
quotes-frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   │   ├── QuotesGrid.jsx    # Grid display for quotes
│   │   └── ui/               # shadcn/ui components
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   │   ├── home-page.jsx     # Login page
│   │   └── quotes-page.jsx   # Main quotes page
│   ├── App.jsx        # Main app component with routing
│   ├── main.jsx       # Application entry point
│   └── index.css      # Global styles
├── components.json     # shadcn/ui configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js     # Vite configuration
```

## 🎯 Usage

### Login

1. Enter your username on the home page
2. Click "Login" to access the quotes library

### Browse Quotes

- Scroll through the grid of quotes
- Recommended quotes are highlighted with a green badge
- Click the expand button to view full quote details

### Like Quotes

- Click the heart icon to like a quote
- Liked quotes help improve your personalized recommendations

### Add New Quote

1. Click the "Add New Quote" button
2. Fill in the quote text, author name, and tags
3. Submit to add it to the collection

## 🔌 API Integration

The application connects to a backend API at `http://127.0.0.1:8000` with the following endpoints:

- `GET /users/search?username={username}` - User authentication
- `GET /quotes?user_id={id}&limit={n}&skip={n}` - Fetch quotes
- `POST /quotes/` - Create new quote
- `PATCH /quotes/{id}/likes` - Toggle quote like
- `GET /recommendation_request/{userId}` - Get recommendation parameters
- `POST /recommend` - Get personalized recommendations
- `POST /quotes/by_ids` - Fetch quotes by IDs

## 🎨 UI Components

The app uses [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible components:

- Button
- Card
- Dialog
- Input
- Label

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
