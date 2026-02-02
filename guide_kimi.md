# Landing Page Generation Guide for AI Agents (Kimi)

This guide explains how to batch-generate landing pages using Kimi CLI.

## Overview

Each landing page folder contains a `prompt.md` file with design specifications. The AI agent should use Kimi to read this prompt and generate the landing page files:

- `index.html`
- `styles.css`
- `script.js`

## Prerequisites

- Kimi CLI installed (`kimi` command available)
- Access to the landing page project directory
- Git configured for committing changes

## Step-by-Step Instructions

### 1. Read the Task List

First, read `tasks.md` to see all pending landing pages and their design styles.

```bash
cd /path/to/project
cat tasks.md
```

### 2. Generate Each Landing Page

For each landing page folder (e.g., `3-landing-page`, `4-landing-page`, etc.):

1. Move into the landing page folder
2. Start Kimi
3. Run `/yolo` to skip approvals
4. Instruct Kimi to read `prompt.md` and create `index.html`, `styles.css`, `script.js`
5. When done, type `exit` to quit Kimi (required after each landing page)

**Example pattern:**

```bash
cd /path/to/project/{N}-landing-page
kimi
```

Inside Kimi, enable skip-approval:

```
/yolo
```

Then run a single instruction like:

```
Read the prompt.md file in the current directory and create a ONE-PAGE landing page following the design specifications. Create these files: index.html, styles.css, script.js. Ensure the landing page is fully responsive, with animations appropriate to the design style described in prompt.md. Do not add external dependencies except Google Fonts.
```

Quit Kimi after finishing:

```
exit
```

### 3. Commit After Each Landing Page

After Kimi finishes generating files for that landing page, commit immediately before moving to the next one:

```bash
cd /path/to/project
git add {N}-landing-page/
git commit -m "feat: Add landing page {N} - {DESIGN_STYLE} style"
```

> [!NOTE]
> `{DESIGN_STYLE}` should match the style described in that landing page's `prompt.md` (or the style label used in `tasks.md`).

## Important Rules

| Rule | Description |
|------|-------------|
| **One Kimi run per landing page** | Each landing page must be completed in one continuous Kimi session (enter folder → `kimi` → `/yolo` → generate → `exit`). |
| **Commit immediately** | Commit right after each landing page is generated, before starting the next one. |
| **Always use `/yolo`** | Run `/yolo` right after opening Kimi to skip approval prompts. |
| **Reference the `prompt.md`** | Always instruct Kimi to read `prompt.md` in the current landing page folder. |
| **Exit after each landing page** | Always type `exit` to quit Kimi once a landing page is completed. |

## Constraints

- ✅ ONE-PAGE design only
- ✅ Fully responsive
- ✅ Animations appropriate to the design style
- ✅ No external dependencies except Google Fonts

---

## Example Workflow

### Landing page 14

```bash
cd /path/to/project/14-landing-page
kimi
```

Inside Kimi:

```
/yolo
Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified in prompt.md. Make it responsive with appropriate animations. No external dependencies except Google Fonts.
exit
```

Back to terminal:

```bash
cd /path/to/project
git add 14-landing-page/
git commit -m "feat: Add landing page 14 - Neobrutalist style"
```

### Landing page 15

```bash
cd /path/to/project/15-landing-page
kimi
```

Inside Kimi:

```
/yolo
Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified in prompt.md. Make it responsive with appropriate animations. No external dependencies except Google Fonts.
exit
```

Commit:

```bash
cd /path/to/project
git add 15-landing-page/
git commit -m "feat: Add landing page 15 - Editorial style"
```

---

## Batch Execution Template

1. Read `tasks.md` to get the list of pending landing pages

2. For each pending landing page:
   - `cd /path/to/project/{N}-landing-page`
   - `kimi`
   - `/yolo`
   - Instruct Kimi to read `prompt.md` and generate `index.html`, `styles.css`, `script.js` (ONE-PAGE, responsive, correct style, appropriate animations, Google Fonts only)
   - `exit`
   - `cd /path/to/project`
   - `git add {N}-landing-page/`
   - `git commit -m "feat: Add landing page {N} - {DESIGN_STYLE} style"`

3. Repeat until all tasks are completed

---

## Notes

> [!TIP]
> Landing pages should be self-contained and run locally without additional setup.

> [!IMPORTANT]
> Update `tasks.md` status after completing each landing page (optional).

> [!CAUTION]
> Keep commits clean: do not include unrelated changes.