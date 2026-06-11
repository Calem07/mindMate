# ER Diagram

```mermaid
erDiagram
  USERS ||--o{ MOODS : logs
  USERS ||--o{ JOURNAL_ENTRIES : writes
  USERS ||--o{ CHAT_SESSIONS : starts
  CHAT_SESSIONS ||--o{ CHAT_MESSAGES : contains
  USERS ||--o{ EMOTION_LOGS : has
  USERS ||--o{ RECOMMENDATIONS : receives
  USERS ||--o{ CRISIS_EVENTS : triggers
  USERS ||--o{ PASSWORD_RESET_TOKENS : owns
  USERS ||--o{ MODERATION_AUDIT_LOGS : admin
```
