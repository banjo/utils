# Releases

## Add a changeset

```bash
nr change:add
```

Follow prompts:
- Select bump: patch/minor/major
- Write short summary (why)

Commit the new `.changeset/*.md` file with your code changes.

## Version packages

```bash
nr change:version
```

This updates `package.json` version and changelog output from changesets. Commit these changes.

## Publish

```bash
nr change:publish
```

Publishes to npm and removes consumed changesets.

## Quick flow

```bash
nr change:add
git add -A && git commit -m "<message>"
nr change:version
git add -A && git commit -m "chore: version"
nr change:publish
```
