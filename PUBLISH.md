# Publish steps (one-time)

The local repo is complete and committed. Publishing needs the GitHub repo
to exist first — an SSH key can push but cannot create a repository, and no
GitHub API login is available on this VM.

1. On github.com (signed in as **asra-hoss**): create a new **public**
   repository named exactly `instamber-tools`. Do **not** add a README,
   .gitignore or licence (the repo here already has them).
2. Then, on this VM:

```bash
cd ~/workspace/instamber-tools
git push -u origin main
git push origin main:gh-pages   # this account publishes Pages from the gh-pages branch
```

3. Verify (Pages can take a minute or two):

```bash
curl -sI https://asra-hoss.github.io/instamber-tools/lookup.js   | head -1
curl -sI https://asra-hoss.github.io/instamber-tools/data.json   | head -1
curl -sI https://asra-hoss.github.io/instamber-tools/areacode.js | head -1
curl -sI https://asra-hoss.github.io/instamber-tools/          | head -1
```

All four should return `HTTP/2 200`. The remote is already configured
(`ssh://git@ssh.github.com:443/asra-hoss/instamber-tools.git`) with the
SSH-over-proxy command this VM needs.
