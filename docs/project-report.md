# Academic Project Report: MindMate 3.0
## An Advanced Teen Wellness and Personal Growth Ecosystem

---

## 📄 Abstract
Student and teen mental wellness is a critical component of academic success and daily personal growth. **MindMate 3.0** is a comprehensive, gamified wellness platform that combines mental health support, habits building, self-reflection, exam focus intervals, and goal tracking into an engaging client-server application. 

Crucially, the system balances support with strict safety boundaries: it detects severe distress language to override conversation loops with emergency guidelines, restricts admin moderation view via explicit student privacy consent parameters, and implements a non-clinical companion model. The stack consists of a **React/JSX/JavaScript** frontend styled with **Tailwind CSS**, a **Spring Boot/Security/JPA/Java 17** backend running on port **8088**, and a **PostgreSQL** database managed via **Flyway** schema migrations.

---

## 1. Introduction
### 1.1 Problem Statement
Higher education exposes teenagers to intense academic competition, time-management challenges, and exam stress. Traditional support systems are often slow or inaccessible. While digital AI companions offer potential assistance, they frequently lack safety guardrails, make inappropriate clinical diagnoses, or fail to engage students consistently due to a lack of gamified progression.

### 1.2 Purpose and Scope
MindMate 3.0 bridges this gap by offering a secure, engaging wellness companion. It is designed to:
- Monitor daily wellness metrics (mood, energy, stress, sleep, trigger factors).
- Track positive habit completions with visual streaks.
- Support examination periods via Pomodoro focus study blocks and countdown cards.
- Support long-term goal setting and milestones.
- Encourage consistency using XP levels, achievements, and an animated visual Growth Garden.
- Provide high-context AI companions that read recent logs to offer custom guidance.

---

## 2. Technology Stack & Environment
The system operates as a decoupled client-server architecture:

### 2.1 Frontend Stack
- **React (v19.2.6)**: Component-based UI rendering.
- **Vite (v8.0.16)**: Next-generation build tool with proxy configurations.
- **JavaScript (ES6+) / JSX**: Clean, standard script files (TypeScript-free).
- **React Router (v7.16.0)**: SPA client-side routing.
- **Recharts (v3.8.1)**: SVG charts for analytics.
- **Lucide React**: Vector icon sets.
- **Tailwind CSS**: Styling system.

### 2.2 Backend Stack
- **Java 17 / Spring Boot (v3.4.1)**: Core enterprise framework.
- **Spring Security & JJWT**: Stateless JWT-based route protection.
- **Spring Data JPA & Hibernate**: Object-relational mapping.
- **Flyway Migrations**: SQL schema versioning.
- **WebFlux (WebClient)**: Asynchronous AI integration with local fallback.

### 2.3 Database & Deployment
- **PostgreSQL**: Relational database storage.

---

## 3. System Architecture & Feature Map

```mermaid
flowchart TD
  subgraph Client Layer (React Frontend)
    Dashboard["Dashboard & Analytics"]
    CheckIn["Daily Check-In & Triggers"]
    Habits["Habits Streaker"]
    Exams["Exam Pomodoro Timer"]
    Garden["Growth Garden (SVG Tree)"]
    Chat["AI Chat & Crisis Banner"]
  end

  subgraph Service Layer (Spring Boot API)
    JWTFilter["JWT Filter & Auth Service"]
    TeenService["Teen Wellness Service (XP & Streaks)"]
    Engine["Correlation Engine (Conditional Statistics)"]
    Reflect["Reflection Service (AI Summary)"]
    Gemini["Gemini API Adapter (gemini-2.5-flash)"]
  end

  subgraph Data Layer (PostgreSQL)
    DB[("PostgreSQL Database")]
  end

  Dashboard & CheckIn & Habits & Exams & Garden & Chat -- REST API + JWT --> JWTFilter
  JWTFilter --> TeenService & Engine & Reflect
  Reflect & TeenService --> Gemini
  TeenService & Engine & Reflect --> DB
```

---

## 4. Feature Module Details

