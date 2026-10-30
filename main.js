"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CanvasPlacerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/settings/setting-tab.ts
var import_obsidian = require("obsidian");
var CanvasPlacerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Canvas Placer Settings" });
    new import_obsidian.Setting(containerEl).setName("Enable content-based height").setDesc("When enabled, note height will be calculated based on ACTUAL content length + media embeds").addToggle((toggle) => toggle.setValue(this.plugin.settings.enabled).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.enabled = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Fixed width").setDesc("Width to use for all notes (pixels)").addSlider((slider) => slider.setLimits(100, 1e3, 10).setValue(this.plugin.settings.defaultWidth).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.defaultWidth = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Default height (when disabled)").setDesc("Height to use when content-based height is disabled").addSlider((slider) => slider.setLimits(50, 1e3, 10).setValue(this.plugin.settings.defaultHeight).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.defaultHeight = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Minimum height").setDesc("Minimum height for content-based sizing").addSlider((slider) => slider.setLimits(20, 500, 10).setValue(this.plugin.settings.minHeight).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.minHeight = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Maximum height").setDesc("Maximum height for content-based sizing").addSlider((slider) => slider.setLimits(100, 2e3, 20).setValue(this.plugin.settings.maxHeight).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.maxHeight = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Padding").setDesc("Extra padding around content (pixels)").addSlider((slider) => slider.setLimits(0, 100, 5).setValue(this.plugin.settings.padding).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.padding = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Media embed height").setDesc("Approximate height for each media embed (photo/video) in pixels").addSlider((slider) => slider.setLimits(50, 500, 10).setValue(this.plugin.settings.mediaEmbedHeight).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.mediaEmbedHeight = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Character height estimate").setDesc("Estimated height per character in pixels (for compatibility - not used in calculation)").addSlider((slider) => slider.setLimits(8, 32, 2).setValue(this.plugin.settings.charHeightEstimate).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.charHeightEstimate = value;
      yield this.plugin.saveSettings();
    })));
  }
};

// src/settings/types.ts
var DEFAULT_SETTINGS = {
  enabled: false,
  defaultWidth: 400,
  defaultHeight: 300,
  minHeight: 100,
  maxHeight: 800,
  padding: 20,
  charHeightEstimate: 16,
  mediaEmbedHeight: 200
  // Default height assumption for each media embed
};

