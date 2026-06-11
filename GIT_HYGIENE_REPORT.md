# Git Hygiene Report

Date: 2026-06-11

## Summary

Audited the MindMate repository for files that should not be version controlled and updated the root `.gitignore` with a broader policy for frontend, backend, Java/Maven, browser-test, editor, log, cache, and scratch artifacts.

No source code was removed.

## Findings

### IDE Files

Found tracked IDE/editor metadata:

- `.vscode/settings.json`
- `.project`
- `backend/.classpath`
- `backend/.project`
- `backend/.settings/`

Action: removed from Git tracking with `git rm --cached`; local files remain on disk.

### Maven Extracted Binaries

Found tracked bundled Maven runtime under:

- `maven_extracted/apache-maven-3.9.6/`

This directory contains binaries, jars, licenses, scripts, and local tool runtime files. It should not be committed as application source.

Action: removed from Git tracking with `git rm --cached`; local files remain on disk.

### Temporary Files and Scratch Folders

Found tracked scratch extraction and test files under:

- `brain/f4761fed-061e-46c2-853f-47cee352c325/scratch/`

Action: removed from Git tracking with `git rm --cached`; local files remain on disk.

### Build Outputs

Build output rules were added for:

- `dist/`
- `dist-ssr/`
- `target/`
- `out/`
- `build/`
- `coverage/`

No tracked build-output matches remain after cleanup.

### Logs

Log ignore rules were added for:

- `logs/`
- `*.log`
- npm/yarn/pnpm/lerna debug logs
- JVM crash logs such as `hs_err_pid*`

No tracked log matches remain after cleanup.

### Local Caches

Cache ignore rules were added for:

- `.cache/`
- `.tmp/`
- `tmp/`
- `temp/`
- `.m2/`
- Playwright reports and test results
- `.codex/`

### Local Probe Outputs

Found tracked local verification output:

- `integration-probe-results.json`
- `route-verify-results.json`

Action: removed from Git tracking with `git rm --cached`; local files remain on disk.

## `.gitignore` Updates

The root `.gitignore` now covers:

- Secrets and local environment files
- Node dependencies
- Build outputs
- Logs and runtime output
- IDE/editor metadata
- OS metadata
- Maven/Java local artifacts
- Playwright/browser automation artifacts
- Probe result JSON files
- Scratch and generated extraction workspaces
- Codex/local tool state

`.env.example` remains explicitly allowed so required environment documentation can stay version controlled.

## Files Removed From Git Tracking

Removed from the index only:

- IDE metadata: `.vscode/`, `.project`, `backend/.classpath`, `backend/.project`, `backend/.settings/`
- Generated classpath: `backend/classpath.txt`
- Scratch workspace: `brain/**/scratch/`
- Maven extracted runtime: `maven_extracted/`
- Local probe outputs: `integration-probe-results.json`, `route-verify-results.json`

The files still exist locally, but future commits will not include them.

## Verification

Ran a tracked-file scan for IDE metadata, build outputs, `node_modules`, `target`, `dist`, `maven_extracted`, scratch folders, logs, and probe result JSON files.

Result: no tracked hygiene-pattern matches remain.

## Recommendation

Before the next release commit, review staged deletions to confirm they are all generated/local artifacts. Keep application source, migrations, docs, package manifests, Docker files, and deployment config tracked.
