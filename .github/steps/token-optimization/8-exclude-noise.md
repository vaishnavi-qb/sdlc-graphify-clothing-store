## Step 8: Exclude index noise

_Welcome to **AI SDLC Skills — Token Optimization**._ :wave:

Works with **Cursor**, **Claude Code**, or **GitHub Copilot**.

**Goal:** Stop your AI assistant from reading files that never help with product questions.

**Why it matters:** Folders like `node_modules` and `dist` use tokens but almost never improve answers.

### Course map

8. **Exclude noise** (this step) — real setup
9. **Context rules** — real setup for your assistant
10. **Reading guide** — one doc for models, prompts, and monitoring

### :keyboard: Activity: Add `.aiignore`

1. **Open the repo root** (same level as `package.json`).
   - Expect: you see `ecommerce-backend/` and `ecommerce-frontend/`.

2. **Create `.aiignore`** at the repo root.

3. **Paste this list:**

```gitignore
node_modules/
dist/
build/
coverage/
.git/
*.log
package-lock.json
ecommerce-frontend/dist/
ecommerce-frontend/node_modules/
.env
.env.*
```

4. **Confirm** the file includes `node_modules` and `dist`.
   - Expect: Actions will look for both strings.

5. **(Optional but recommended)** Mirror the same list into your assistant’s own ignore file — each tool reads a **separate** file (same idea as Copilot’s `.copilotignore`):

| Assistant | Ignore file (repo root) |
| --- | --- |
| **Cursor** | `.cursorignore` |
| **Claude Code** | `.claudeignore` |
| **GitHub Copilot** | `.copilotignore` |

Paste the same patterns into whichever file matches the tool you use (or create all three if you switch tools).

6. **Commit and push:**

```bash
git add .aiignore
# optional: also add the tool-specific file(s) you created
# git add .cursorignore .claudeignore .copilotignore
git commit -m "Exclude noise from AI indexing"
git push
```

7. **Wait about 20 seconds** for Step 9 in the Issue comments.

<details>
<summary>Having trouble? 🤷</summary><br/>

- `.aiignore` must be at the **repo root** (Actions grades this file).
- It must include both `node_modules` and `dist`.
- Cursor / Claude / Copilot do **not** share one ignore file — use `.cursorignore`, `.claudeignore`, or `.copilotignore` for the tool you run.
- If Step 9 does not appear, check the **Actions** tab for Step 8.

</details>
