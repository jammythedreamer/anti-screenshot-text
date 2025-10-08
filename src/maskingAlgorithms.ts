const MASKING_CHARS = ["!", "?", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

export interface MaskingGrid {
  dynamicGrid: string[][];
  staticGrid: string[][];
}

export interface MaskingAlgorithm {
  name: string;
  description: string;
  generateMasking: (text: string) => MaskingGrid;
  updateDynamicMasking: (text: string, currentGrid: MaskingGrid) => string[][];
}

const getRandomMaskingChar = (): string => {
  return MASKING_CHARS[Math.floor(Math.random() * MASKING_CHARS.length)];
};

const calculateGridSize = (text: string) => {
  const chars = text.split("");
  const totalWidth =
    chars.length > 0 ? chars.length * 7 + (chars.length - 1) : 0;
  return { width: totalWidth, height: 9 };
};

const randomAlgorithm: MaskingAlgorithm = {
  name: "Random",
  description: "Completely random character selection at all positions",

  generateMasking: (text: string): MaskingGrid => {
    if (!text) return { dynamicGrid: [], staticGrid: [] };

    const { width, height } = calculateGridSize(text);
    const dynamicGrid: string[][] = [];
    const staticGrid: string[][] = [];

    for (let row = 0; row < height; row++) {
      const dynamicRow: string[] = [];
      const staticRow: string[] = [];

      for (let col = 0; col < width; col++) {
        dynamicRow.push(getRandomMaskingChar());
        staticRow.push(getRandomMaskingChar());
      }

      dynamicGrid.push(dynamicRow);
      staticGrid.push(staticRow);
    }

    return { dynamicGrid, staticGrid };
  },

  updateDynamicMasking: (text: string): string[][] => {
    if (!text) return [];

    const { width, height } = calculateGridSize(text);
    const grid: string[][] = [];

    for (let row = 0; row < height; row++) {
      const rowMasks: string[] = [];
      for (let col = 0; col < width; col++) {
        rowMasks.push(getRandomMaskingChar());
      }
      grid.push(rowMasks);
    }

    return grid;
  },
};

const waveAlgorithm: MaskingAlgorithm = {
  name: "Wave",
  description: "Characters change in wave patterns over time",

  generateMasking: (text: string): MaskingGrid => {
    if (!text) return { dynamicGrid: [], staticGrid: [] };

    const { width, height } = calculateGridSize(text);
    const dynamicGrid: string[][] = [];
    const staticGrid: string[][] = [];

    for (let row = 0; row < height; row++) {
      const dynamicRow: string[] = [];
      const staticRow: string[] = [];

      for (let col = 0; col < width; col++) {
        const waveIndex =
          Math.floor(
            ((Math.sin(col * 0.3 + row * 0.2) + 1) * MASKING_CHARS.length) / 2
          ) % MASKING_CHARS.length;
        dynamicRow.push(MASKING_CHARS[waveIndex]);

        staticRow.push(getRandomMaskingChar());
      }

      dynamicGrid.push(dynamicRow);
      staticGrid.push(staticRow);
    }

    return { dynamicGrid, staticGrid };
  },

  updateDynamicMasking: (text: string): string[][] => {
    if (!text) return [];

    const { width, height } = calculateGridSize(text);
    const grid: string[][] = [];
    const time = Date.now() * 0.01;

    for (let row = 0; row < height; row++) {
      const rowMasks: string[] = [];
      for (let col = 0; col < width; col++) {
        const waveIndex =
          Math.floor(
            ((Math.sin(col * 0.3 + row * 0.2 + time) + 1) *
              MASKING_CHARS.length) /
              2
          ) % MASKING_CHARS.length;
        rowMasks.push(MASKING_CHARS[waveIndex]);
      }
      grid.push(rowMasks);
    }

    return grid;
  },
};

const blockAlgorithm: MaskingAlgorithm = {
  name: "Block",
  description: "Generate patterns using same characters in block units",

  generateMasking: (text: string): MaskingGrid => {
    if (!text) return { dynamicGrid: [], staticGrid: [] };

    const { width, height } = calculateGridSize(text);
    const dynamicGrid: string[][] = [];
    const staticGrid: string[][] = [];
    const blockSize = 4;

    for (let row = 0; row < height; row++) {
      const dynamicRow: string[] = [];
      const staticRow: string[] = [];

      for (let col = 0; col < width; col++) {
        const blockRow = Math.floor(row / blockSize);
        const blockCol = Math.floor(col / blockSize);
        const dynamicIndex = (blockRow + blockCol) % MASKING_CHARS.length;
        dynamicRow.push(MASKING_CHARS[dynamicIndex]);

        const staticIndex =
          (blockRow * 2 + blockCol * 3) % MASKING_CHARS.length;
        staticRow.push(MASKING_CHARS[staticIndex]);
      }

      dynamicGrid.push(dynamicRow);
      staticGrid.push(staticRow);
    }

    return { dynamicGrid, staticGrid };
  },

  updateDynamicMasking: (text: string): string[][] => {
    if (!text) return [];

    const { width, height } = calculateGridSize(text);
    const grid: string[][] = [];
    const blockSize = 4;
    const timeOffset = Math.floor(Date.now() / 200) % MASKING_CHARS.length;

    for (let row = 0; row < height; row++) {
      const rowMasks: string[] = [];
      for (let col = 0; col < width; col++) {
        const blockRow = Math.floor(row / blockSize);
        const blockCol = Math.floor(col / blockSize);
        const index = (blockRow + blockCol + timeOffset) % MASKING_CHARS.length;
        rowMasks.push(MASKING_CHARS[index]);
      }
      grid.push(rowMasks);
    }

    return grid;
  },
};

export const maskingAlgorithms: MaskingAlgorithm[] = [
  randomAlgorithm,
  waveAlgorithm,
  blockAlgorithm,
];

export const defaultAlgorithm = randomAlgorithm;
