# Qinghua NextJS Chat Application

A modern chat application built with NextJS, Tailwind CSS, TypeScript, and MongoDB.

## Features

- Real-time chat interface
- Conversation history tracking
- AI-powered responses via OpenRouter/OpenAI
- Clean and responsive UI with shadcn/ui components
- MongoDB database integration

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Lucide icons
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **AI Integration**: OpenRouter API (for OpenAI)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB connection string

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/qinghua-nextjs.git
cd qinghua-nextjs
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGO_PUBLIC_URL=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
qinghua-nextjs/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── conversation/     # Conversation API endpoints
│   │   ├── conversations/    # Multiple conversations endpoints
│   │   └── generate/         # AI text generation endpoints
│   ├── chat/                 # Chat interface page
│   ├── components/           # App-specific components
│   ├── data/                 # Data handling
│   ├── history/              # Conversation history page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # Reusable components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utility functions
│   ├── models/               # MongoDB models
│   │   ├── conversation.ts   # Conversation model
│   │   └── todo.ts           # Todo model
│   ├── db.ts                 # Database connection
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
├── .env                      # Environment variables
├── next.config.ts            # Next.js configuration
└── package.json              # Project dependencies
```

## API Routes

- `GET /api/conversations`: Fetch all conversations
- `POST /api/conversation`: Create a new conversation
- `GET /api/conversation/:id`: Get a specific conversation
- `POST /api/generate`: Generate AI response

## MongoDB Integration

The application uses Mongoose to connect to MongoDB. Connection handling is managed in `lib/db.ts` with models defined in the `lib/models/` directory.

## Styling

This project uses Tailwind CSS for styling with shadcn/ui components. Global styles are defined in `app/globals.css`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
 
