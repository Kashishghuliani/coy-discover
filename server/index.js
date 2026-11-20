
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seedProfiles } from "./seed.js";

// --------------------------------------------------
// 1. SERVER CONFIGURATION
// --------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the location of our JSON database.
const DB_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Server port. Uses the environment PORT if available.
const PORT = process.env.PORT || 3001;

// Create the Express application.
const app = express();

// Middleware to automatically parse incoming JSON requests.
app.use(express.json());


// --------------------------------------------------
// 2. JSON DATABASE MANAGEMENT
// --------------------------------------------------

// Create a fresh database using our mock profiles.
// Swipes and matches start empty.
const freshDb = () => ({
  profiles: seedProfiles(),
  swipes: [],
  matches: []
});

// Save database changes to the JSON file.
//
// We first write to a temporary file and then rename it.
// This reduces the risk of leaving a partially written database if the server is interrupted during a write.
function save(db) {
  fs.mkdirSync(DB_DIR, { recursive: true });

  const tempFile = DB_FILE + ".tmp";

  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf8");

  fs.renameSync(tempFile, DB_FILE);
}

// Read the database from the JSON file.
//
// If the file does not exist, create a fresh database containing all the seeded profiles.
function load() {
  if (!fs.existsSync(DB_FILE)) {
    save(freshDb());
  }

  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}


// --------------------------------------------------
// 3. PROFILE PRIVACY
// --------------------------------------------------

// This function controls which profile fields can be sent to the frontend.
//
// IMPORTANT:
// likedMe is intentionally excluded because the frontend must never know who has already liked the current user.
// This information is used only by the backend to decide whether a mutual match should be created.
function publicProfile(profile) {
  const {
    id,
    name,
    age,
    photo,
    bio,
    place,
    interests
  } = profile;

  return {
    id,
    name,
    age,
    photo,
    bio,
    place,
    interests
  };
}


// --------------------------------------------------
// 4. GET /api/feed
// --------------------------------------------------

// Return profiles that the current user has not swiped on.
// Previously liked or passed profiles are excluded so the same profile does not appear again after refreshing.
app.get("/api/feed", (req, res) => {
  try {
    const db = load();

    // Collect IDs of all profiles already swiped on.
    const alreadySwiped = new Set(
      db.swipes.map((swipe) => swipe.profileId)
    );

    // Filter out profiles that have already been viewed.
    const availableProfiles = db.profiles
      .filter((profile) => !alreadySwiped.has(profile.id))
      .map(publicProfile);

    // Return only safe public profile information.
    res.json({
      profiles: availableProfiles
    });

  } catch (error) {
    console.error("Error loading feed:", error);

    res.status(500).json({
      error: "Unable to load profiles."
    });
  }
});


// --------------------------------------------------
// 5. POST /api/swipe
// --------------------------------------------------

// Record whether the current user likes or passes a profile.
//
// A match is created ONLY when:
// 1. The current user likes the profile.
// 2. That profile has already liked the current user.
//
// Passing a profile never creates a match.
app.post("/api/swipe", (req, res) => {
  try {
    const { profileId, action } = req.body || {};

    // Validate the profile ID.
    if (!Number.isInteger(profileId)) {
      return res.status(400).json({
        error: "A valid profileId is required."
      });
    }

    // Only allow like or pass actions.
    if (!["like", "pass"].includes(action)) {
      return res.status(400).json({
        error: "Action must be 'like' or 'pass'."
      });
    }

    const db = load();

    // Find the profile the user wants to swipe on.
    const profile = db.profiles.find(
      (item) => item.id === profileId
    );

    // Return 404 if the profile does not exist.
    if (!profile) {
      return res.status(404).json({
        error: "Profile not found."
      });
    }

    // Prevent multiple swipes on the same profile.
    const alreadySwiped = db.swipes.some(
      (swipe) => swipe.profileId === profileId
    );

    if (alreadySwiped) {
      return res.json({
        match: false,
        alreadySwiped: true
      });
    }

    // Record the time when the swipe happened.
    const timestamp = new Date().toISOString();

    // Save the user's swipe in the database.
    db.swipes.push({
      profileId,
      action,
      at: timestamp
    });

    // Check for a mutual like.
    // likedMe is available only on the backend.
    const isMatch =
      action === "like" && profile.likedMe === true;

    // Save a match only when both users have liked each other.
    if (isMatch) {
      db.matches.push({
        profileId,
        at: timestamp
      });
    }

    // Persist the updated swipes and matches.
    save(db);

    // Send the result to the frontend.
    // Profile details are returned only when a match occurs.
    res.json({
      match: isMatch,
      profile: isMatch ? publicProfile(profile) : null
    });

  } catch (error) {
    console.error("Error recording swipe:", error);

    res.status(500).json({
      error: "Unable to record swipe."
    });
  }
});


// --------------------------------------------------
// 6. GET /api/matches
// --------------------------------------------------

// Return only mutual matches.
//
// Profiles are retrieved using the IDs stored in the matches array. The latest matches appear first.
app.get("/api/matches", (req, res) => {
  try {
    const db = load();

    const matches = db.matches
      .map((match) => {
        const profile = db.profiles.find(
          (item) => item.id === match.profileId
        );

        // Ignore invalid match records.
        if (!profile) return null;

        return {
          ...publicProfile(profile),
          matchedAt: match.at
        };
      })
      .filter(Boolean)

      // Sort matches by date, newest first.
      .sort((a, b) =>
        b.matchedAt.localeCompare(a.matchedAt)
      );

    res.json({
      matches
    });

  } catch (error) {
    console.error("Error loading matches:", error);

    res.status(500).json({
      error: "Unable to load matches."
    });
  }
});


// --------------------------------------------------
// 7. POST /api/reset
// --------------------------------------------------

// Demo/testing endpoint.
//
// Removes all previous swipes and matches and restores the original mock profiles.
// Useful when you want to test the application again from the beginning.
app.post("/api/reset", (req, res) => {
  try {
    save(freshDb());

    res.json({
      ok: true,
      message: "Database reset successfully."
    });

  } catch (error) {
    console.error("Error resetting database:", error);

    res.status(500).json({
      error: "Unable to reset database."
    });
  }
});


// --------------------------------------------------
// 8. START THE SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Coy API running at http://localhost:${PORT}`);
});