### 4.1 Daily Wellness Check-In & Mood Trigger Analysis
Users log daily parameters (mood, energy level, stress level, sleep duration, sleep quality, and social interaction metrics) alongside a primary **Mood Trigger** (Exams, Friends, Social Media, Health, Family, Relationships, Academic Pressure, Other). 
- **Wellness Index Calculation**: The backend calculates a unified index (0-100) based on mood score weightings, stress level drop ratios, and sleep consistency.

### 4.2 Habit Tracking System
Enables creating pre-defined or custom daily habits. 
- **Toggle Endpoint**: Users check off habit items for a specific date, which records entries in `habit_logs`, awards +3 XP, and recalculates consistency streaks.

### 4.3 Exam Mode & Pomodoro Focus Timer
Exposes a study session dashboard.
- **Countdown**: Tracks days left for upcoming exam dates.
- **Pomodoro Ring**: Features a 25-minute study focus timer. When finished, it submits logged study minutes to `/api/exams/{id}/study` and awards XP (+1 XP for every 5 focus minutes).

### 4.4 Gratitude Journal
Encourages daily journaling through three positive prompts:
- *What made you happy today?*
- *What are you grateful for?*
- *What achievement are you proud of today?*
Saves reflection details and awards +10 XP.

### 4.5 XP, Streak & Badge Achievements
- **Level Up Progressions**: XP increases levels (`Level = (XP/100) + 1`). Levels map to titles: Explorer, Optimist (Level 5+), Achiever (Level 10+), and Mentor (Level 20+).
- **Trophy cabinet**: Awards badges like *Consistency Master* (10 completed habits), *Sleep Champion* (8+ hours of sleep with high quality), and *7-Day Streak*.
- **Weekly Challenges**: Short-term goals (e.g. log mood for 5 days) offering XP rewards.

### 4.6 Growth Garden 3.0
Visually represents student progress through an inline SVG visual tree. The tree grows from a Seed (Explorer) into a Sprout (Optimist), Sapling (Achiever), and finally a mature Tree (Mentor). Students can toggle between Classic, Cozy Autumn, and Cyber Garden themes once they reach Level 5.

### 4.7 Burnout Detection & Correlation Engine
- **Burnout Warning**: Scans the last 3 check-ins for high stress and sleep deficiency, displaying warning alerts and rest tips.
- **Correlation Engine**: Compares indicators to return insights (e.g., *"You score 12% happier on days with 7.5+ sleep hours compared to shorter nights"*).

### 4.8 Future Me Letters
Students write letters and choose a lock date (1 month, 6 months, 1 year). The contents remain encrypted/redacted until the system date matches the unlock date. Additionally, users can request an **AI Future Me Letter** which synthesizes active goals and recent entries into a motivational prompt.

---

## 5. PostgreSQL Schema Definitions

The database tables are set up via schema migration scripts:

```sql
-- Gamification Progress fields
ALTER TABLE users ADD COLUMN xp integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN level integer NOT NULL DEFAULT 1;
ALTER TABLE users ADD COLUMN current_streak integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN longest_streak integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN last_activity_date date;
ALTER TABLE users ADD COLUMN garden_theme varchar(50) NOT NULL DEFAULT 'CLASSIC';

-- Daily Wellness Log
CREATE TABLE daily_checkins (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood varchar(40) NOT NULL,
  energy_level integer NOT NULL,
  stress_level integer NOT NULL,
  sleep_hours double precision NOT NULL,
  sleep_quality integer NOT NULL,
  social_interaction integer NOT NULL,
  mood_trigger varchar(100),
  wellness_score integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Gratitude Reflections
CREATE TABLE gratitude_journals (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  happy_moment text NOT NULL,
  grateful_for text NOT NULL,
  proud_achievement text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Goal Tracker
CREATE TABLE life_goals (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category varchar(50) NOT NULL,
  title varchar(220) NOT NULL,
  target_date date,
  progress_percent integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Locked Letters Vault
CREATE TABLE future_me_letters (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  unlock_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

---

## 6. Verification and testing
Validation logs confirm code compliance and robust system performance:
- **JPA & Spring compilation**: Success.
- **Unit and Mockito test coverage**: 6 active test cases passed with 0 failures:
  ```bash
  Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
  BUILD SUCCESS
  ```
- **Vite production build asset bundling**: Complete.