// main.ts
var GAP_X = 60;
var GAP_Y = 60;
var WATCH_FOLDER = "Telegram-Inbox";
var TARGET_CANVAS = "boards/fetchboard.canvas";
var CanvasPlacerPlugin = class extends import_obsidian2.Plugin {
  onload() {
    return __async(this, null, function* () {
      console.log("Loading Canvas Placer plugin");
      yield this.loadSettings();
      this.addSettingTab(new CanvasPlacerSettingTab(this.app, this));
      this.registerEvent(
        this.app.vault.on("create", (file) => {
          if (!(file instanceof import_obsidian2.TFile))
            return;
          if (file.extension !== "md")
            return;
          if (!file.path.startsWith(`${WATCH_FOLDER}/`))
            return;
          this.addFileToCanvas(file.path);
        })
      );
      this.addCommand({
        id: "add-all-telegram-to-canvas",
        name: "Add all Telegram-Inbox notes to fetchboard.canvas",
        callback: () => this.addAllExistingFiles()
      });
      new import_obsidian2.Notice("Canvas Placer plugin loaded");
    });
  }
  onunload() {
    console.log("Unloading Canvas Placer plugin");
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
  /**
   * Count media embed patterns in text (e.g., ![[filename.jpg]])
   * Uses simple string splitting to avoid regex escaping issues
   */
  countMediaEmbeds(text) {
    return text.split("![").length - 1;
  }
  /**
   * Measure actual text height at fixed width with padding
   */
  measureTextHeight(text, width, padding) {
    return __async(this, null, function* () {
      const div = document.createElement("div");
      div.style.position = "fixed";
      div.style.top = "-9999px";
      div.style.left = "-9999px";
      div.style.width = `${width}px`;
      div.style.whiteSpace = "pre-wrap";
      div.style.wordWrap = "break-word";
      div.style.padding = `${padding}px`;
      div.style.fontSize = "16px";
      div.style.lineHeight = "1.5";
      div.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
      div.textContent = text;
      document.body.appendChild(div);
      const height = div.scrollHeight;
      document.body.removeChild(div);
      return height;
    });
  }
  /**
   * Calculate height based on ACTUAL content measurement + media embeds
   */
  calculateNodeHeight(relativePath) {
    return __async(this, null, function* () {
      if (!this.settings.enabled) {
        return this.settings.defaultHeight;
      }
      try {
        const file = this.app.vault.getAbstractFileByPath(relativePath);
        if (!(file instanceof import_obsidian2.TFile)) {
          return this.settings.defaultHeight;
        }
        const content = yield this.app.vault.read(file);
        const measuredHeight = yield this.measureTextHeight(
          content,
          this.settings.defaultWidth,
          this.settings.padding
        );
        const mediaCount = this.countMediaEmbeds(content);
        const mediaHeight = mediaCount * this.settings.mediaEmbedHeight;
        const totalHeight = measuredHeight + mediaHeight;
        return Math.min(
          this.settings.maxHeight,
          Math.max(this.settings.minHeight, totalHeight)
        );
      } catch (error) {
        console.error("Canvas Placer: error calculating node height:", error);
        return this.settings.defaultHeight;
      }
    });
  }
  addFileToCanvas(relativePath) {
    return __async(this, null, function* () {
      try {
        const canvasFile = this.app.vault.getAbstractFileByPath(TARGET_CANVAS);
        let canvas = { nodes: [], edges: [] };
        let targetFile;
        if (canvasFile instanceof import_obsidian2.TFile) {
          targetFile = canvasFile;
          const content = yield this.app.vault.read(canvasFile);
          if (content.trim()) {
            canvas = JSON.parse(content);
          }
        } else {
          targetFile = yield this.app.vault.create(
            TARGET_CANVAS,
            JSON.stringify({ nodes: [], edges: [] }, null, 2)
          );
        }
        const alreadyExists = canvas.nodes.some(
          (n) => n.type === "file" && n.file === relativePath
        );
        if (alreadyExists) {
          return;
        }
        const width = this.settings.defaultWidth;
        const height = yield this.calculateNodeHeight(relativePath);
        const fileNodes = canvas.nodes.filter((n) => n.type === "file");
        const index = fileNodes.length;
        const cols = Math.ceil(Math.sqrt(index + 1)) || 1;
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * (width + GAP_X);
        const y = row * (height + GAP_Y);
        const newNode = {
          id: this.generateId(),
          type: "file",
          x,
          y,
          width,
          height,
          file: relativePath
        };
        canvas.nodes.push(newNode);
        yield this.app.vault.modify(
          targetFile,
          JSON.stringify(canvas, null, 2)
        );
        console.log(`Added ${relativePath} to ${TARGET_CANVAS} with width ${width} and height ${height} (media count: ${this.countMediaEmbeds(yield this.app.vault.read(yield this.app.vault.getAbstractFileByPath(relativePath)))}`);
      } catch (error) {
        console.error("Canvas Placer: error adding file to canvas:", error);
        new import_obsidian2.Notice("Canvas Placer: failed to add note to canvas");
      }
    });
  }
  addAllExistingFiles() {
    return __async(this, null, function* () {
      const allFiles = this.app.vault.getAllLoadedFiles();
      const telegramFiles = allFiles.filter(
        (f) => f.path.startsWith(`${WATCH_FOLDER}/`) && f.extension === "md"
      );
      if (telegramFiles.length === 0) {
        new import_obsidian2.Notice("No notes found in Telegram-Inbox");
        return;
      }
      let canvasFile = this.app.vault.getAbstractFileByPath(TARGET_CANVAS);
      let canvas = { nodes: [], edges: [] };
      if (canvasFile instanceof import_obsidian2.TFile) {
        const content = yield this.app.vault.read(canvasFile);
        if (content.trim()) {
          canvas = JSON.parse(content);
        }
      } else {
        canvasFile = yield this.app.vault.create(
          TARGET_CANVAS,
          JSON.stringify({ nodes: [], edges: [] }, null, 2)
        );
      }
      const existingFiles = new Set(
        canvas.nodes.filter((n) => n.type === "file").map((n) => n.file)
      );
      let added = 0;
      let index = canvas.nodes.filter((n) => n.type === "file").length;
      for (const file of telegramFiles) {
        if (existingFiles.has(file.path))
          continue;
        const width = this.settings.defaultWidth;
        const height = yield this.calculateNodeHeight(file.path);
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
          file: file.path
        });
        existingFiles.add(file.path);
        index++;
        added++;
      }
      if (added > 0) {
        yield this.app.vault.modify(
          canvasFile,
          JSON.stringify(canvas, null, 2)
        );
        new import_obsidian2.Notice(`Added ${added} note(s) to fetchboard.canvas`);
      } else {
        new import_obsidian2.Notice("All Telegram-Inbox notes are already on the canvas");
      }
    });
  }
  generateId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15);
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyIsICJzcmMvc2V0dGluZ3Mvc2V0dGluZy10YWIudHMiLCAic3JjL3NldHRpbmdzL3R5cGVzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBQbHVnaW4sIFRGaWxlLCBOb3RpY2UsIEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHR5cGUgQ2FudmFzUGxhY2VyU2V0dGluZ3MgZnJvbSBcIi4vc3JjL3NldHRpbmdzL3R5cGVzXCI7XG5pbXBvcnQgQ2FudmFzUGxhY2VyU2V0dGluZ1RhYiBmcm9tIFwiLi9zcmMvc2V0dGluZ3Mvc2V0dGluZy10YWJcIjtcbmltcG9ydCB7IERFRkFVTFRfU0VUVElOR1MgfSBmcm9tIFwiLi9zcmMvc2V0dGluZ3MvdHlwZXNcIjtcblxuaW50ZXJmYWNlIENhbnZhc05vZGUge1xuICBpZDogc3RyaW5nO1xuICB0eXBlOiBcImZpbGVcIiB8IFwidGV4dFwiIHwgXCJsaW5rXCIgfCBcImdyb3VwXCI7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgZmlsZT86IHN0cmluZztcbiAgdGV4dD86IHN0cmluZztcbiAgdXJsPzogc3RyaW5nO1xuICBjb2xvcj86IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIENhbnZhc0VkZ2Uge1xuICBpZDogc3RyaW5nO1xuICBmcm9tTm9kZTogc3RyaW5nO1xuICB0b05vZGU6IHN0cmluZztcbiAgZnJvbVNpZGU/OiBzdHJpbmc7XG4gIHRvU2lkZT86IHN0cmluZztcbiAgY29sb3I/OiBudW1iZXI7XG4gIGxhYmVsPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQ2FudmFzRGF0YSB7XG4gIG5vZGVzOiBDYW52YXNOb2RlW107XG4gIGVkZ2VzOiBDYW52YXNFZGdlW107XG59XG5cbmNvbnN0IEdBUF9YID0gNjA7XG5jb25zdCBHQVBfWSA9IDYwO1xuXG5jb25zdCBXQVRDSF9GT0xERVIgPSBcIlRlbGVncmFtLUluYm94XCI7XG5jb25zdCBUQVJHRVRfQ0FOVkFTID0gXCJib2FyZHMvZmV0Y2hib2FyZC5jYW52YXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzUGxhY2VyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgc2V0dGluZ3M6IENhbnZhc1BsYWNlclNldHRpbmdzO1xuXG4gIGFzeW5jIG9ubG9hZCgpIHtcbiAgICBjb25zb2xlLmxvZyhcIkxvYWRpbmcgQ2FudmFzIFBsYWNlciBwbHVnaW5cIik7XG5cbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG4gICAgLy8gQWRkIHNldHRpbmdzIHRhYlxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgQ2FudmFzUGxhY2VyU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG4gICAgLy8gV2F0Y2ggZm9yIG5ldyBmaWxlcyBjcmVhdGVkIGluIHRoZSB2YXVsdFxuICAgIHRoaXMucmVnaXN0ZXJFdmVudChcbiAgICAgIHRoaXMuYXBwLnZhdWx0Lm9uKFwiY3JlYXRlXCIsIChmaWxlKSA9PiB7XG4gICAgICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybjtcbiAgICAgICAgaWYgKGZpbGUuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIHJldHVybjtcbiAgICAgICAgaWYgKCFmaWxlLnBhdGguc3RhcnRzV2l0aChgJHtXQVRDSF9GT0xERVJ9L2ApKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5hZGRGaWxlVG9DYW52YXMoZmlsZS5wYXRoKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIE1hbnVhbCBjb21tYW5kOiBhZGQgYWxsIGV4aXN0aW5nIFRlbGVncmFtLUluYm94IG5vdGVzIHRvIGNhbnZhc1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJhZGQtYWxsLXRlbGVncmFtLXRvLWNhbnZhc1wiLFxuICAgICAgbmFtZTogXCJBZGQgYWxsIFRlbGVncmFtLUluYm94IG5vdGVzIHRvIGZldGNoYm9hcmQuY2FudmFzXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5hZGRBbGxFeGlzdGluZ0ZpbGVzKCksXG4gICAgfSk7XG5cbiAgICBuZXcgTm90aWNlKFwiQ2FudmFzIFBsYWNlciBwbHVnaW4gbG9hZGVkXCIpO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coXCJVbmxvYWRpbmcgQ2FudmFzIFBsYWNlciBwbHVnaW5cIik7XG4gIH1cblxuICBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XG4gIH1cblxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG4gICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgfVxuLyoqXG4gKiBDb3VudCBtZWRpYSBlbWJlZCBwYXR0ZXJucyBpbiB0ZXh0IChlLmcuLCAhW1tmaWxlbmFtZS5qcGddXSlcbiAqIFVzZXMgc2ltcGxlIHN0cmluZyBzcGxpdHRpbmcgdG8gYXZvaWQgcmVnZXggZXNjYXBpbmcgaXNzdWVzXG4gKi9cbnByaXZhdGUgY291bnRNZWRpYUVtYmVkcyh0ZXh0OiBzdHJpbmcpOiBudW1iZXIge1xuICAgIC8vIFNwbGl0IGJ5ICchW1snIGFuZCBzdWJ0cmFjdCAxIHRvIGdldCBjb3VudFxuICAgIC8vIEV4YW1wbGU6IFwidGV4dCAhW1tpbWcxXV0gbW9yZSB0ZXh0ICFbW2ltZzJdXVwiIFxuICAgIC8vIFNwbGl0OiBbXCJ0ZXh0IFwiLCBcImltZzFdXSBtb3JlIHRleHQgXCIsIFwiaW1nMl1dXCJdIFx1MjE5MiBsZW5ndGggMyBcdTIxOTIgY291bnQgMlxuICAgIHJldHVybiB0ZXh0LnNwbGl0KCchWycpLmxlbmd0aCAtIDE7XG59XG5cbiAgLyoqXG4gICAqIE1lYXN1cmUgYWN0dWFsIHRleHQgaGVpZ2h0IGF0IGZpeGVkIHdpZHRoIHdpdGggcGFkZGluZ1xuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBtZWFzdXJlVGV4dEhlaWdodCh0ZXh0OiBzdHJpbmcsIHdpZHRoOiBudW1iZXIsIHBhZGRpbmc6IG51bWJlcik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgLy8gQ3JlYXRlIG1lYXN1cmVtZW50IGVsZW1lbnRcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgIGRpdi5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgZGl2LnN0eWxlLmxlZnQgPSAnLTk5OTlweCc7XG4gICAgZGl2LnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIGRpdi5zdHlsZS53aGl0ZVNwYWNlID0gJ3ByZS13cmFwJzsgLy8gSG9ub3IgbmV3bGluZXNcbiAgICBkaXYuc3R5bGUud29yZFdyYXAgPSAnYnJlYWstd29yZCc7XG4gICAgZGl2LnN0eWxlLnBhZGRpbmcgPSBgJHtwYWRkaW5nfXB4YDsgLy8gVmVydGljYWwgcGFkZGluZyBhZmZlY3RzIGhlaWdodFxuICAgIFxuICAgIC8vIFJlYXNvbmFibGUgZGVmYXVsdHMgbWF0Y2hpbmcgT2JzaWRpYW4gbm90ZSBzdHlsaW5nXG4gICAgZGl2LnN0eWxlLmZvbnRTaXplID0gJzE2cHgnO1xuICAgIGRpdi5zdHlsZS5saW5lSGVpZ2h0ID0gJzEuNSc7XG4gICAgZGl2LnN0eWxlLmZvbnRGYW1pbHkgPSAnLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcIlNlZ29lIFVJXCIsIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgXCJPcGVuIFNhbnNcIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLCBzYW5zLXNlcmlmJztcbiAgICBcbiAgICAvLyBTZXQgYXMgcGxhaW4gdGV4dCAocHJlc2VydmVzIG5ld2xpbmVzIC0gVGVsZWdyYW0gaXMgdXN1YWxseSBwbGFpbiB0ZXh0KVxuICAgIGRpdi50ZXh0Q29udGVudCA9IHRleHQ7XG4gICAgXG4gICAgLy8gTWVhc3VyZSBhbmQgY2xlYW4gdXBcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgY29uc3QgaGVpZ2h0ID0gZGl2LnNjcm9sbEhlaWdodDsgLy8gSW5jbHVkZXMgcGFkZGluZyBmcm9tIGRpdi5zdHlsZS5wYWRkaW5nXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuICAgIFxuICAgIHJldHVybiBoZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGhlaWdodCBiYXNlZCBvbiBBQ1RVQUwgY29udGVudCBtZWFzdXJlbWVudCArIG1lZGlhIGVtYmVkc1xuICAgKi9cbiAgYXN5bmMgY2FsY3VsYXRlTm9kZUhlaWdodChyZWxhdGl2ZVBhdGg6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmVuYWJsZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzLmRlZmF1bHRIZWlnaHQ7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgocmVsYXRpdmVQYXRoKTtcbiAgICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuZGVmYXVsdEhlaWdodDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoZmlsZSk7XG4gICAgICBcbiAgICAgIC8vIE1FQVNVUkUgQUNUVUFMIFRFWFQgSEVJR0hUIGF0IGZpeGVkIHdpZHRoIHdpdGggcGFkZGluZ1xuICAgICAgY29uc3QgbWVhc3VyZWRIZWlnaHQgPSBhd2FpdCB0aGlzLm1lYXN1cmVUZXh0SGVpZ2h0KFxuICAgICAgICBjb250ZW50LCBcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5kZWZhdWx0V2lkdGgsIFxuICAgICAgICB0aGlzLnNldHRpbmdzLnBhZGRpbmdcbiAgICAgICk7XG4gICAgICBcbiAgICAgIC8vIENPVU5UIE1FRElBIEVNQkVEUyBhbmQgYWRkIHRoZWlyIGVzdGltYXRlZCBoZWlnaHRcbiAgICAgIGNvbnN0IG1lZGlhQ291bnQgPSB0aGlzLmNvdW50TWVkaWFFbWJlZHMoY29udGVudCk7XG4gICAgICBjb25zdCBtZWRpYUhlaWdodCA9IG1lZGlhQ291bnQgKiB0aGlzLnNldHRpbmdzLm1lZGlhRW1iZWRIZWlnaHQ7XG4gICAgICBjb25zdCB0b3RhbEhlaWdodCA9IG1lYXN1cmVkSGVpZ2h0ICsgbWVkaWFIZWlnaHQ7XG4gICAgICBcbiAgICAgIC8vIEFwcGx5IG1pbi9tYXggY29uc3RyYWludHNcbiAgICAgIHJldHVybiBNYXRoLm1pbihcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5tYXhIZWlnaHQsXG4gICAgICAgIE1hdGgubWF4KHRoaXMuc2V0dGluZ3MubWluSGVpZ2h0LCB0b3RhbEhlaWdodClcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW52YXMgUGxhY2VyOiBlcnJvciBjYWxjdWxhdGluZyBub2RlIGhlaWdodDpcIiwgZXJyb3IpO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MuZGVmYXVsdEhlaWdodDtcbiAgICB9XG4gIH1cblxuICBhc3luYyBhZGRGaWxlVG9DYW52YXMocmVsYXRpdmVQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2FudmFzRmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChUQVJHRVRfQ0FOVkFTKTtcblxuICAgICAgbGV0IGNhbnZhczogQ2FudmFzRGF0YSA9IHsgbm9kZXM6IFtdLCBlZGdlczogW10gfTtcbiAgICAgIGxldCB0YXJnZXRGaWxlOiBURmlsZTtcblxuICAgICAgaWYgKGNhbnZhc0ZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICB0YXJnZXRGaWxlID0gY2FudmFzRmlsZTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoY2FudmFzRmlsZSk7XG4gICAgICAgIGlmIChjb250ZW50LnRyaW0oKSkge1xuICAgICAgICAgIGNhbnZhcyA9IEpTT04ucGFyc2UoY29udGVudCkgYXMgQ2FudmFzRGF0YTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0RmlsZSA9IChhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoXG4gICAgICAgICAgVEFSR0VUX0NBTlZBUyxcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7IG5vZGVzOiBbXSwgZWRnZXM6IFtdIH0sIG51bGwsIDIpXG4gICAgICAgICkpIGFzIFRGaWxlO1xuICAgICAgfVxuXG4gICAgICAvLyBTa2lwIGlmIHRoaXMgZmlsZSBpcyBhbHJlYWR5IG9uIHRoZSBjYW52YXNcbiAgICAgIGNvbnN0IGFscmVhZHlFeGlzdHMgPSBjYW52YXMubm9kZXMuc29tZShcbiAgICAgICAgKG4pID0+IG4udHlwZSA9PT0gXCJmaWxlXCIgJiYgbi5maWxlID09PSByZWxhdGl2ZVBhdGhcbiAgICAgICk7XG4gICAgICBpZiAoYWxyZWFkeUV4aXN0cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFdpZHRoIGlzIGFsd2F5cyBGSVhFRCAoZGVmYXVsdFdpZHRoIHNldHRpbmcpXG4gICAgICBjb25zdCB3aWR0aCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdFdpZHRoO1xuXG4gICAgICAvLyBDYWxjdWxhdGUgQUNUVUFMIGhlaWdodCBiYXNlZCBvbiBjb250ZW50ICsgbWVkaWEgZW1iZWRzXG4gICAgICBjb25zdCBoZWlnaHQgPSBhd2FpdCB0aGlzLmNhbGN1bGF0ZU5vZGVIZWlnaHQocmVsYXRpdmVQYXRoKTtcblxuICAgICAgLy8gQ2FsY3VsYXRlIGdyaWQgcG9zaXRpb24gYmFzZWQgb24gZXhpc3RpbmcgZmlsZSBub2Rlc1xuICAgICAgY29uc3QgZmlsZU5vZGVzID0gY2FudmFzLm5vZGVzLmZpbHRlcigobikgPT4gbi50eXBlID09PSBcImZpbGVcIik7XG4gICAgICBjb25zdCBpbmRleCA9IGZpbGVOb2Rlcy5sZW5ndGg7XG4gICAgICBjb25zdCBjb2xzID0gTWF0aC5jZWlsKE1hdGguc3FydChpbmRleCArIDEpKSB8fCAxO1xuICAgICAgY29uc3QgY29sID0gaW5kZXggJSBjb2xzO1xuICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihpbmRleCAvIGNvbHMpO1xuICAgICAgY29uc3QgeCA9IGNvbCAqICh3aWR0aCArIEdBUF9YKTtcbiAgICAgIGNvbnN0IHkgPSByb3cgKiAoaGVpZ2h0ICsgR0FQX1kpO1xuXG4gICAgICBjb25zdCBuZXdOb2RlOiBDYW52YXNOb2RlID0ge1xuICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZUlkKCksXG4gICAgICAgIHR5cGU6IFwiZmlsZVwiLFxuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgICBmaWxlOiByZWxhdGl2ZVBhdGgsXG4gICAgICB9O1xuXG4gICAgICBjYW52YXMubm9kZXMucHVzaChuZXdOb2RlKTtcblxuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KFxuICAgICAgICB0YXJnZXRGaWxlLFxuICAgICAgICBKU09OLnN0cmluZ2lmeShjYW52YXMsIG51bGwsIDIpXG4gICAgICApO1xuXG4gICAgICBjb25zb2xlLmxvZyhgQWRkZWQgJHtyZWxhdGl2ZVBhdGh9IHRvICR7VEFSR0VUX0NBTlZBU30gd2l0aCB3aWR0aCAke3dpZHRofSBhbmQgaGVpZ2h0ICR7aGVpZ2h0fSAobWVkaWEgY291bnQ6ICR7dGhpcy5jb3VudE1lZGlhRW1iZWRzKGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoYXdhaXQgdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKHJlbGF0aXZlUGF0aCkpKX1gKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkNhbnZhcyBQbGFjZXI6IGVycm9yIGFkZGluZyBmaWxlIHRvIGNhbnZhczpcIiwgZXJyb3IpO1xuICAgICAgbmV3IE5vdGljZShcIkNhbnZhcyBQbGFjZXI6IGZhaWxlZCB0byBhZGQgbm90ZSB0byBjYW52YXNcIik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWRkQWxsRXhpc3RpbmdGaWxlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBhbGxGaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldEFsbExvYWRlZEZpbGVzKCkgYXMgVEZpbGVbXTtcbiAgICBjb25zdCB0ZWxlZ3JhbUZpbGVzID0gYWxsRmlsZXMuZmlsdGVyKFxuICAgICAgKGYpID0+XG4gICAgICAgIGYucGF0aC5zdGFydHNXaXRoKGAke1dBVENIX0ZPTERFUn0vYCkgJiYgZi5leHRlbnNpb24gPT09IFwibWRcIlxuICAgICk7XG5cbiAgICBpZiAodGVsZWdyYW1GaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIG5ldyBOb3RpY2UoXCJObyBub3RlcyBmb3VuZCBpbiBUZWxlZ3JhbS1JbmJveFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMb2FkIGNhbnZhcyBvbmNlXG4gICAgbGV0IGNhbnZhc0ZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoVEFSR0VUX0NBTlZBUyk7XG4gICAgbGV0IGNhbnZhczogQ2FudmFzRGF0YSA9IHsgbm9kZXM6IFtdLCBlZGdlczogW10gfTtcblxuICAgIGlmIChjYW52YXNGaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGNhbnZhc0ZpbGUpO1xuICAgICAgaWYgKGNvbnRlbnQudHJpbSgpKSB7XG4gICAgICAgIGNhbnZhcyA9IEpTT04ucGFyc2UoY29udGVudCkgYXMgQ2FudmFzRGF0YTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2FudmFzRmlsZSA9IChhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGUoXG4gICAgICAgIFRBUkdFVF9DQU5WQVMsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHsgbm9kZXM6IFtdLCBlZGdlczogW10gfSwgbnVsbCwgMilcbiAgICAgICkpIGFzIFRGaWxlO1xuICAgIH1cblxuICAgIGNvbnN0IGV4aXN0aW5nRmlsZXMgPSBuZXcgU2V0KFxuICAgICAgY2FudmFzLm5vZGVzXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IG4udHlwZSA9PT0gXCJmaWxlXCIpXG4gICAgICAgIC5tYXAoKG4pID0+IG4uZmlsZSlcbiAgICApO1xuXG4gICAgbGV0IGFkZGVkID0gMDtcbiAgICBsZXQgaW5kZXggPSBjYW52YXMubm9kZXMuZmlsdGVyKChuKSA9PiBuLnR5cGUgPT09IFwiZmlsZVwiKS5sZW5ndGg7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgdGVsZWdyYW1GaWxlcykge1xuICAgICAgaWYgKGV4aXN0aW5nRmlsZXMuaGFzKGZpbGUucGF0aCkpIGNvbnRpbnVlO1xuXG4gICAgICAvLyBXaWR0aCBpcyBhbHdheXMgRklYRUQgKGRlZmF1bHRXaWR0aCBzZXR0aW5nKVxuICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRXaWR0aDtcblxuICAgICAgLy8gQ2FsY3VsYXRlIEFDVFVBTCBoZWlnaHQgZm9yIHRoaXMgc3BlY2lmaWMgZmlsZVxuICAgICAgY29uc3QgaGVpZ2h0ID0gYXdhaXQgdGhpcy5jYWxjdWxhdGVOb2RlSGVpZ2h0KGZpbGUucGF0aCk7XG5cbiAgICAgIGNvbnN0IGNvbHMgPSBNYXRoLmNlaWwoTWF0aC5zcXJ0KGluZGV4ICsgMSkpIHx8IDE7XG4gICAgICBjb25zdCBjb2wgPSBpbmRleCAlIGNvbHM7XG4gICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKGluZGV4IC8gY29scyk7XG4gICAgICBjb25zdCB4ID0gY29sICogKHdpZHRoICsgR0FQX1gpO1xuICAgICAgY29uc3QgeSA9IHJvdyAqIChoZWlnaHQgKyBHQVBfWSk7XG5cbiAgICAgIGNhbnZhcy5ub2Rlcy5wdXNoKHtcbiAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVJZCgpLFxuICAgICAgICB0eXBlOiBcImZpbGVcIixcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgZmlsZTogZmlsZS5wYXRoLFxuICAgICAgfSk7XG5cbiAgICAgIGV4aXN0aW5nRmlsZXMuYWRkKGZpbGUucGF0aCk7XG4gICAgICBpbmRleCsrO1xuICAgICAgYWRkZWQrKztcbiAgICB9XG5cbiAgICBpZiAoYWRkZWQgPiAwKSB7XG4gICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoXG4gICAgICAgIGNhbnZhc0ZpbGUgYXMgVEZpbGUsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KGNhbnZhcywgbnVsbCwgMilcbiAgICAgICk7XG4gICAgICBuZXcgTm90aWNlKGBBZGRlZCAke2FkZGVkfSBub3RlKHMpIHRvIGZldGNoYm9hcmQuY2FudmFzYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ldyBOb3RpY2UoXCJBbGwgVGVsZWdyYW0tSW5ib3ggbm90ZXMgYXJlIGFscmVhZHkgb24gdGhlIGNhbnZhc1wiKTtcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiBjcnlwdG8gIT09IFwidW5kZWZpbmVkXCIgJiYgY3J5cHRvLnJhbmRvbVVVSUQpIHtcbiAgICAgIHJldHVybiBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KTtcbiAgfVxufSIsICJpbXBvcnQgeyBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgdHlwZSBDYW52YXNQbGFjZXJQbHVnaW4gZnJvbSBcIi4uL21haW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzUGxhY2VyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBwbHVnaW46IENhbnZhc1BsYWNlclBsdWdpbjtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBDYW52YXNQbGFjZXJQbHVnaW4pIHtcbiAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gIH1cblxuICBkaXNwbGF5KCk6IHZvaWQge1xuICAgIGNvbnN0IHtjb250YWluZXJFbH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwge3RleHQ6IFwiQ2FudmFzIFBsYWNlciBTZXR0aW5nc1wifSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5hYmxlIGNvbnRlbnQtYmFzZWQgaGVpZ2h0XCIpXG4gICAgICAuc2V0RGVzYyhcIldoZW4gZW5hYmxlZCwgbm90ZSBoZWlnaHQgd2lsbCBiZSBjYWxjdWxhdGVkIGJhc2VkIG9uIEFDVFVBTCBjb250ZW50IGxlbmd0aCArIG1lZGlhIGVtYmVkc1wiKVxuICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZCA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB9KSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRml4ZWQgd2lkdGhcIilcbiAgICAgIC5zZXREZXNjKFwiV2lkdGggdG8gdXNlIGZvciBhbGwgbm90ZXMgKHBpeGVscylcIilcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAuc2V0TGltaXRzKDEwMCwgMTAwMCwgMTApXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0V2lkdGgpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0V2lkdGggPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRlZmF1bHQgaGVpZ2h0ICh3aGVuIGRpc2FibGVkKVwiKVxuICAgICAgLnNldERlc2MoXCJIZWlnaHQgdG8gdXNlIHdoZW4gY29udGVudC1iYXNlZCBoZWlnaHQgaXMgZGlzYWJsZWRcIilcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAuc2V0TGltaXRzKDUwLCAxMDAwLCAxMClcbiAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmRlZmF1bHRIZWlnaHQpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0SGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNaW5pbXVtIGhlaWdodFwiKVxuICAgICAgLnNldERlc2MoXCJNaW5pbXVtIGhlaWdodCBmb3IgY29udGVudC1iYXNlZCBzaXppbmdcIilcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAuc2V0TGltaXRzKDIwLCA1MDAsIDEwKVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubWluSGVpZ2h0KVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWluSGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJNYXhpbXVtIGhlaWdodFwiKVxuICAgICAgLnNldERlc2MoXCJNYXhpbXVtIGhlaWdodCBmb3IgY29udGVudC1iYXNlZCBzaXppbmdcIilcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAuc2V0TGltaXRzKDEwMCwgMjAwMCwgMjApXG4gICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXhIZWlnaHQpXG4gICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tYXhIZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlBhZGRpbmdcIilcbiAgICAgIC5zZXREZXNjKFwiRXh0cmEgcGFkZGluZyBhcm91bmQgY29udGVudCAocGl4ZWxzKVwiKVxuICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gc2xpZGVyXG4gICAgICAgIC5zZXRMaW1pdHMoMCwgMTAwLCA1KVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MucGFkZGluZylcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnBhZGRpbmcgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIk1lZGlhIGVtYmVkIGhlaWdodFwiKVxuICAgICAgLnNldERlc2MoXCJBcHByb3hpbWF0ZSBoZWlnaHQgZm9yIGVhY2ggbWVkaWEgZW1iZWQgKHBob3RvL3ZpZGVvKSBpbiBwaXhlbHNcIilcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAuc2V0TGltaXRzKDUwLCA1MDAsIDEwKVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubWVkaWFFbWJlZEhlaWdodClcbiAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLm1lZGlhRW1iZWRIZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkNoYXJhY3RlciBoZWlnaHQgZXN0aW1hdGVcIilcbiAgICAgIC5zZXREZXNjKFwiRXN0aW1hdGVkIGhlaWdodCBwZXIgY2hhcmFjdGVyIGluIHBpeGVscyAoZm9yIGNvbXBhdGliaWxpdHkgLSBub3QgdXNlZCBpbiBjYWxjdWxhdGlvbilcIilcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAuc2V0TGltaXRzKDgsIDMyLCAyKVxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuY2hhckhlaWdodEVzdGltYXRlKVxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY2hhckhlaWdodEVzdGltYXRlID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG4gICAgICAgIH0pKTtcbiAgfVxufSIsICJleHBvcnQgaW50ZXJmYWNlIENhbnZhc1BsYWNlclNldHRpbmdzIHtcbiAgZW5hYmxlZDogYm9vbGVhbjtcbiAgZGVmYXVsdFdpZHRoOiBudW1iZXI7XG4gIGRlZmF1bHRIZWlnaHQ6IG51bWJlcjtcbiAgbWluSGVpZ2h0OiBudW1iZXI7XG4gIG1heEhlaWdodDogbnVtYmVyO1xuICBwYWRkaW5nOiBudW1iZXI7XG4gIGNoYXJIZWlnaHRFc3RpbWF0ZTogbnVtYmVyOyAvLyBLZXB0IGZvciBjb21wYXRpYmlsaXR5IGJ1dCB1bnVzZWRcbiAgbWVkaWFFbWJlZEhlaWdodDogbnVtYmVyOyAgIC8vIEhlaWdodCBwZXIgbWVkaWEgZW1iZWQgaW4gcGl4ZWxzXG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBDYW52YXNQbGFjZXJTZXR0aW5ncyA9IHtcbiAgZW5hYmxlZDogZmFsc2UsXG4gIGRlZmF1bHRXaWR0aDogNDAwLFxuICBkZWZhdWx0SGVpZ2h0OiAzMDAsXG4gIG1pbkhlaWdodDogMTAwLFxuICBtYXhIZWlnaHQ6IDgwMCxcbiAgcGFkZGluZzogMjAsXG4gIGNoYXJIZWlnaHRFc3RpbWF0ZTogMTYsXG4gIG1lZGlhRW1iZWRIZWlnaHQ6IDIwMCAvLyBEZWZhdWx0IGhlaWdodCBhc3N1bXB0aW9uIGZvciBlYWNoIG1lZGlhIGVtYmVkXG59OyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FB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
