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

> **Gotcha:** If you have `NPM_CONFIG_REGISTRY` set to a different registry, publishing will fail with `ENEEDAUTH`. Override it for the publish command:
>
> ```bash
> NPM_CONFIG_REGISTRY=https://registry.npmjs.org/ nr change:publish
> ```

## Quick flow

```bash
# 1. Write your code changes (don't commit yet)

# 2. Add changeset (creates .changeset/*.md)
nr change:add

# 3. Commit changeset file together with your code changes
git add -A && git commit -m "feat: description"

# 4. Bump version (updates package.json, CHANGELOG.md, removes .changeset/*.md)
nr change:version

# 5. Commit the version bump
git add -A && git commit -m "chore: new version"

# 6. Publish to npm (also creates a git tag)
nr change:publish

# 7. Push everything including the tag
git push --follow-tags
```
