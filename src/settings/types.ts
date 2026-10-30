export interface CanvasPlacerSettings {
  enabled: boolean;
  defaultWidth: number;
  defaultHeight: number;
  minHeight: number;
  maxHeight: number;
  padding: number;
  charHeightEstimate: number; // Kept for compatibility but unused
  mediaEmbedHeight: number;   // Height per media embed in pixels
}

export const DEFAULT_SETTINGS: CanvasPlacerSettings = {
  enabled: false,
  defaultWidth: 400,
  defaultHeight: 300,
  minHeight: 100,
  maxHeight: 800,
  padding: 20,
  charHeightEstimate: 16,
  mediaEmbedHeight: 200 // Default height assumption for each media embed
};