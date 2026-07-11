const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "src", "assets");
const files = fs.readdirSync(assetsDir);
let imports = "";
let mapEntries = [];

files.forEach((file) => {
  if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    if (file === "hero-banner.jpg") return; // Skip banner
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    // Convert base to CamelCase for variable name
    const varName = base.replace(/[^a-zA-Z0-9]/g, "") + "Img";
    imports += `import ${varName} from "@/assets/${file}";\n`;

    // Capitalize first letter for word key, handle special cases
    let wordKey = base.charAt(0).toUpperCase() + base.slice(1);
    if (base === "icecream") wordKey = "Ice cream";
    if (base === "xmas tree") wordKey = "Xmas tree";
    if (base === "xray") wordKey = "X-ray";
    if (base === "yoyo") wordKey = "Yo-yo";

    mapEntries.push(`  "${wordKey}": ${varName},`);
  }
});

const fileContent = `${imports}\nexport const IMG_MAP: Record<string, string> = {\n${mapEntries.join("\n")}\n};\n`;

fs.writeFileSync(path.join(__dirname, "src", "lib", "images.ts"), fileContent);
console.log("Successfully generated src/lib/images.ts");
