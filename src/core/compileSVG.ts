/**
 * Compiles an SVG string into a clip object with combined path 'd' attribute, width, and height.
 * Extracts 'd' from <path> elements and converts other shapes like <circle>, <rect> to path 'd'.
 * Combines multiple paths into a single string.
 * Returns an object compatible with Shape.clip.
 */
function getAttribute(tag: string, attr: string): string | null {
  const regex = new RegExp(`${attr}="([^"]*)"`);
  const match = tag.match(regex);
  return match ? match[1] : null;
}

export default function compileSVG(svg: string): { d: string; w: number; h: number } {
  let d = '';
  let w = 100; // default
  let h = 100; // default

  // Extract SVG dimensions
  const svgTags = svg.match(/<svg[^>]*>/g) || [];
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
  const pathTags = svg.match(/<path[^>]*>/g) || [];
  for (const tag of pathTags) {
    const pathD = getAttribute(tag, 'd');
    if (pathD) {
      d += pathD + ' ';
    }
  }

  // Handle <circle> elements
  const circleTags = svg.match(/<circle[^>]*>/g) || [];
  for (const tag of circleTags) {
    const cx = parseFloat(getAttribute(tag, 'cx') || '0');
    const cy = parseFloat(getAttribute(tag, 'cy') || '0');
    const r = parseFloat(getAttribute(tag, 'r') || '0');
    if (r > 0) {
      // Approximate circle as path
      d += `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z `;
    }
  }

  // Handle <rect> elements
  const rectTags = svg.match(/<rect[^>]*>/g) || [];
  for (const tag of rectTags) {
    const x = parseFloat(getAttribute(tag, 'x') || '0');
    const y = parseFloat(getAttribute(tag, 'y') || '0');
    const width = parseFloat(getAttribute(tag, 'width') || '0');
    const height = parseFloat(getAttribute(tag, 'height') || '0');
    if (width > 0 && height > 0) {
      d += `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z `;
    }
  }

  // Handle <ellipse> elements
  const ellipseTags = svg.match(/<ellipse[^>]*>/g) || [];
  for (const tag of ellipseTags) {
    const cx = parseFloat(getAttribute(tag, 'cx') || '0');
    const cy = parseFloat(getAttribute(tag, 'cy') || '0');
    const rx = parseFloat(getAttribute(tag, 'rx') || '0');
    const ry = parseFloat(getAttribute(tag, 'ry') || '0');
    if (rx > 0 && ry > 0) {
      // Approximate ellipse as path
      d += `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z `;
    }
  }

  // Handle <line> elements
  const lineTags = svg.match(/<line[^>]*>/g) || [];
  for (const tag of lineTags) {
    const x1 = parseFloat(getAttribute(tag, 'x1') || '0');
    const y1 = parseFloat(getAttribute(tag, 'y1') || '0');
    const x2 = parseFloat(getAttribute(tag, 'x2') || '0');
    const y2 = parseFloat(getAttribute(tag, 'y2') || '0');
    d += `M ${x1} ${y1} L ${x2} ${y2} `;
  }

  // Handle <polygon> elements
  const polygonTags = svg.match(/<polygon[^>]*>/g) || [];
  for (const tag of polygonTags) {
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

  // Handle <polyline> elements
  const polylineTags = svg.match(/<polyline[^>]*>/g) || [];
  for (const tag of polylineTags) {
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

  return { d: d.trim(), w, h };
}
