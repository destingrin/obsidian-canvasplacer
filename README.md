# Obsidian Canvas Placer

this plugin automatically places Telegram‑Inbox notes onto a canvas with dynamic sizing, using a modify‑event listener, corrected height calculation, and configurable source‑folder/target‑canvas settings.

## Features

- Automatic placement of new notes from a configured source folder onto a target canvas.
- Dynamic card height based on actual text (media embed placeholders stripped) plus fixed height per media embed.
- User‑configurable source folder and target canvas with autocomplete‑driven pickers.
- Robust event handling (uses vault `modify` event to avoid race conditions).
- Zero‑dependency, works with plain Obsidian.

## Installation (manual)

1. Download the latest release from the **Releases** page and extract `obsidian-canvasplacer.zip`.
2. Place the extracted folder into your vault’s `.obsidian/plugins/` directory:
   ```
   <your vault>/.obsidian/plugins/obsidian-canvasplacer/
   ```
3. In Obsidian, go to **Settings → Community plugins**, enable **Canvas‑Placer**.
4. Configure the plugin:
   - **Target canvas** – click the field to pick an existing `.canvas` file or type a new path.
   - **Source folder** – click the field to pick a folder (e.g., `Telegram-Inbox`) or type a custom path; leave empty to watch the whole vault.

## Important note – Telegram‑Inbox changes required

Canvas‑Placer relies on Telegram‑Inbox producing a markdown note for **every** attachment. And intended to work with this fork https://github.com/destingrin/obsidian-telegram-inbox of obsidian-telegram-inbox or its analogue.
