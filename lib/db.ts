import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'rival.db');

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  const database = db;
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      total_points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      file_url TEXT,
      thumbnail_url TEXT,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS video_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(video_id, user_id),
      FOREIGN KEY (video_id) REFERENCES videos(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS game_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_type TEXT NOT NULL,
      score REAL NOT NULL,
      won INTEGER DEFAULT 0,
      points_earned INTEGER DEFAULT 0,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS daily_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      games_played TEXT DEFAULT '[]',
      different_games_count INTEGER DEFAULT 0,
      bonus_earned INTEGER DEFAULT 0,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS competition_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      competition_type TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      votes INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS competition_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(entry_id, user_id),
      FOREIGN KEY (entry_id) REFERENCES competition_entries(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS weekly_points (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      week_start TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, week_start),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      read_time INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// ---- Users ----
export function createUser(username: string, email: string, passwordHash: string) {
  const database = getDb();
  const stmt = database.prepare(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
  );
  return stmt.run(username, email, passwordHash);
}

export function getUserByEmail(email: string) {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
}

export function getUserById(id: number) {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
}

export function getUserByUsername(username: string) {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
}

export function addPoints(userId: number, points: number) {
  const database = getDb();
  database.prepare('UPDATE users SET total_points = total_points + ? WHERE id = ?').run(points, userId);
  const today = new Date().toISOString().split('T')[0];
  const weekStart = getWeekStart();
  database.prepare(`
    INSERT INTO weekly_points (user_id, week_start, points) VALUES (?, ?, ?)
    ON CONFLICT(user_id, week_start) DO UPDATE SET points = points + ?
  `).run(userId, weekStart, points, points);
}

// ---- Videos ----
export function getVideos(limit = 20, offset = 0) {
  const database = getDb();
  return database.prepare(`
    SELECT v.*, u.username, u.avatar_url
    FROM videos v
    JOIN users u ON v.user_id = u.id
    ORDER BY v.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as VideoWithUser[];
}

export function createVideo(userId: number, title: string, description: string, fileUrl: string, thumbnailUrl: string) {
  const database = getDb();
  return database.prepare(
    'INSERT INTO videos (user_id, title, description, file_url, thumbnail_url) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, title, description, fileUrl, thumbnailUrl);
}

export function likeVideo(videoId: number, userId: number) {
  const database = getDb();
  try {
    database.prepare('INSERT INTO video_likes (video_id, user_id) VALUES (?, ?)').run(videoId, userId);
    database.prepare('UPDATE videos SET likes = likes + 1 WHERE id = ?').run(videoId);
    return { liked: true };
  } catch {
    database.prepare('DELETE FROM video_likes WHERE video_id = ? AND user_id = ?').run(videoId, userId);
    database.prepare('UPDATE videos SET likes = likes - 1 WHERE id = ?').run(videoId);
    return { liked: false };
  }
}

// ---- Game Results ----
export function recordGameResult(userId: number, gameType: string, score: number, won: boolean, pointsEarned: number) {
  const database = getDb();
  const today = new Date().toISOString().split('T')[0];

  database.prepare(
    'INSERT INTO game_results (user_id, game_type, score, won, points_earned) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, gameType, score, won ? 1 : 0, pointsEarned);

  if (won && pointsEarned > 0) {
    addPoints(userId, pointsEarned);
  }

  // Update daily stats
  const existing = database.prepare('SELECT * FROM daily_stats WHERE user_id = ? AND date = ?').get(userId, today) as DailyStat | undefined;
  if (existing) {
    const games = JSON.parse(existing.games_played) as string[];
    if (!games.includes(gameType)) {
      games.push(gameType);
      const differentCount = games.length;
      let bonus = existing.bonus_earned;
      if (differentCount >= 8 && existing.bonus_earned === 0) {
        bonus = 2;
        addPoints(userId, 2);
      }
      database.prepare(
        'UPDATE daily_stats SET games_played = ?, different_games_count = ?, bonus_earned = ? WHERE user_id = ? AND date = ?'
      ).run(JSON.stringify(games), differentCount, bonus, userId, today);
    }
  } else {
    database.prepare(
      'INSERT INTO daily_stats (user_id, date, games_played, different_games_count, bonus_earned) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, today, JSON.stringify([gameType]), 1, 0);
  }
}

// ---- Competitions ----
export function getCompetitionEntries(type: string, date: string) {
  const database = getDb();
  return database.prepare(`
    SELECT ce.*, u.username, u.avatar_url
    FROM competition_entries ce
    JOIN users u ON ce.user_id = u.id
    WHERE ce.competition_type = ? AND ce.date = ?
    ORDER BY ce.votes DESC
  `).all(type, date) as CompetitionEntryWithUser[];
}

export function createCompetitionEntry(type: string, userId: number, content: string, date: string) {
  const database = getDb();
  return database.prepare(
    'INSERT INTO competition_entries (competition_type, user_id, content, date) VALUES (?, ?, ?, ?)'
  ).run(type, userId, content, date);
}

export function voteOnEntry(entryId: number, userId: number) {
  const database = getDb();
  try {
    database.prepare('INSERT INTO competition_votes (entry_id, user_id) VALUES (?, ?)').run(entryId, userId);
    database.prepare('UPDATE competition_entries SET votes = votes + 1 WHERE id = ?').run(entryId);
    return { voted: true };
  } catch {
    return { voted: false, error: 'Already voted' };
  }
}

// ---- Leaderboard ----
export function getWeeklyLeaderboard() {
  const database = getDb();
  const weekStart = getWeekStart();
  return database.prepare(`
    SELECT u.id, u.username, u.avatar_url, COALESCE(wp.points, 0) as weekly_points
    FROM users u
    LEFT JOIN weekly_points wp ON u.id = wp.user_id AND wp.week_start = ?
    WHERE wp.points > 0
    ORDER BY weekly_points DESC
    LIMIT 50
  `).all(weekStart) as LeaderboardEntry[];
}

// ---- Blog ----
export function getBlogPosts() {
  const database = getDb();
  return database.prepare('SELECT id, slug, title, excerpt, author, read_time, created_at FROM blog_posts ORDER BY created_at DESC').all() as BlogPostSummary[];
}

export function getBlogPost(slug: string) {
  const database = getDb();
  return database.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug) as BlogPost | undefined;
}

export function upsertBlogPost(slug: string, title: string, excerpt: string, content: string, author: string, readTime: number) {
  const database = getDb();
  database.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, content, author, read_time) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET title=?, excerpt=?, content=?, author=?, read_time=?
  `).run(slug, title, excerpt, content, author, readTime, title, excerpt, content, author, readTime);
}

// ---- Helpers ----
function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// ---- Types ----
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  total_points: number;
  created_at: string;
}

export interface VideoWithUser {
  id: number;
  user_id: number;
  title: string;
  description: string;
  file_url: string | null;
  thumbnail_url: string | null;
  views: number;
  likes: number;
  created_at: string;
  username: string;
  avatar_url: string | null;
}

export interface DailyStat {
  id: number;
  user_id: number;
  date: string;
  games_played: string;
  different_games_count: number;
  bonus_earned: number;
}

export interface CompetitionEntryWithUser {
  id: number;
  competition_type: string;
  user_id: number;
  content: string;
  votes: number;
  date: string;
  created_at: string;
  username: string;
  avatar_url: string | null;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  avatar_url: string | null;
  weekly_points: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  read_time: number;
  created_at: string;
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  read_time: number;
  created_at: string;
}
