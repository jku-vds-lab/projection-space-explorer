






export class SchemeColor {
  hex: string;
  rgb: { r; g; b; };

  constructor(hex) {
    this.hex = hex;
    this.rgb = this.hexToRgb(this.hex);
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }



  static componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static rgbToHex(r, g, b) {
    return new SchemeColor("#" + SchemeColor.componentToHex(r) + SchemeColor.componentToHex(g) + SchemeColor.componentToHex(b));
  }
}
