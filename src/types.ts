/**
 * Configuration representing a custom typeface font to be loaded and registered.
 */
export interface Font {
  /** The URL or local path to load the font file (e.g. '.ttf', '.woff2'). */
  url: string;
  /** The family name that will reference this font in text layers. */
  name: string;
}

/**
 * Key-value mapping representing template variables used for dynamic string interpolation.
 */
export type FilterText = Record<string, string | undefined>;

/**
 * Universal canvas rendering template containing dimensions, options, and layers.
 */
export interface Templete {
  /** The version of the template format (currently only '1' is supported). */
  version: '1';
  /** The width of the canvas in pixels. */
  w: number;
  /** The height of the canvas in pixels. */
  h: number;
  /** List of layers (shapes, texts, images) to render sequentially on the canvas. */
  layers: Layer[];
  /** Optional background color of the canvas (CSS color value). */
  backgroundColor?: string;
  /** Optional reference to a layer ID from which to extract dynamic color palettes. */
  layerColor?: string;
}

/**
 * Union type representing any kind of layer that can be drawn on the canvas.
 */
export type Layer = ShapeLayer | TextLayer;

/**
 * Configuration schema for a shape or image layer.
 */
export interface ShapeLayer {
  /** Unique identifier for the layer, used for references in filters and dynamic color generation. */
  id: string;
  /** Specifies that this is a shape or image layer. */
  type: 'shape';
  /** X-coordinate position of the shape's top-left corner in pixels. */
  x: number;
  /** Y-coordinate position of the shape's top-left corner in pixels. */
  y: number;
  /** Width of the shape layer in pixels. */
  w: number;
  /** Height of the shape layer in pixels. */
  h: number;
  /**
   * The fill color of the shape (e.g., HEX, RGBA, HSL, or 'auto').
   * If set to 'auto', it inherits the dynamically extracted palette color.
   */
  color: string;
  /** Optional URL or path of the image to render. If omitted, the layer is drawn as a colored shape. */
  image?: string;
  /** Proportional scale of the image (default is 1). Only applies when an image is defined. */
  scale?: number;
  /**
   * Layout fitting mode for the image within the layer bounds.
   * - `cover`: Scales image to fill bounds, cropping if necessary.
   * - `contain`: Scales image to fit completely within bounds, showing letterboxing if aspect ratios differ.
   * - `fill`: Stretches the image to exactly match the width and height.
   */
  objectFit?: 'cover' | 'contain' | 'fill';
  /** Rotation angle of the layer in degrees clockwise (default is 0). */
  rotation?: number;
  /** Optional SVG string used as a clipping mask. Only path and basic shape elements are processed. */
  svg?: string;
  /** Alignment of the clipping mask within the shape boundaries (e.g., 'center center', 'top left'). */
  align?: `${'top' | 'bottom' | 'center'} ${'left' | 'right' | 'center'}`;
  /** Optional CSS filter effects (e.g. blur, contrast) applied to this layer. */
  filter?: Filter;
}

/**
 * Configuration schema for a text layer.
 */
export interface TextLayer {
  /** Unique identifier for the layer, used for referencing. */
  id: string;
  /** Specifies that this is a text layer. */
  type: 'text';
  /** The text content to display. Supports variable interpolation using double curly braces (e.g. `{{name}}`). */
  text: string;
  /** X-coordinate position of the text alignment anchor. */
  x: number;
  /** Y-coordinate position of the text baseline anchor. */
  y: number;
  /**
   * The text fill color (e.g., HEX, RGBA, HSL, or 'auto').
   * If set to 'auto', it inherits the dynamically extracted palette color.
   */
  color: string;
  /** Optional maximum width in pixels. Text exceeding this width will wrap to a new line. */
  maxWidth?: number;
  /** Line height in pixels, used for spacing multi-line wrapped text. */
  lineHeight?: number;
  /** Rotation angle of the text layer in degrees clockwise (default is 0). */
  rotation?: number;
  /** Font size of the text in pixels. */
  fontSize?: number;
  /** Font family name. Ensure custom web/file fonts are loaded via `setFonts` beforehand. */
  fontFamily?: string;
  /** Font weight (e.g., 'normal', 'bold', or numeric weights like '300', '700'). */
  fontWeight?: string;
  /** Optional outline/stroke color for the text characters. */
  strokeColor?: string;
  /** Optional outline/stroke width in pixels. */
  strokeWidth?: number;
  /** Horizontal text alignment relative to the anchor coordinate. */
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
  /** Vertical text baseline alignment relative to the anchor coordinate. */
  textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
  /** Optional CSS filter effects applied to this text layer. */
  filter?: Filter;
}

/**
 * CSS-equivalent filters that can be applied to canvas layers.
 */
export interface Filter {
  /** Blur radius (e.g. '5px'). */
  blur?: string;
  /** Brightness multiplier or percentage (e.g. '1.5' or '150%'). */
  brightness?: string;
  /** Contrast multiplier or percentage (e.g. '2' or '200%'). */
  contrast?: string;
  /** Grayscale conversion factor (e.g. '1' or '100%'). */
  grayscale?: string;
  /** Hue rotation angle (e.g. '90deg'). */
  'hue-rotate'?: string;
  /** Inversion factor (e.g. '1' or '100%'). */
  invert?: string;
  /** Opacity factor (e.g. '0.5' or '50%'). */
  opacity?: string;
  /** Saturation factor (e.g. '2' or '200%'). */
  saturate?: string;
  /** Drop shadow description (e.g. '10px 10px 5px rgba(0,0,0,0.5)'). */
  'drop-shadow'?: string;
  /** Sepia conversion factor (e.g. '1' or '100%'). */
  sepia?: string;
}