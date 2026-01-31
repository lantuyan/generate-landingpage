# Landing Page Generation Guide for AI Agents

This guide explains how to batch-generate landing pages using Claude Code CLI.

## Overview

Each landing page folder contains a `prompt.md` file with design specifications. The AI agent should invoke Claude Code to read this prompt and generate the landing page files (`index.html`, `styles.css`, `script.js`).

## Prerequisites

- Claude Code CLI installed (`claude` command available)
- Access to the landing page project directory

## Step-by-Step Instructions

### 1. Read the Task List

First, read `tasks.md` to see all pending landing pages and their design styles.

### 2. Generate Each Landing Page

For each landing page folder (e.g., `3-landing-page`, `4-landing-page`, etc.), execute Claude Code with the following pattern:

```bash
cd /path/to/project/{N}-landing-page
claude --dangerously-skip-permissions -p "Read the prompt.md file in the current directory and create a landing page following the design specifications. Create these files: index.html, styles.css, script.js. Ensure the landing page is a ONE-PAGE design, fully responsive, with animations appropriate to the {DESIGN_STYLE} style."
```

### 3. Commit After Each Landing Page

After Claude Code completes generating a landing page, immediately commit the changes:

```bash
git add {N}-landing-page/
git commit -m "feat: Add landing page {N} - {DESIGN_STYLE} style"
```

## Important Rules

1. **One Claude call per landing page** - Each landing page should be completed in a single Claude Code invocation
2. **Commit immediately** - After each landing page is done, commit before moving to the next one
3. **Use `--dangerously-skip-permissions`** - This flag allows Claude Code to create and modify files without prompting for permission
4. **Reference the prompt.md** - Always instruct Claude Code to read the prompt.md file in the landing page folder

## Example Workflow

```bash
# Landing page 14
cd /path/to/project/14-landing-page
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the Neobrutalist design style. Make it responsive with appropriate animations."

# Commit
cd /path/to/project
git add 14-landing-page/
git commit -m "feat: Add landing page 14 - Neobrutalist style"

# Landing page 15
cd /path/to/project/15-landing-page
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the Editorial design style. Make it responsive with appropriate animations."

# Commit
cd /path/to/project
git add 15-landing-page/
git commit -m "feat: Add landing page 15 - Editorial style"

# Continue for remaining landing pages...
```

## Batch Execution Template

For AI agents, here's the recommended approach:

1. Read `tasks.md` to get the list of pending landing pages
2. For each pending landing page from the specified range:
   - Execute: `claude --dangerously-skip-permissions -p "Read prompt.md in this directory and create index.html, styles.css, script.js for a ONE-PAGE landing page following the design style specified. Ensure responsive design and appropriate animations."`
   - Working directory should be the landing page folder (e.g., `14-landing-page`)
   - Wait for completion
   - Commit with descriptive message
3. Move to the next landing page

## Notes

- All Claude Code processes can run in parallel if desired, but committing should be done sequentially
- Each landing page should be self-contained with no external dependencies except Google Fonts
- The design style is specified in the `prompt.md` file of each folder
- Update `tasks.md` status after completing each landing page (optional)
