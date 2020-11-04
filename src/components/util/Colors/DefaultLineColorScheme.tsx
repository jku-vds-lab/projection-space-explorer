import { SchemeColor } from "./SchemeColor";
import { ColorScheme } from "./ColorScheme";








export class DefaultLineColorScheme extends ColorScheme {
  constructor() {
    super([
      new SchemeColor("#1b9e77"),
      new SchemeColor("#d95f02"),
      new SchemeColor("#7570b3"),
      new SchemeColor("#e7298a"),
      new SchemeColor("#66a61e"),
      new SchemeColor("#e6ab02"),
      new SchemeColor("#a6761d"),
      new SchemeColor("#666666")
    ]);
  }
}
