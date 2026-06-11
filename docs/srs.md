# Software Requirements Specification

## Purpose

MindMate supports students with reflective wellness workflows, mood tracking, journaling, recommendations, and bounded AI conversation.

## Functional Requirements

- Users can register, log in, reset passwords in development, and authenticate with JWT.
- Students can log moods, view trends, write and search journals, chat with MindMate, and view recommendations.
- Gemini classifies emotions, summarizes journals, generates key concerns, and powers authenticated chat.
- Crisis phrases create a logged event and show escalation guidance.
- Admins can review users, crisis events, and consent-enabled sensitive content.

## Non-Functional Requirements

- The app must be responsive.
- APIs must validate inputs and protect role-specific routes.
- The system must avoid therapy, diagnosis, treatment, cure, prescription, and medical advice claims.
- Docker Compose must run the full stack locally.
