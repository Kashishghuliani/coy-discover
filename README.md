# Coy · Discover 💘

A swipe-based discovery experience inspired by Tinder and Bumble, built as a standalone application for Coy. Discover profiles, like or pass on people, and find matches when the interest is mutual.

> **Core promise:** You never find out who liked you unless you like them back.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Styling | CSS, responsive design, animations |
| Backend | Node.js, Express.js |
| API | REST API |
| Data Storage | JSON file-based database |

## Getting Started

Requires **Node.js 18+** and npm.

### 1. Clone the repository

```bash
git clone https://github.com/Kashishghuliani/coy-discover.git
cd coy-discover
```

### 2. Install dependencies

Install root dependencies:

```bash
npm install
```

Install client and server dependencies:

```bash
npm run install:all
```

### 3. Start the application

Run the frontend and backend together:

```bash
npm run dev
```

The application will be available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |

### Run individually

Start only the backend:

```bash
npm run start:server
```

Start only the frontend:

```bash
npm run dev --prefix client
```

## Features

- **Profile Discovery:** Browse 36 mock profiles with names, ages, photos, bios, locations, and interests.
- **Swipe Interaction:** Drag cards right to like and left to pass.
- **Desktop Controls:** Use Like and Pass buttons or keyboard arrow keys.
- **Card Animations:** Smooth card movement, rotation, swipe indicators, and transitions.
- **Profile Stack:** Preview the next profile behind the active card.
- **No Repeated Profiles:** Previously swiped profiles are removed from the feed, even after refreshing.
- **Mutual Matching:** A match is created only when both users have liked each other.
- **Matches Page:** View all mutual matches in one place.
- **Match Notification:** A match popup appears when mutual interest is detected.
- **Empty State:** A friendly message appears when all available profiles have been viewed.
- **Demo Reset:** Reset the application to its initial mock data.
- **Persistent Storage:** Swipe history and matches survive page reloads and backend restarts.

## API Endpoints

Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/feed` | Fetch profiles that have not been swiped on |
| POST | `/api/swipe` | Record a like or pass |
| GET | `/api/matches` | Retrieve mutual matches |
| POST | `/api/reset` | Reset demo profiles, swipes, and matches |

### Swipe API

**POST** `/api/swipe`

Request body:

```json
{
  "profileId": 1,
  "action": "like"
}
```

Supported actions:
- `like`
- `pass`

Example match response:

```json
{
  "match": true,
  "profile": {
    "id": 1,
    "name": "Aarav",
    "age": 22,
    "place": "IIT Delhi"
  }
}
```

A match is returned only when the selected profile has already liked the current user.

### Error Handling

- Invalid swipe actions return `400 Bad Request`.
- Unknown profile IDs return `404 Not Found`.
- Repeated swipes are prevented.
- A repeated swipe returns an `alreadySwiped` indicator rather than creating another match.

## How Matching and Privacy Work

The application follows a mutual-like matching approach.

1. The user likes or passes on a profile.
2. The frontend sends the swipe action to the Express backend.
3. The backend checks whether the profile has already liked the user.
4. If both users have liked each other, a match is created.
5. The match is saved and becomes visible on the Matches page.

**Privacy implementation:**

- The `likedMe` property is stored only on the backend.
- The `publicProfile()` function filters out private matching information before returning profile data.
- The frontend never receives a list of one-sided incoming likes.
- There is no API endpoint that reveals who liked the user.

The application currently assumes a single logged-in user, so authentication is not required for this assignment.

## Data Persistence

The application uses a JSON file as its lightweight database.

```text
server/data/db.json
```

It stores:

- Mock profile information
- Swipe history
- Mutual match records

The backend creates the database from `seed.js` when it does not already exist.

This allows the application to retain user interactions across browser refreshes and server restarts.

## Project Structure

```text
coy-discover/
│
├── package.json              # Root scripts and concurrently
├── package-lock.json
├── .gitignore
├── README.md
│
├── server/
│   ├── index.js              # Express server and API routes
│   ├── seed.js               # 36 mock profiles
│   ├── package.json
│   ├── package-lock.json
│   └── data/
│       └── db.json           # Runtime JSON database
│
└── client/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── src/
        ├── App.jsx           # Main application and navigation
        ├── Discover.jsx      # Profile feed and swipe logic
        ├── SwipeCard.jsx     # Draggable profile card
        ├── Matches.jsx       # Mutual matches view
        ├── api.js            # API request helpers
        └── index.css         # Application styling
```

## Demo Guide

To explore the matching functionality:

- Start the application using `npm run dev`.
- Open the Discover tab.
- Swipe right on profiles that have already liked you to generate an instant match.
- Swipe left to pass on a profile.
- Open the Matches tab to view mutual matches.
- Refresh the browser to verify that previously swiped profiles do not reappear.
- Use the reset option on the empty screen to restart the demo.

The seeded profiles include incoming likes for IDs 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, and 34.

## Design Approach

The interface uses a playful, Gen Z-inspired visual style with:

- Bold typography and vibrant gradient backgrounds.
- A mobile-first layout.
- Interactive profile cards with swipe animations.
- Playful copy, expressive buttons, and visual feedback.
- A simple bottom navigation bar for Home, Discover, and Matches.

The Home tab is intentionally a placeholder, while Discover and Matches contain the core assignment functionality.

## Future Improvements

- User authentication and multiple user accounts.
- PostgreSQL or MongoDB integration.
- Real-time chat between matched users.
- Profile editing and image uploads.
- Location-based discovery.
- More advanced profile recommendations.

## Author

**Kashish Ghuliani**

GitHub: [Kashishghuliani](https://github.com/Kashishghuliani)

