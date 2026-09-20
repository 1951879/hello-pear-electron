# Pear Voice Chat

Linux-first peer-to-peer voice chat built on Pear, Bare, and Electron.

This workspace currently contains the first implementation milestone: the
official `hello-pear-electron` desktop scaffold with project metadata renamed
for voice chat and a worker lifecycle diagnostic screen.

## Development

Install dependencies:

```sh
npm run install:all
```

The install may require network access to GitHub and npm because the Pear
desktop toolchain includes native and git dependencies.

Start the development app:

```sh
npm start
```

The project currently uses a local development upgrade link. Generate a new
one with `npx pear touch` when replacing it. Do not commit production upgrade
links or signing material to this repository.

## Current architecture

```text
Electron renderer -> preload bridge -> Pear/Bare worker
```

The renderer is intentionally only a diagnostic UI at this stage. The next
milestone is the Linux audio feasibility spike: microphone capture, Opus
encode/decode, bounded framing, and measured latency before adding room
discovery or production transport.

See the workspace plans:

- `../voice_chat_linux_plan.md`
- `../voice_chat_implementation_plan.md`
