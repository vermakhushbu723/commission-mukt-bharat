# Commission-Mukt Bharat

A citizens' movement landing page — Vite + React 19 static SPA, served by pm2/`serve` behind nginx on an AWS EC2 instance, with HTTPS via Let's Encrypt and CI/CD via GitHub Actions.

Production: **https://commissionmuktbharat.com**

---

## Stack

- **React 19** + the **React Compiler** (`babel-plugin-react-compiler`)
- **Vite 8** (`@vitejs/plugin-react`) — builds to a static `dist/`
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- Google Fonts: Bowlby One, Oswald, Inter, Noto Serif Devanagari

## Local development

```bash
npm install
npm run dev      # vite dev server
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # eslint
```

---

# Production Deployment

This section documents the full end-to-end production setup. Anyone with the repo and access to the AWS account + GoDaddy DNS panel should be able to reproduce this from scratch.

## Architecture

```
                          Internet
                              │
                              │ :443 (TLS) / :80
                              ▼
            ┌────────────────────────────────────┐
            │           AWS EC2 (Ubuntu)         │
            │   Elastic IP: 13.201.154.95        │
            │                                    │
            │   nginx (reverse proxy)            │
            │     │                              │
            │     │ proxy_pass                   │
            │     ▼                              │
            │   pm2 → serve -s dist -l 3000      │
            │     (127.0.0.1:3000, SPA fallback) │
            │                                    │
            │   Filesystem:                      │
            │     /home/ubuntu/commission-mukt-  │
            │       bharat/                      │
            │       ├── dist/        (build)     │
            │       ├── deploy.sh                │
            │       ├── ecosystem.config.cjs     │
            │       └── .env.deploy   (gitignored, 600)
            └────────────────────────────────────┘
                              ▲
                              │ ssh (port 22, key auth)
                              │
            ┌────────────────────────────────────┐
            │       GitHub Actions runner        │
            │  Triggered on push to main         │
            │  Uses EC2_SSH_KEY secret           │
            │  Runs `./deploy.sh` on the box     │
            └────────────────────────────────────┘
                              ▲
                              │ git push origin main
                              │
                          Developer
```

DNS: `commissionmuktbharat.com` (apex) and `www.commissionmuktbharat.com` both resolve to `13.201.154.95` (Elastic IP), with the `www` CNAME aliasing the apex A record at the GoDaddy registrar.

---

## 1. AWS infrastructure

### EC2 instance

| Setting       | Value                                  |
|---------------|----------------------------------------|
| Region        | ap-south-1 (Mumbai)                    |
| AMI           | Ubuntu 25.x (resolute)                 |
| Instance type | t3.small (sufficient for a static SPA) |
| Storage       | 20 GB gp3                              |
| Key pair      | downloaded `.pem` for initial SSH      |

### Elastic IP

Auto-assigned EC2 public IPs change on stop/start, which would silently break DNS. We allocated an Elastic IP and associated it with the instance so the public IP is stable.

- EC2 console → **Network & Security → Elastic IPs → Allocate Elastic IP address**.
- Select the new IP → **Actions → Associate Elastic IP address** → choose the instance.
- Current Elastic IP: **`13.201.154.95`** (tagged `cmb-ip`).

### Security group

Inbound rules:

| Type  | Port | Source     | Purpose                                  |
|-------|------|------------|------------------------------------------|
| SSH   | 22   | 0.0.0.0/0  | Allows GitHub-hosted runners + admin SSH |
| HTTP  | 80   | 0.0.0.0/0  | nginx public listener (redirects to 443) |
| HTTPS | 443  | 0.0.0.0/0  | nginx TLS listener                       |

