# GitHub Pages Setup — My Address, My City

**Author:** Aicardo Barco Fajardo · abarcof@gmail.com

The project includes a GitHub Actions workflow to build and deploy to GitHub Pages.

## 1. Enable GitHub Pages

1. Go to your repo: **https://github.com/abarcof/my-address-my-city**
2. **Settings** → **Pages** (left sidebar)
3. Under **Build and deployment**:
   - **Source:** Select **GitHub Actions**

## 2. Trigger the Workflow

The workflow runs automatically when you push to `main`. You can also run it manually:

1. Go to **Actions**
2. Select **Deploy to GitHub Pages**
3. Click **Run workflow**

## 3. Wait for the Build

The workflow will:

- Checkout the code
- Run `npm ci` (installs dependencies from lockfile — no 403 issues on GitHub’s runners)
- Run `npm run build` with the correct base path
- Deploy the `dist/` folder to GitHub Pages

## 4. Your Live URL

After the first successful deployment:

**https://abarcof.github.io/my-address-my-city/**

## Troubleshooting

### If `npm ci` fails with 403

GitHub’s hosted runners (`ubuntu-latest`) normally have full npm access. A 403 usually means:

- **Organization policy:** Some orgs restrict external package access. Ask your org admin.
- **Rate limiting:** Rare; try re-running the workflow.
- **Wrong workflow:** Ensure you’re using `.github/workflows/deploy-pages.yml`, not another workflow or environment.

### If Pages shows a 404

- Confirm **Source** is set to **GitHub Actions** (not “Deploy from a branch”).
- Wait a few minutes after the workflow finishes.
- Ensure the workflow completed without errors in the **Actions** tab.

### API / Bright Data

GitHub Pages serves only static files. The `api/official-live-context.ts` (Bright Data) endpoint will **not** work on GitHub Pages. For that feature, use **Vercel** (see `docs/post-github-steps.md`).
