import { PluginSettingTab, Setting } from "obsidian";
import type CanvasPlacerPlugin from "../main";

export default class CanvasPlacerSettingTab extends PluginSettingTab {
  plugin: CanvasPlacerPlugin;

  constructor(app: App, plugin: CanvasPlacerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();

    containerEl.createEl("h2", {text: "Canvas Placer Settings"});

    new Setting(containerEl)
      .setName("Enable content-based height")
      .setDesc("When enabled, note height will be calculated based on ACTUAL content length + media embeds")
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabled)
        .onChange(async (value) => {
          this.plugin.settings.enabled = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("Fixed width")
      .setDesc("Width to use for all notes (pixels)")
      .addSlider(slider => slider
        .setLimits(100, 1000, 10)
        .setValue(this.plugin.settings.defaultWidth)
        .onChange(async (value) => {
          this.plugin.settings.defaultWidth = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("Default height (when disabled)")
      .setDesc("Height to use when content-based height is disabled")
      .addSlider(slider => slider
        .setLimits(50, 1000, 10)
        .setValue(this.plugin.settings.defaultHeight)
        .onChange(async (value) => {
          this.plugin.settings.defaultHeight = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("Minimum height")
      .setDesc("Minimum height for content-based sizing")
      .addSlider(slider => slider
        .setLimits(20, 500, 10)
        .setValue(this.plugin.settings.minHeight)
        .onChange(async (value) => {
          this.plugin.settings.minHeight = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("Maximum height")
      .setDesc("Maximum height for content-based sizing")
      .addSlider(slider => slider
        .setLimits(100, 2000, 20)
        .setValue(this.plugin.settings.maxHeight)
        .onChange(async (value) => {
          this.plugin.settings.maxHeight = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("Padding")
      .setDesc("Extra padding around content (pixels)")
      .addSlider(slider => slider
        .setLimits(0, 100, 5)
        .setValue(this.plugin.settings.padding)
        .onChange(async (value) => {
          this.plugin.settings.padding = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("Media embed height")
      .setDesc("Approximate height for each media embed (photo/video) in pixels")
      .addSlider(slider => slider
        .setLimits(50, 500, 10)
        .setValue(this.plugin.settings.mediaEmbedHeight)
        .onChange(async (value) => {
          this.plugin.settings.mediaEmbedHeight = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("Character height estimate")
      .setDesc("Estimated height per character in pixels (for compatibility - not used in calculation)")
      .addSlider(slider => slider
        .setLimits(8, 32, 2)
        .setValue(this.plugin.settings.charHeightEstimate)
        .onChange(async (value) => {
          this.plugin.settings.charHeightEstimate = value;
          await this.plugin.saveSettings();
        }));
  }
}