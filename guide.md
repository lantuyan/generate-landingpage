# Landing Page Generation Guide for AI Agents

This guide explains how to batch-generate landing pages using Claude Code CLI with **parallel execution** for optimal performance.

## Overview

Each landing page folder contains a `prompt.md` file with design specifications. The AI agent should invoke Claude Code to read this prompt and generate the landing page files (`index.html`, `styles.css`, `script.js`).

## Prerequisites

- Claude Code CLI installed (`claude` command available)
- Access to the landing page project directory

## Parallel Execution Strategy

To maximize efficiency, run **10 Claude Code agents in parallel** at a time. Each agent handles one landing page independently.

## Step-by-Step Instructions

### 1. Read the Task List

First, read `tasks.md` to see all pending landing pages and their design styles.

### 2. Generate Landing Pages in Parallel (10 at a time)

Launch 10 Claude Code processes simultaneously using background execution:

```bash
PROJECT_DIR="/path/to/project"

# Batch 1: Launch 10 agents in parallel
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/18-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/19-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/20-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/21-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/22-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/23-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/24-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/25-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/26-landing-page &
claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." $PROJECT_DIR/27-landing-page &

# Wait for all background processes to complete
wait
```

### 3. Process Completed Landing Pages

After a landing page is generated, perform these steps:

#### a. Update Root Index (index.html)

Add the new landing page to the `landingPages` array in `index.html`. Find the array and append a new entry:

```javascript
// In index.html, find the landingPages array and add:
{ folder: '{N}-landing-page', name: '{PAGE_NAME}', style: '{DESIGN_STYLE}', desc: '{DESCRIPTION}' },
```

**Example:** For landing page 18 with "Retro Gaming" style:
```javascript
{ folder: '18-landing-page', name: 'Retro Gaming', style: 'Retro Gaming', desc: 'Trang landing page với phong cách game retro cổ điển.' },
```

#### b. Commit the Landing Page

```bash
git add {N}-landing-page/ index.html
git commit -m "feat: Add landing page {N} - {DESIGN_STYLE} style"
```

### 4. Repeat for Next Batch

Continue with the next batch of 10 landing pages until all are complete.

## Automated Batch Script

For fully automated execution, use this script:

```bash
#!/bin/bash
PROJECT_DIR="/path/to/project"
BATCH_SIZE=10

# Define landing pages to generate (adjust range as needed)
START=18
END=50

# Process in batches of 10
for ((batch_start=START; batch_start<=END; batch_start+=BATCH_SIZE)); do
    batch_end=$((batch_start + BATCH_SIZE - 1))
    if [ $batch_end -gt $END ]; then
        batch_end=$END
    fi

    echo "=== Processing batch: $batch_start to $batch_end ==="

    # Launch parallel agents for this batch
    pids=()
    for ((i=batch_start; i<=batch_end; i++)); do
        FOLDER="${i}-landing-page"
        if [ -d "$PROJECT_DIR/$FOLDER" ] && [ -f "$PROJECT_DIR/$FOLDER/prompt.md" ]; then
            echo "Starting agent for $FOLDER..."
            claude --dangerously-skip-permissions -p "Read prompt.md and create a ONE-PAGE landing page with index.html, styles.css, script.js. Follow the design style specified. Make it responsive with appropriate animations." "$PROJECT_DIR/$FOLDER" &
            pids+=($!)
        fi
    done

    # Wait for all agents in this batch to complete
    echo "Waiting for batch to complete..."
    for pid in "${pids[@]}"; do
        wait $pid
    done

    echo "Batch complete! Committing changes..."

    # Commit all completed landing pages in this batch
    for ((i=batch_start; i<=batch_end; i++)); do
        FOLDER="${i}-landing-page"
        if [ -d "$PROJECT_DIR/$FOLDER" ] && [ -f "$PROJECT_DIR/$FOLDER/index.html" ]; then
            # Extract style from prompt.md for commit message
            STYLE=$(grep -m1 "Style:" "$PROJECT_DIR/$FOLDER/prompt.md" | sed 's/.*Style: *//' || echo "Custom")
            git add "$PROJECT_DIR/$FOLDER/"
            git commit -m "feat: Add landing page $i - $STYLE style"
        fi
    done
done

echo "=== All batches complete! ==="
```

## Important Rules

1. **10 agents in parallel** - Never exceed 10 concurrent Claude Code processes to avoid resource exhaustion
2. **Wait for batch completion** - Always use `wait` to ensure all agents in a batch finish before starting the next
3. **Update index.html** - After each landing page is generated, add it to the root index.html for display
4. **Commit after each landing page** - Include both the landing page folder and updated index.html
5. **Use `--dangerously-skip-permissions`** - This flag allows Claude Code to create and modify files without prompting

## Monitoring Progress

Check the status of background processes:
```bash
# See running Claude processes
ps aux | grep claude

# Check if any agents are still running
jobs -r
```

## Root Index Update Template

When adding a new landing page to `index.html`, add to the `landingPages` array:

```javascript
const landingPages = [
    // ... existing entries ...

    // Add new landing pages here:
    { folder: '14-landing-page', name: 'NeoBlock', style: 'Neobrutalist', desc: 'Thiết kế bold với màu sắc mạnh và hình khối thô.' },
    { folder: '15-landing-page', name: 'Editorial', style: 'Editorial', desc: 'Phong cách tạp chí với typography làm trung tâm.' },
    { folder: '16-landing-page', name: 'Gradient Modern', style: 'Gradient Modern', desc: 'Thiết kế hiện đại với gradient và animations mượt mà.' },
    { folder: '17-landing-page', name: 'Nordic Light', style: 'Scandinavian', desc: 'Phong cách Bắc Âu với tông màu trung tính và ánh sáng tự nhiên.' },
];
```

## Notes

- Each landing page should be self-contained with no external dependencies except Google Fonts
- The design style is specified in the `prompt.md` file of each folder
- Running 10 agents in parallel provides optimal throughput without overloading the system
- If a landing page fails to generate, it can be retried individually
