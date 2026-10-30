import { Plugin, TFile, Notice, App } from "obsidian";
import type CanvasPlacerSettings from "./src/settings/types";
import CanvasPlacerSettingTab from "./src/settings/setting-tab";
import { DEFAULT_SETTINGS } from "./src/settings/types";

interface CanvasNode {
  id: string;
  type: "file" | "text" | "link" | "group";
  x: number;
  y: number;
  width: number;
  height: number;
  file?: string;
  text?: string;
  url?: string;
  color?: number;
}

interface CanvasEdge {
  id: string;
  fromNode: string;
  toNode: string;
  fromSide?: string;
  toSide?: string;
  color?: number;
  label?: string;
}

interface CanvasData {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

const GAP_X = 60;
const GAP_Y = 60;

const WATCH_FOLDER = "Telegram-Inbox";
const TARGET_CANVAS = "boards/fetchboard.canvas";

export default class CanvasPlacerPlugin extends Plugin {
  settings: CanvasPlacerSettings;

  async onload() {
    console.log("Loading Canvas Placer plugin");

    await this.loadSettings();

    // Add settings tab
    this.addSettingTab(new CanvasPlacerSettingTab(this.app, this));

    // Watch for new files created in the vault
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (!(file instanceof TFile)) return;
        if (file.extension !== "md") return;
        if (!file.path.startsWith(`${WATCH_FOLDER}/`)) return;

        this.addFileToCanvas(file.path);
      })
    );

    // Manual command: add all existing Telegram-Inbox notes to canvas
    this.addCommand({
      id: "add-all-telegram-to-canvas",
      name: "Add all Telegram-Inbox notes to fetchboard.canvas",
      callback: () => this.addAllExistingFiles(),
    });

    new Notice("Canvas Placer plugin loaded");
  }

  onunload() {
    console.log("Unloading Canvas Placer plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
/**
 * Count media embed patterns in text (e.g., ![[filename.jpg]])
 * Uses simple string splitting to avoid regex escaping issues
 */
private countMediaEmbeds(text: string): number {
    // Split by '![[' and subtract 1 to get count
    // Example: "text ![[img1]] more text ![[img2]]" 
    // Split: ["text ", "img1]] more text ", "img2]]"] → length 3 → count 2
    return text.split('![').length - 1;
}

  /**
   * Measure actual text height at fixed width with padding
   */
  private async measureTextHeight(text: string, width: number, padding: number): Promise<number> {
    // Create measurement element
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '-9999px';
    div.style.left = '-9999px';
    div.style.width = `${width}px`;
    div.style.whiteSpace = 'pre-wrap'; // Honor newlines
    div.style.wordWrap = 'break-word';
    div.style.padding = `${padding}px`; // Vertical padding affects height
    
    // Reasonable defaults matching Obsidian note styling
    div.style.fontSize = '16px';
    div.style.lineHeight = '1.5';
    div.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
    
    // Set as plain text (preserves newlines - Telegram is usually plain text)
    div.textContent = text;
    
    // Measure and clean up
    document.body.appendChild(div);
    const height = div.scrollHeight; // Includes padding from div.style.padding
    document.body.removeChild(div);
    
    return height;
  }

  /**
   * Calculate height based on ACTUAL content measurement + media embeds
   */
  async calculateNodeHeight(relativePath: string): Promise<number> {
    if (!this.settings.enabled) {
      return this.settings.defaultHeight;
    }

    try {
      const file = this.app.vault.getAbstractFileByPath(relativePath);
      if (!(file instanceof TFile)) {
        return this.settings.defaultHeight;
      }

      const content = await this.app.vault.read(file);
      
      // MEASURE ACTUAL TEXT HEIGHT at fixed width with padding
      const measuredHeight = await this.measureTextHeight(
        content, 
        this.settings.defaultWidth, 
        this.settings.padding
      );
      
      // COUNT MEDIA EMBEDS and add their estimated height
      const mediaCount = this.countMediaEmbeds(content);
      const mediaHeight = mediaCount * this.settings.mediaEmbedHeight;
      const totalHeight = measuredHeight + mediaHeight;
      
      // Apply min/max constraints
      return Math.min(
        this.settings.maxHeight,
        Math.max(this.settings.minHeight, totalHeight)
      );
    } catch (error) {
      console.error("Canvas Placer: error calculating node height:", error);
      return this.settings.defaultHeight;
    }
  }

  async addFileToCanvas(relativePath: string): Promise<void> {
    try {
      const canvasFile = this.app.vault.getAbstractFileByPath(TARGET_CANVAS);

      let canvas: CanvasData = { nodes: [], edges: [] };
      let targetFile: TFile;

      if (canvasFile instanceof TFile) {
        targetFile = canvasFile;
        const content = await this.app.vault.read(canvasFile);
        if (content.trim()) {
          canvas = JSON.parse(content) as CanvasData;
        }
      } else {
        targetFile = (await this.app.vault.create(
          TARGET_CANVAS,
          JSON.stringify({ nodes: [], edges: [] }, null, 2)
        )) as TFile;
      }

      // Skip if this file is already on the canvas
      const alreadyExists = canvas.nodes.some(
        (n) => n.type === "file" && n.file === relativePath
      );
      if (alreadyExists) {
        return;
      }

      // Width is always FIXED (defaultWidth setting)
      const width = this.settings.defaultWidth;

      // Calculate ACTUAL height based on content + media embeds
      const height = await this.calculateNodeHeight(relativePath);

      // Calculate grid position based on existing file nodes
      const fileNodes = canvas.nodes.filter((n) => n.type === "file");
      const index = fileNodes.length;
      const cols = Math.ceil(Math.sqrt(index + 1)) || 1;
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * (width + GAP_X);
      const y = row * (height + GAP_Y);

      const newNode: CanvasNode = {
        id: this.generateId(),
        type: "file",
        x,
        y,
        width,
        height,
        file: relativePath,
      };

      canvas.nodes.push(newNode);

      await this.app.vault.modify(
        targetFile,
        JSON.stringify(canvas, null, 2)
      );

      console.log(`Added ${relativePath} to ${TARGET_CANVAS} with width ${width} and height ${height} (media count: ${this.countMediaEmbeds(await this.app.vault.read(await this.app.vault.getAbstractFileByPath(relativePath)))}`);
    } catch (error) {
      console.error("Canvas Placer: error adding file to canvas:", error);
      new Notice("Canvas Placer: failed to add note to canvas");
    }
  }

  async addAllExistingFiles(): Promise<void> {
    const allFiles = this.app.vault.getAllLoadedFiles() as TFile[];
    const telegramFiles = allFiles.filter(
      (f) =>
        f.path.startsWith(`${WATCH_FOLDER}/`) && f.extension === "md"
    );

    if (telegramFiles.length === 0) {
      new Notice("No notes found in Telegram-Inbox");
      return;
    }

    // Load canvas once
    let canvasFile = this.app.vault.getAbstractFileByPath(TARGET_CANVAS);
    let canvas: CanvasData = { nodes: [], edges: [] };

    if (canvasFile instanceof TFile) {
      const content = await this.app.vault.read(canvasFile);
      if (content.trim()) {
        canvas = JSON.parse(content) as CanvasData;
      }
    } else {
      canvasFile = (await this.app.vault.create(
        TARGET_CANVAS,
        JSON.stringify({ nodes: [], edges: [] }, null, 2)
      )) as TFile;
    }

    const existingFiles = new Set(
      canvas.nodes
        .filter((n) => n.type === "file")
        .map((n) => n.file)
    );

    let added = 0;
    let index = canvas.nodes.filter((n) => n.type === "file").length;

    for (const file of telegramFiles) {
      if (existingFiles.has(file.path)) continue;

      // Width is always FIXED (defaultWidth setting)
      const width = this.settings.defaultWidth;

      // Calculate ACTUAL height for this specific file
      const height = await this.calculateNodeHeight(file.path);

      const cols = Math.ceil(Math.sqrt(index + 1)) || 1;
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * (width + GAP_X);
      const y = row * (height + GAP_Y);

      canvas.nodes.push({
        id: this.generateId(),
        type: "file",
        x,
        y,
        width,
        height,
        file: file.path,
      });

      existingFiles.add(file.path);
      index++;
      added++;
    }

    if (added > 0) {
      await this.app.vault.modify(
        canvasFile as TFile,
        JSON.stringify(canvas, null, 2)
      );
      new Notice(`Added ${added} note(s) to fetchboard.canvas`);
    } else {
      new Notice("All Telegram-Inbox notes are already on the canvas");
    }
  }

  generateId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15);
  }
}