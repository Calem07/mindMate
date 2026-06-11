/** @typedef {'STUDENT' | 'ADMIN'} Role */
/** @typedef {'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'STRESSED' | 'SAD'} MoodOption */
/** @typedef {'STUDENT' | 'MINDMATE'} Sender */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {Role} role
 */

/**
 * @typedef {Object} CompanionResponse
 * @property {string} petType
 * @property {string} petName
 * @property {string} species
 * @property {string} personality
 * @property {number} petXp
 * @property {number} level
 * @property {string} evolutionStage
 * @property {string} mood
 * @property {string} avatar
 * @property {string[]} unlockedThemes
 * @property {string[]} unlockedAccessories
 * @property {string} insight
 * @property {boolean} hasSelectedCompanion
 */

/**
 * @typedef {Object} GamificationProgress
 * @property {number} xp
 * @property {number} level
 * @property {number} currentStreak
 * @property {number} longestStreak
 * @property {string} gardenTheme
 * @property {string} levelTitle
 */

/**
 * @typedef {Object} DailyCheckin
 * @property {number} id
 * @property {string} mood
 * @property {number} energyLevel
 * @property {number} stressLevel
 * @property {number} sleepHours
 * @property {number} sleepQuality
 * @property {number} socialInteraction
 * @property {string} moodTrigger
 * @property {number} wellnessScore
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ChatResponse
 * @property {string} reply
 * @property {string} emotion
 * @property {number} confidenceScore
 * @property {boolean} crisisDetected
 */

export {};
