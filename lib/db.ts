import Database from 'better-sqlite3';
import path from 'path';

const DATA_DIR = process.env.DATA_PATH || path.join(process.cwd());
const DB_PATH = path.join(DATA_DIR, 'rival.db');

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
      verified INTEGER DEFAULT 0,
      referral_code TEXT UNIQUE,
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
      download_count INTEGER DEFAULT 0,
      hashtags TEXT,
      flagged INTEGER DEFAULT 0,
      moderated INTEGER DEFAULT 0,
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

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      video_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, video_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (video_id) REFERENCES videos(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrer_id INTEGER NOT NULL,
      referred_id INTEGER NOT NULL,
      points_awarded INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (referrer_id) REFERENCES users(id),
      FOREIGN KEY (referred_id) REFERENCES users(id)
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

    CREATE TABLE IF NOT EXISTS feed_games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      category TEXT,
      fun_fact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (video_id) REFERENCES videos(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(follower_id, following_id),
      FOREIGN KEY (follower_id) REFERENCES users(id),
      FOREIGN KEY (following_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(video_id, user_id),
      FOREIGN KEY (video_id) REFERENCES videos(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      blocker_id INTEGER NOT NULL,
      blocked_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(blocker_id, blocked_id),
      FOREIGN KEY (blocker_id) REFERENCES users(id),
      FOREIGN KEY (blocked_id) REFERENCES users(id)
    );
  `);

  // Run migrations for existing databases
  runMigrations(database);
}

function runMigrations(database: Database.Database) {
  // Add new columns to existing tables if they don't exist
  const migrations = [
    "ALTER TABLE users ADD COLUMN verified INTEGER DEFAULT 0",
    "ALTER TABLE users ADD COLUMN referral_code TEXT",
    "ALTER TABLE videos ADD COLUMN download_count INTEGER DEFAULT 0",
    "ALTER TABLE videos ADD COLUMN hashtags TEXT",
    "ALTER TABLE videos ADD COLUMN flagged INTEGER DEFAULT 0",
    "ALTER TABLE videos ADD COLUMN moderated INTEGER DEFAULT 0",
  ];

  for (const migration of migrations) {
    try {
      database.exec(migration);
    } catch {
      // Column already exists — ignore
    }
  }
}

// ---- Helpers ----
export function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ---- Users ----
export function createUser(username: string, email: string, passwordHash: string, referralCode?: string) {
  const database = getDb();
  // Generate unique referral code
  let code = generateReferralCode();
  // Retry if collision
  for (let i = 0; i < 10; i++) {
    const existing = database.prepare('SELECT id FROM users WHERE referral_code = ?').get(code);
    if (!existing) break;
    code = generateReferralCode();
  }

  if (referralCode) {
    // Find referrer
    const referrer = database.prepare('SELECT * FROM users WHERE referral_code = ?').get(referralCode) as User | undefined;
    if (referrer) {
      const stmt = database.prepare(
        'INSERT INTO users (username, email, password_hash, referral_code) VALUES (?, ?, ?, ?)'
      );
      const result = stmt.run(username, email, passwordHash, code);
      const newUserId = result.lastInsertRowid as number;
      // Award +5 points to both
      addPoints(referrer.id, 5);
      addPoints(newUserId, 5);
      // Record referral
      database.prepare(
        'INSERT INTO referrals (referrer_id, referred_id, points_awarded) VALUES (?, ?, ?)'
      ).run(referrer.id, newUserId, 5);
      // Notify referrer
      createNotification(referrer.id, 'video_like', `${username} joined Rival using your referral link! You both earned +5 points.`);
      return result;
    }
  }

  const stmt = database.prepare(
    'INSERT INTO users (username, email, password_hash, referral_code) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(username, email, passwordHash, code);
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

export function getUserByReferralCode(code: string) {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE referral_code = ?').get(code) as User | undefined;
}

export function setUserVerified(userId: number, verified: boolean) {
  const database = getDb();
  database.prepare('UPDATE users SET verified = ? WHERE id = ?').run(verified ? 1 : 0, userId);
}

export function addPoints(userId: number, points: number) {
  const database = getDb();
  database.prepare('UPDATE users SET total_points = total_points + ? WHERE id = ?').run(points, userId);
  const weekStart = getWeekStart();
  database.prepare(`
    INSERT INTO weekly_points (user_id, week_start, points) VALUES (?, ?, ?)
    ON CONFLICT(user_id, week_start) DO UPDATE SET points = points + ?
  `).run(userId, weekStart, points, points);
}

export function getReferralStats(userId: number) {
  const database = getDb();
  const referrals = database.prepare(`
    SELECT r.*, u.username as referred_username
    FROM referrals r
    JOIN users u ON r.referred_id = u.id
    WHERE r.referrer_id = ?
    ORDER BY r.created_at DESC
  `).all(userId) as ReferralWithUser[];
  const totalPoints = referrals.reduce((sum, r) => sum + r.points_awarded, 0);
  return { referrals, totalPoints, count: referrals.length };
}

// ---- Videos ----
export function getVideos(limit = 20, offset = 0) {
  const database = getDb();
  return database.prepare(`
    SELECT v.*, u.username, u.avatar_url, u.verified
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.flagged = 0
    ORDER BY v.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as VideoWithUser[];
}

export function getVideosByHashtag(tag: string, limit = 20, offset = 0) {
  const database = getDb();
  return database.prepare(`
    SELECT v.*, u.username, u.avatar_url, u.verified
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.flagged = 0 AND (v.hashtags LIKE ? OR v.description LIKE ?)
    ORDER BY v.created_at DESC
    LIMIT ? OFFSET ?
  `).all(`%#${tag}%`, `%#${tag}%`, limit, offset) as VideoWithUser[];
}

export function getVideoById(id: number) {
  const database = getDb();
  return database.prepare(`
    SELECT v.*, u.username, u.avatar_url, u.verified
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.id = ?
  `).get(id) as VideoWithUser | undefined;
}

export function getUserVideos(userId: number) {
  const database = getDb();
  return database.prepare(`
    SELECT * FROM videos WHERE user_id = ? ORDER BY created_at DESC
  `).all(userId) as VideoWithUser[];
}

export function createVideo(userId: number, title: string, description: string, fileUrl: string, thumbnailUrl: string, hashtags?: string) {
  const database = getDb();
  return database.prepare(
    'INSERT INTO videos (user_id, title, description, file_url, thumbnail_url, hashtags) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(userId, title, description, fileUrl, thumbnailUrl, hashtags || null);
}

export function createVideoFlagged(userId: number, title: string, description: string, fileUrl: string, thumbnailUrl: string, hashtags?: string) {
  const database = getDb();
  return database.prepare(
    'INSERT INTO videos (user_id, title, description, file_url, thumbnail_url, hashtags, flagged) VALUES (?, ?, ?, ?, ?, ?, 1)'
  ).run(userId, title, description, fileUrl, thumbnailUrl, hashtags || null);
}

export function approveVideo(videoId: number) {
  const database = getDb();
  database.prepare('UPDATE videos SET flagged = 0, moderated = 1 WHERE id = ?').run(videoId);
}

export function rejectVideo(videoId: number) {
  const database = getDb();
  database.prepare('UPDATE videos SET moderated = 1 WHERE id = ?').run(videoId);
}

export function getFlaggedVideos() {
  const database = getDb();
  return database.prepare(`
    SELECT v.*, u.username
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.flagged = 1 AND v.moderated = 0
    ORDER BY v.created_at DESC
  `).all() as VideoWithUser[];
}

export function incrementDownloads(videoId: number) {
  const database = getDb();
  database.prepare('UPDATE videos SET download_count = download_count + 1 WHERE id = ?').run(videoId);
}

export function likeVideo(videoId: number, userId: number) {
  const database = getDb();
  try {
    database.prepare('INSERT INTO video_likes (video_id, user_id) VALUES (?, ?)').run(videoId, userId);
    database.prepare('UPDATE videos SET likes = likes + 1 WHERE id = ?').run(videoId);
    // Notify video owner
    const video = database.prepare('SELECT user_id, title FROM videos WHERE id = ?').get(videoId) as { user_id: number; title: string } | undefined;
    if (video && video.user_id !== userId) {
      const liker = database.prepare('SELECT username FROM users WHERE id = ?').get(userId) as { username: string } | undefined;
      if (liker) {
        createNotification(video.user_id, 'video_like', `${liker.username} liked your video "${video.title}"`);
      }
    }
    return { liked: true };
  } catch {
    database.prepare('DELETE FROM video_likes WHERE video_id = ? AND user_id = ?').run(videoId, userId);
    database.prepare('UPDATE videos SET likes = likes - 1 WHERE id = ?').run(videoId);
    return { liked: false };
  }
}

// ---- Bookmarks ----
export function toggleBookmark(videoId: number, userId: number) {
  const database = getDb();
  const existing = database.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND video_id = ?').get(userId, videoId);
  if (existing) {
    database.prepare('DELETE FROM bookmarks WHERE user_id = ? AND video_id = ?').run(userId, videoId);
    return { bookmarked: false };
  } else {
    database.prepare('INSERT INTO bookmarks (user_id, video_id) VALUES (?, ?)').run(userId, videoId);
    return { bookmarked: true };
  }
}

export function getUserBookmarks(userId: number) {
  const database = getDb();
  return database.prepare(`
    SELECT v.*, u.username, u.avatar_url, u.verified
    FROM bookmarks b
    JOIN videos v ON b.video_id = v.id
    JOIN users u ON v.user_id = u.id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `).all(userId) as VideoWithUser[];
}

export function isBookmarked(videoId: number, userId: number): boolean {
  const database = getDb();
  const row = database.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND video_id = ?').get(userId, videoId);
  return !!row;
}

// ---- Notifications ----
export function createNotification(userId: number, type: string, message: string) {
  const database = getDb();
  try {
    database.prepare(
      'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)'
    ).run(userId, type, message);
  } catch {
    // Silently fail — notifications are non-critical
  }
}

export function getUserNotifications(userId: number) {
  const database = getDb();
  return database.prepare(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
  ).all(userId) as Notification[];
}

export function getUnreadNotificationCount(userId: number): number {
  const database = getDb();
  const row = database.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0').get(userId) as { count: number };
  return row.count;
}

export function markNotificationRead(notificationId: number, userId: number) {
  const database = getDb();
  database.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(notificationId, userId);
}

export function markAllNotificationsRead(userId: number) {
  const database = getDb();
  database.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(userId);
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

export function getDailyStats(userId: number) {
  const database = getDb();
  const today = new Date().toISOString().split('T')[0];
  return database.prepare('SELECT * FROM daily_stats WHERE user_id = ? AND date = ?').get(userId, today) as DailyStat | undefined;
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
    // Notify entry owner
    const entry = database.prepare('SELECT user_id, competition_type FROM competition_entries WHERE id = ?').get(entryId) as { user_id: number; competition_type: string } | undefined;
    if (entry && entry.user_id !== userId) {
      const voter = database.prepare('SELECT username FROM users WHERE id = ?').get(userId) as { username: string } | undefined;
      if (voter) {
        createNotification(entry.user_id, 'competition_vote', `${voter.username} voted for your ${entry.competition_type} competition entry!`);
      }
    }
    return { voted: true };
  } catch {
    return { voted: false, error: 'Already voted' };
  }
}

export function getWeeklyCompetitionWins(userId: number) {
  const database = getDb();
  const weekStart = getWeekStart();
  // Count competition entries from this week where the user had the most votes
  return database.prepare(`
    SELECT COUNT(*) as wins FROM competition_entries
    WHERE user_id = ? AND date >= ? AND votes > 0
  `).get(userId, weekStart) as { wins: number };
}

// ---- Leaderboard ----
export function getWeeklyLeaderboard() {
  const database = getDb();
  const weekStart = getWeekStart();
  return database.prepare(`
    SELECT u.id, u.username, u.avatar_url, u.verified, COALESCE(wp.points, 0) as weekly_points
    FROM users u
    LEFT JOIN weekly_points wp ON u.id = wp.user_id AND wp.week_start = ?
    WHERE wp.points > 0
    ORDER BY weekly_points DESC
    LIMIT 50
  `).all(weekStart) as LeaderboardEntry[];
}

export function getUserWeeklyRank(userId: number): number {
  const database = getDb();
  const weekStart = getWeekStart();
  const rows = database.prepare(`
    SELECT user_id FROM weekly_points
    WHERE week_start = ?
    ORDER BY points DESC
  `).all(weekStart) as { user_id: number }[];
  const idx = rows.findIndex(r => r.user_id === userId);
  return idx === -1 ? 0 : idx + 1;
}

export function getUserWeeklyPoints(userId: number): number {
  const database = getDb();
  const weekStart = getWeekStart();
  const row = database.prepare('SELECT points FROM weekly_points WHERE user_id = ? AND week_start = ?').get(userId, weekStart) as { points: number } | undefined;
  return row?.points ?? 0;
}

export function awardVerifiedBadgesToTopThree() {
  const database = getDb();
  const leaderboard = getWeeklyLeaderboard();
  const top3 = leaderboard.slice(0, 3);
  for (const entry of top3) {
    setUserVerified(entry.id, true);
    createNotification(entry.id, 'competition_win', `Congratulations! You finished in the top 3 on the weekly leaderboard and earned the Verified badge!`);
  }
}

// ---- Feeds ----
export function getForYouFeed(userId: number | null, limit = 20): VideoWithUser[] {
  const database = getDb();
  if (userId) {
    return database.prepare(`
      SELECT v.*, u.username, u.avatar_url, u.verified,
        (
          CASE WHEN EXISTS(SELECT 1 FROM follows WHERE follower_id = ? AND following_id = v.user_id) THEN 50 ELSE 0 END +
          CASE WHEN v.created_at > datetime('now', '-24 hours') THEN 30 ELSE 0 END +
          CASE WHEN v.created_at > datetime('now', '-48 hours') THEN 10 ELSE 0 END +
          (v.likes * 2) + (v.views / 10)
        ) as score
      FROM videos v
      JOIN users u ON v.user_id = u.id
      WHERE v.flagged = 0
        AND v.user_id NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ?)
        AND v.user_id NOT IN (SELECT blocker_id FROM blocks WHERE blocked_id = ?)
      ORDER BY score DESC, RANDOM()
      LIMIT ?
    `).all(userId, userId, userId, limit) as VideoWithUser[];
  }
  return getTrendingFeed(limit);
}

export function getFollowingFeed(userId: number, limit = 20): VideoWithUser[] {
  const database = getDb();
  return database.prepare(`
    SELECT v.*, u.username, u.avatar_url, u.verified
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.flagged = 0
      AND v.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)
    ORDER BY v.created_at DESC
    LIMIT ?
  `).all(userId, limit) as VideoWithUser[];
}

export function getTrendingFeed(limit = 20): VideoWithUser[] {
  const database = getDb();
  return database.prepare(`
    SELECT v.*, u.username, u.avatar_url, u.verified
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.flagged = 0
      AND v.created_at > datetime('now', '-48 hours')
    ORDER BY (v.likes * 3 + v.views) DESC
    LIMIT ?
  `).all(limit) as VideoWithUser[];
}

// ---- Reports & Blocks ----
export function createReport(videoId: number, userId: number, reason: string) {
  const database = getDb();
  try {
    database.prepare('INSERT INTO reports (video_id, user_id, reason) VALUES (?, ?, ?)').run(videoId, userId, reason);
    return { reported: true };
  } catch {
    return { reported: false, error: 'Already reported' };
  }
}

export function blockUser(blockerId: number, blockedId: number) {
  const database = getDb();
  const existing = database.prepare('SELECT id FROM blocks WHERE blocker_id = ? AND blocked_id = ?').get(blockerId, blockedId);
  if (existing) {
    database.prepare('DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?').run(blockerId, blockedId);
    return { blocked: false };
  }
  database.prepare('INSERT INTO blocks (blocker_id, blocked_id) VALUES (?, ?)').run(blockerId, blockedId);
  return { blocked: true };
}

export function getReports() {
  const database = getDb();
  return database.prepare(`
    SELECT r.*, v.title, u.username as reporter
    FROM reports r
    JOIN videos v ON r.video_id = v.id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT 100
  `).all();
}

// ---- Views ----
export function incrementViews(videoId: number) {
  const database = getDb();
  database.prepare('UPDATE videos SET views = views + 1 WHERE id = ?').run(videoId);
}

// ---- Comments ----
export function createComment(videoId: number, userId: number, content: string) {
  const database = getDb();
  database.prepare('INSERT INTO comments (video_id, user_id, content) VALUES (?, ?, ?)').run(videoId, userId, content);
}

export function getVideoComments(videoId: number, limit = 50): CommentWithUser[] {
  const database = getDb();
  return database.prepare(`
    SELECT c.*, u.username, u.avatar_url, u.verified
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.video_id = ?
    ORDER BY c.created_at DESC
    LIMIT ?
  `).all(videoId, limit) as CommentWithUser[];
}

// ---- Follows ----
export function toggleFollow(followerId: number, followingId: number): { following: boolean } {
  const database = getDb();
  const existing = database.prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?').get(followerId, followingId);
  if (existing) {
    database.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?').run(followerId, followingId);
    return { following: false };
  } else {
    database.prepare('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)').run(followerId, followingId);
    return { following: true };
  }
}

export function isFollowing(followerId: number, followingId: number): boolean {
  const database = getDb();
  return !!database.prepare('SELECT id FROM follows WHERE follower_id = ? AND following_id = ?').get(followerId, followingId);
}

export function getFollowerCount(userId: number): number {
  const database = getDb();
  return (database.prepare('SELECT COUNT(*) as c FROM follows WHERE following_id = ?').get(userId) as { c: number }).c;
}

export function getFollowingCount(userId: number): number {
  const database = getDb();
  return (database.prepare('SELECT COUNT(*) as c FROM follows WHERE follower_id = ?').get(userId) as { c: number }).c;
}

export function getUserProfileByUsername(username: string): UserProfile | undefined {
  const database = getDb();
  const user = database.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
  if (!user) return undefined;
  const followerCount = getFollowerCount(user.id);
  const followingCount = getFollowingCount(user.id);
  const videoCount = (database.prepare('SELECT COUNT(*) as c FROM videos WHERE user_id = ? AND flagged = 0').get(user.id) as { c: number }).c;
  return { ...user, follower_count: followerCount, following_count: followingCount, video_count: videoCount };
}

// ---- Search ----
export function searchVideos(query: string, limit = 20): VideoWithUser[] {
  const database = getDb();
  const q = `%${query}%`;
  return database.prepare(`
    SELECT v.*, u.username, u.avatar_url, u.verified
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.flagged = 0 AND (v.title LIKE ? OR v.description LIKE ? OR v.hashtags LIKE ?)
    ORDER BY v.likes DESC
    LIMIT ?
  `).all(q, q, q, limit) as VideoWithUser[];
}

export function searchUsers(query: string, limit = 10): User[] {
  const database = getDb();
  return database.prepare('SELECT * FROM users WHERE username LIKE ? LIMIT ?').all(`%${query}%`, limit) as User[];
}

// ---- Feed Games ----
export function createFeedGame(question: string, options: string[], correctIndex: number, category: string, funFact: string) {
  const database = getDb();
  database.prepare(
    'INSERT INTO feed_games (question, options, correct_index, category, fun_fact) VALUES (?, ?, ?, ?, ?)'
  ).run(question, JSON.stringify(options), correctIndex, category, funFact);
}

export function getFeedGames(limit = 20): FeedGame[] {
  const database = getDb();
  return database.prepare('SELECT * FROM feed_games ORDER BY RANDOM() LIMIT ?').all(limit) as FeedGame[];
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

// ---- Types ----
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  total_points: number;
  verified: number;
  referral_code: string | null;
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
  download_count: number;
  hashtags: string | null;
  flagged: number;
  moderated: number;
  created_at: string;
  username: string;
  avatar_url: string | null;
  verified: number;
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
  verified: number;
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

export interface FeedGame {
  id: number;
  question: string;
  options: string; // JSON array
  correct_index: number;
  category: string | null;
  fun_fact: string | null;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  message: string;
  read: number;
  created_at: string;
}

export interface CommentWithUser {
  id: number;
  video_id: number;
  user_id: number;
  content: string;
  created_at: string;
  username: string;
  avatar_url: string | null;
  verified: number;
}

export interface UserProfile extends User {
  follower_count: number;
  following_count: number;
  video_count: number;
}

export interface ReferralWithUser {
  id: number;
  referrer_id: number;
  referred_id: number;
  points_awarded: number;
  created_at: string;
  referred_username: string;
}