> **On port 22 being open to the world:** GitHub-hosted runner IP ranges are too wide to allowlist sensibly. Safety is provided by SSH key-only authentication (Ubuntu's default — password auth is disabled in `/etc/ssh/sshd_config`) and a dedicated, server-specific deploy key.

---

## 2. Server bootstrap

Performed once after the instance came up. All commands run as the `ubuntu` user.

### System packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl
```

### Node.js 20+ (we used Node 24 from NodeSource)

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v
```

Versions in production:
- node `v24.16.0`
- npm `11.13.0`

### pm2 and `serve`, globally

```bash
sudo npm install -g pm2 serve
pm2 -v && serve --version
```

Versions in production:
- pm2 `7.0.1`
- serve `14.2.6`
- `serve` binary location: `/usr/bin/serve` (referenced by `ecosystem.config.cjs`)

---

## 3. Application deployment

### Clone the repo

The repo (`techblueera/commission-mukt-bharat`) is private. The first clone was done manually with a Personal Access Token; subsequent pulls happen through `deploy.sh` using the same token from `.env.deploy`.

```bash
cd /home/ubuntu
git clone https://github.com/techblueera/commission-mukt-bharat.git
cd commission-mukt-bharat
```

### `.env.deploy` (credentials, never committed)

`deploy.sh` reads its GitHub credentials from `/home/ubuntu/commission-mukt-bharat/.env.deploy`. The file is gitignored and lives at mode `600`.

```bash
cat > /home/ubuntu/commission-mukt-bharat/.env.deploy <<'EOF'
GITHUB_USERNAME=<your-github-username>
GITHUB_TOKEN=<fine-grained-PAT>
REPO_OWNER=techblueera
REPO_NAME=commission-mukt-bharat
EOF
chmod 600 /home/ubuntu/commission-mukt-bharat/.env.deploy
```

**Generating the PAT**

- GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new token.
- **Resource owner:** `techblueera` (not your personal account — the token won't see org repos otherwise).
- **Repository access:** select only `commission-mukt-bharat`.
- **Repository permissions:** `Contents: Read-only`. Nothing else.
- Org admin must approve the token if the org requires it.

### `deploy.sh`

Idempotent deploy script. Run it as many times as you want.

```bash
chmod +x deploy.sh
./deploy.sh
```

What it does, in order:

1. Sources `.env.deploy`.
2. Verifies `git`, `node`, `npm`, `pm2`, `serve` are installed.
3. If the directory is not a git repo, clones it. Otherwise:
   - Rewrites `origin` to a credentialed URL,
   - `git fetch --depth 1 origin $BRANCH`,
   - `git reset --hard origin/$BRANCH` and `git clean -fd` (server is treated as a deploy target, not a workspace — any uncommitted server-side edits are discarded),
   - Strips credentials back out of `.git/config`.
4. Checks the SHA-256 of `package-lock.json` against a cached hash; runs `npm install --no-audit --no-fund` only if the lockfile changed.
5. `npm run build` — produces `dist/`.
6. Sanity-checks `dist/index.html` exists.
7. If pm2 is already running the app, `pm2 reload ecosystem.config.cjs --update-env` (graceful, zero-downtime). Otherwise `pm2 start ecosystem.config.cjs`.
8. `pm2 save` to persist the process list.

> **Why `npm install` and not `npm ci`:** the lockfile in this repo drifts slightly because of native binding packages (`@emnapi/*` pulled in by `@rolldown/plugin-babel` and Tailwind v4). `npm ci` refuses to install when lockfile and `package.json` disagree; `npm install` rewrites the lockfile on disk and continues. The tradeoff is slightly less reproducibility for less friction. To switch back to `npm ci` later, regenerate the lockfile locally on a Linux box and commit it.

### `ecosystem.config.cjs`

pm2 process manifest. Two things to know:

```js
script: '/usr/bin/serve',
interpreter: 'none',
```

- **Absolute path + `interpreter: 'none'`:** if `script` is just `'serve'`, pm2 resolves it to its own internal `pm2 serve` module (`Serve.js`), which then misinterprets `-l` as a hostname and crashes with `getaddrinfo ENOTFOUND -l`. The absolute path bypasses that.
- `-s dist` enables single-page-app fallback so deep links like `/articles` still resolve to `index.html`.

### pm2 reboot persistence

Configured once so pm2 (and the app) come back automatically after a reboot:

```bash
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
# pm2 prints a sudo command — copy and run it.
```

This creates `/etc/systemd/system/pm2-ubuntu.service` and `systemctl enable`s it. The `pm2 save` step writes `~/.pm2/dump.pm2`, which `pm2 resurrect` reads on boot.

Verify with:
```bash
systemctl status pm2-ubuntu --no-pager
```

---

## 4. DNS (GoDaddy)

The domain `commissionmuktbharat.com` is registered at GoDaddy. We only edit one record; everything else is left alone.

| Type  | Name           | Value                       | TTL  | Notes                           |
|-------|----------------|-----------------------------|------|---------------------------------|
| A     | `@`            | `13.201.154.95`             | 30 m | Edited from default "Parked"    |
| CNAME | `www`          | `commissionmuktbharat.com.` | 1 h  | Already in place; follows `@`   |
| NS    | `@`            | `ns33/ns34.domaincontrol.com.` | — | Locked by GoDaddy               |
| CNAME | `_domainconnect` | `_domainconnect.gd.…`     | 1 h  | GoDaddy plumbing; leave alone   |
| SOA, TXT _dmarc | …                                 |      | Leave alone                     |

Verify propagation from any machine:
```bash
dig +short commissionmuktbharat.com
dig +short www.commissionmuktbharat.com
# Both should return 13.201.154.95
```

---

## 5. nginx reverse proxy

nginx listens on 80/443 and proxies to pm2 on `127.0.0.1:3000`. The app is never directly exposed to the internet.

Config at `/etc/nginx/sites-available/commissionmuktbharat`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name commissionmuktbharat.com www.commissionmuktbharat.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~* \.(js|css|svg|png|jpg|jpeg|gif|ico|woff2?)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

(The `listen 443 ssl` blocks and HTTP→HTTPS redirect are inserted automatically by certbot — see next section.)

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/commissionmuktbharat /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. HTTPS via Let's Encrypt

Issued and auto-renewed with certbot's nginx plugin.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d commissionmuktbharat.com -d www.commissionmuktbharat.com
```

Interactive prompts:
1. Email address (for expiry warnings).
2. Agree to TOS (`Y`).
3. Share email with EFF (your choice).

What certbot did:
- Solved the HTTP-01 challenge over port 80.
- Saved cert to `/etc/letsencrypt/live/commissionmuktbharat.com/`.
- Edited `/etc/nginx/sites-enabled/commissionmuktbharat` to add `listen 443 ssl`, the cert paths, and a 301 redirect from HTTP to HTTPS.
- Installed a systemd timer (`certbot.timer`) that runs twice a day to renew when the cert is within 30 days of expiry.

Verify renewal works without actually renewing:
```bash
sudo certbot renew --dry-run
systemctl status certbot.timer --no-pager
```

---

## 7. CI/CD — GitHub Actions auto-deploy

Every push to `main` triggers a workflow that SSHes into EC2 and runs `./deploy.sh`. No manual steps required.

### Dedicated SSH deploy key

Generated *on the server*, never on a developer laptop:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/cmb_deploy_key -C "github-actions-deploy" -N ""
cat ~/.ssh/cmb_deploy_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

- **Public half** stays in `/home/ubuntu/.ssh/authorized_keys` on the EC2 box.
- **Private half** is copied into a GitHub repo secret named `EC2_SSH_KEY`, then **deleted from the server** so it only lives in GitHub:
  ```bash
  cat ~/.ssh/cmb_deploy_key   # copy entire output
  # paste into GitHub → Settings → Secrets and variables → Actions → New repository secret
  rm ~/.ssh/cmb_deploy_key
  ```

The keypair is **dedicated to deploys** — not reused from the AWS console `.pem` or any developer's personal key. If it leaks, we rotate it independently without touching anything else.

### GitHub repo secrets

| Name          | Value                                          |
|---------------|------------------------------------------------|
| `EC2_HOST`    | `13.201.154.95`                                |
| `EC2_USER`    | `ubuntu`                                       |
| `EC2_SSH_KEY` | Full contents of `cmb_deploy_key` (incl. headers) |

Set at: **GitHub → repo → Settings → Secrets and variables → Actions**.

### Workflow

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: production-deploy
  cancel-in-progress: false

jobs:
  deploy:
    name: SSH and run deploy.sh
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          port: 22
          command_timeout: 8m
          script_stop: true
          script: |
            set -euo pipefail
            cd /home/ubuntu/commission-mukt-bharat
            ./deploy.sh
```

- `concurrency.group` serializes deploys so two pushes can't race.
- `script_stop: true` aborts the SSH session on the first failed command.
- `workflow_dispatch` adds a "Run workflow" button on the Actions tab for manual triggers.

---

# Operations

## Push to deploy

```bash
git push origin main
```

Watch progress at: **GitHub → repo → Actions tab**. The "Deploy via SSH" step streams `deploy.sh` output live.

## Manual deploy (no push)

SSH in and run the script directly. Useful for debugging or re-running after a transient failure.

```bash
ssh -i <your-aws.pem> ubuntu@13.201.154.95
cd ~/commission-mukt-bharat
./deploy.sh
```

You can also re-run a failed Actions run from the **Actions tab → failed run → "Re-run jobs"**.

## Rollback

`git revert` is the simplest path — it produces a new commit, which auto-deploys:

```bash
git revert <bad-commit-sha>
git push origin main
```

For something faster (when minutes matter), you can pin to an earlier commit on the server bypassing the script:

```bash
ssh ubuntu@13.201.154.95
cd ~/commission-mukt-bharat
git fetch origin
git reset --hard <good-sha>
npm install --no-audit --no-fund
npm run build
pm2 reload ecosystem.config.cjs
```

…but the revert-and-push route is preferable because it keeps git and production in sync.

## Logs

```bash
pm2 logs commission-mukt-bharat              # tail
pm2 logs commission-mukt-bharat --lines 200  # last 200 lines
pm2 logs commission-mukt-bharat --nostream   # dump without tailing

sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

sudo journalctl -u nginx --no-pager -n 100
sudo journalctl -u pm2-ubuntu --no-pager -n 100
```

## Restart pieces

```bash
pm2 restart commission-mukt-bharat   # hard restart (small downtime blip)
pm2 reload commission-mukt-bharat    # graceful, zero-downtime
sudo systemctl reload nginx          # graceful nginx reload
sudo systemctl restart nginx         # hard nginx restart
```

## Certificate

```bash
sudo certbot certificates                     # show current cert + expiry
sudo certbot renew --dry-run                  # simulate renewal
sudo certbot renew                            # force a renewal attempt
```

---

# Files in this repo that are deployment-related

| Path                            | Committed? | Purpose                                                                  |
|---------------------------------|------------|--------------------------------------------------------------------------|
| `deploy.sh`                     | yes        | Pull, install, build, restart — idempotent, safe to re-run.              |
| `ecosystem.config.cjs`          | yes        | pm2 process manifest. References `/usr/bin/serve`.                       |
| `.github/workflows/deploy.yml`  | yes        | GitHub Actions workflow that SSHes in and runs `deploy.sh`.              |
| `.env.deploy`                   | **no**     | Lives only on the server, mode 600. Holds `GITHUB_TOKEN`.                |
| `.deploy-lock-hash`             | **no**     | Server-side cache so `npm install` skips when `package-lock.json` unchanged. |

`.gitignore` excludes `.env.deploy`, `.deploy-lock-hash`, `node_modules/`, and `dist/`.

---

# Troubleshooting playbook

Issues we hit during the initial setup, with the resolution that worked.

### `git clone` returned `Repository not found`
The PAT or `REPO_OWNER` is wrong. Confirm:
- `REPO_OWNER=techblueera` (the org, **not** the token holder's personal username).
- The fine-grained PAT's **Resource owner** was set to `techblueera` when generated.
- Org admin approved the token (look for "Pending approval" in your token list).

### `npm ci` fails with `package.json and package-lock.json are not in sync`
The lockfile drifts because of native binding packages. Two options:
- **Quick:** use `npm install` (already what `deploy.sh` does now).
- **Proper:** regenerate the lockfile locally, commit, push:
  ```bash
  rm -rf node_modules
  npm install
  git add package-lock.json && git commit -m "refresh lockfile"
  git push
  ```

### pm2 process keeps restarting with `getaddrinfo ENOTFOUND -l`
pm2 interpreted `script: 'serve'` as its built-in `pm2 serve` (which uses positional args, not flags). Fix is already baked into `ecosystem.config.cjs` — use the absolute path `/usr/bin/serve` and `interpreter: 'none'`.

### Public IP reaches port 3000 but not port 80 (or vice versa)
Check the **AWS security group** inbound rules first. Then `sudo systemctl status nginx` and `pm2 status` to confirm both processes are running. `curl -I http://127.0.0.1:3000` proves the app is alive locally; if that works, the issue is between nginx and the outside world.

### DNS doesn't propagate
Be patient — TTL is 30 min, so up to that. Verify with `dig +short commissionmuktbharat.com` from outside the server. If it returns the old "Parked" value, the GoDaddy save didn't take — re-edit.

### GitHub Actions: `Permission denied (publickey)`
The `EC2_SSH_KEY` secret is missing, malformed, or doesn't match the public key in `~/.ssh/authorized_keys` on the box. Re-paste the entire private key into the secret (including `-----BEGIN`/`-----END` lines and the trailing newline). Sanity-check by SSHing from your own machine with the same private key.

### Build succeeded but the site shows a blank page
Open browser devtools → Console. Usually a missing asset path or a `tailwind.config` issue. Check `pm2 logs` — `serve` logs every request, so 404s on `/assets/...` will jump out.

---

# Quick-reference cheat sheet

```bash
# SSH in
ssh -i <your-aws.pem> ubuntu@13.201.154.95

# Deploy (push or manual)
git push origin main                                 # from laptop
ssh ubuntu@13.201.154.95 'cd ~/commission-mukt-bharat && ./deploy.sh'   # manual

# Status
pm2 status
sudo systemctl status nginx pm2-ubuntu certbot.timer --no-pager

# Tail logs
pm2 logs commission-mukt-bharat
sudo tail -f /var/log/nginx/access.log

# Reload everything
pm2 reload commission-mukt-bharat
sudo systemctl reload nginx
```
