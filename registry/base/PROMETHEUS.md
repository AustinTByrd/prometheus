# Prometheus

Version: 0.2.0

This project copied Prometheus at the version above. Registry source files start with `// @prometheus 0.2.0`.

Before editing one of those files, compare its stamp with the registry changelog:

```bash
npx shadcn@latest view AustinTByrd/prometheus/changelog
```

If the registry version is newer, re-add the items that changed:

```bash
npx shadcn@latest add AustinTByrd/prometheus/<item>
```

Copying source does not push later fixes into this project.
