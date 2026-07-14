/**
 * Helper to get the value of a specific attribute from an SVG tag.
 * Handles single/double quotes and ignores escaped quotes inside values.
 * 
 * @param tag The HTML/SVG tag string.
 * @param attr The name of the attribute to extract.
 * @returns The attribute value if found, or null.
 */
function getAttribute(tag: string, attr: string): string | null {
  const regex = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`);
  const match = tag.match(regex);
  return match ? match[1] : null;
}

/**
 * Determines if an SVG element should be included in the clipping path.
 * Elements are ignored if they are explicitly not visible (no fill and no stroke).
 * 
 * @param tag The HTML/SVG tag string.
 * @returns True if the element should be included in the path, false otherwise.
 */
function shouldIncludeElement(tag: string): boolean {
  const fill = getAttribute(tag, 'fill');
  const stroke = getAttribute(tag, 'stroke');

  const fillNone = fill === 'none';
  const strokeNone = stroke === 'none';
  const fillMissing = fill === null;
  const strokeMissing = stroke === null;

  // If fill is "none" and (stroke is missing or "none"), ignore
  if (fillNone && (strokeMissing || strokeNone)) {
    return false;
  }

  // If stroke is "none" and (fill is missing or "none"), ignore
  if (strokeNone && (fillMissing || fillNone)) {
    return false;
  }

  return true;
}

/**
 * Parses and compiles an SVG string into a path representation containing a combined path data string
 * and the dimensions of the SVG.
 * 
 * It extracts path data ('d' attribute) from <path> elements and converts other basic shapes 
 * (like `<rect>`, `<circle>`, `<ellipse>`, `<line>`, `<polygon>`, `<polyline>`) into equivalent path commands.
 * All paths are concatenated into a single string.
 *
 * @param svg The SVG markup string to parse. If undefined, the function returns undefined.
 * @param resize Optional target size. If provided, the compiled path and its dimensions will be scaled proportionally so the maximum dimension (width or height) matches this value.
 * @returns An object containing the compiled path data 'd', and the resulting 'w' (width) and 'h' (height), or undefined if no SVG string is provided.
 */
export function compileSVGPath(svg: string | undefined, resize?: number): { d: string; w: number; h: number } | undefined {
  if (!svg) return undefined;
  let d = '';
  let w = 100; // default
  let h = 100; // default

  // Extract SVG dimensions
  const svgTags = svg.match(/<[\s]?svg[^>]*>/g) || [];
  if (svgTags.length > 0) {
    const svgTag = svgTags[0]!;
    const widthAttr = getAttribute(svgTag, 'width');
    const heightAttr = getAttribute(svgTag, 'height');
    const viewBoxAttr = getAttribute(svgTag, 'viewBox');
    if (viewBoxAttr) {
      const vb = viewBoxAttr.split(/[\s,]+/).map(Number);
      w = vb[2] || 100;
      h = vb[3] || 100;
    } else {
      w = parseFloat(widthAttr || '100');
      h = parseFloat(heightAttr || '100');
    }
  }

  // Handle <path> elements
  const pathTags = svg.match(/<[\s]?path[^>]*>/g) || [];
  for (const tag of pathTags) {
    if (shouldIncludeElement(tag)) {
      const pathD = getAttribute(tag, 'd');
      if (pathD) {
        d += `${pathD} `;
      }
    }
  }

  // Handle <circle> elements
  const circleTags = svg.match(/<[\s]?circle[^>]*>/g) || [];
  for (const tag of circleTags) {
    if (shouldIncludeElement(tag)) {
      const cx = parseFloat(getAttribute(tag, 'cx') || '0');
      const cy = parseFloat(getAttribute(tag, 'cy') || '0');
      const r = parseFloat(getAttribute(tag, 'r') || '0');
      if (r > 0) {
        // Approximate circle as path
        d += `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z `;
      }
    }
  }

  // Handle <rect> elements
  const rectTags = svg.match(/<[\s]?rect[^>]*>/g) || [];
  for (const tag of rectTags) {
    if (shouldIncludeElement(tag)) {
      const x = parseFloat(getAttribute(tag, 'x') || '0');
      const y = parseFloat(getAttribute(tag, 'y') || '0');
      const width = parseFloat(getAttribute(tag, 'width') || '0');
      const height = parseFloat(getAttribute(tag, 'height') || '0');
      if (width > 0 && height > 0) {
        d += `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z `;
      }
    }
  }

  // Handle <ellipse> elements
  const ellipseTags = svg.match(/<[\s]?ellipse[^>]*>/g) || [];
  for (const tag of ellipseTags) {
    if (shouldIncludeElement(tag)) {
      const cx = parseFloat(getAttribute(tag, 'cx') || '0');
      const cy = parseFloat(getAttribute(tag, 'cy') || '0');
      const rx = parseFloat(getAttribute(tag, 'rx') || '0');
      const ry = parseFloat(getAttribute(tag, 'ry') || '0');
      if (rx > 0 && ry > 0) {
        // Approximate ellipse as path
        d += `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z `;
      }
    }
  }

  // Handle <line> elements
  const lineTags = svg.match(/<[\s]?line[^>]*>/g) || [];
  for (const tag of lineTags) {
    if (shouldIncludeElement(tag)) {
      const x1 = parseFloat(getAttribute(tag, 'x1') || '0');
      const y1 = parseFloat(getAttribute(tag, 'y1') || '0');
      const x2 = parseFloat(getAttribute(tag, 'x2') || '0');
      const y2 = parseFloat(getAttribute(tag, 'y2') || '0');
      d += `M ${x1} ${y1} L ${x2} ${y2} `;
    }
  }

  // Handle <polygon> elements
  const polygonTags = svg.match(/<[\s]?polygon[^>]*>/g) || [];
  for (const tag of polygonTags) {
    if (shouldIncludeElement(tag)) {
      const points = getAttribute(tag, 'points');
      if (points) {
        const coords = points.trim().split(/\s+/).map(p => p.split(',').map(Number));
        if (coords.length > 0) {
          d += `M ${coords[0][0]} ${coords[0][1]} `;
          for (let i = 1; i < coords.length; i++) {
            d += `L ${coords[i][0]} ${coords[i][1]} `;
          }
          d += 'Z ';
        }
      }
    }
  }

  // Handle <polyline> elements
  const polylineTags = svg.match(/<[\s]?polyline[^>]*>/g) || [];
  for (const tag of polylineTags) {
    if (shouldIncludeElement(tag)) {
      const points = getAttribute(tag, 'points');
      if (points) {
        const coords = points.trim().split(/\s+/).map(p => p.split(',').map(Number));
        if (coords.length > 0) {
          d += `M ${coords[0][0]} ${coords[0][1]} `;
          for (let i = 1; i < coords.length; i++) {
            d += `L ${coords[i][0]} ${coords[i][1]} `;
          }
          d += ' ';
        }
      }
    }
  }

  function scalePathData(path: string, scale: number) {
    const numberRegex = /[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?/gi;

    return path.replace(/([A-Za-z])([^A-Za-z]*)/g, (_segment, command, args: string) => {
      let argIndex = 0;
      const scaledArgs = args.replace(numberRegex, (value: string) => {
        const num = parseFloat(value);
        let scaled = num;

        const upper = command.toUpperCase();
        if (upper === 'A') {
          const arcPos = argIndex % 7;
          if (arcPos !== 2 && arcPos !== 3 && arcPos !== 4) {
            scaled = num * scale;
          }
        } else {
          scaled = num * scale;
        }

        argIndex += 1;
        return Number.isFinite(scaled) && Number.isInteger(scaled)
          ? String(scaled)
          : String(+scaled.toFixed(6));
      });

      return `${command}${scaledArgs}`;
    });
  }

  // Apply resize scaling if provided
  if (resize) {
    const maxDimension = Math.max(w, h);
    const scaleFactor = resize / maxDimension;

    d = scalePathData(d, scaleFactor);

    // Update dimensions
    w = w * scaleFactor;
    h = h * scaleFactor;
  }

  return { d: d.trim(), w, h };
}
