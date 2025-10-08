import { useState, useEffect, useRef } from "react";
import "./App.css";
import FONT_5x7 from "./font_5x7";
import {
  maskingAlgorithms,
  defaultAlgorithm,
  MaskingGrid,
  MaskingAlgorithm,
} from "./maskingAlgorithms";

const INTERVAL_TIME = 20;

function App() {
  const [inputText, setInputText] = useState("HELLO, WORLD!");
  const [displayText, setDisplayText] = useState("HELLO, WORLD!");
  const [currentMaskingGrid, setCurrentMaskingGrid] = useState<MaskingGrid>({
    dynamicGrid: [],
    staticGrid: [],
  });
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<MaskingAlgorithm>(defaultAlgorithm);
  const intervalRef = useRef<number | null>(null);

  const handleConfirm = () => {
    setDisplayText(inputText.toUpperCase());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  const updateMaskingGrid = () => {
    if (displayText) {
      const newDynamicGrid = selectedAlgorithm.updateDynamicMasking(
        displayText,
        currentMaskingGrid
      );
      setCurrentMaskingGrid((prev) => ({
        ...prev,
        dynamicGrid: newDynamicGrid,
      }));
    }
  };

  useEffect(() => {
    if (displayText) {
      const initialMaskingGrid = selectedAlgorithm.generateMasking(displayText);
      setCurrentMaskingGrid(initialMaskingGrid);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(updateMaskingGrid, INTERVAL_TIME);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setCurrentMaskingGrid({ dynamicGrid: [], staticGrid: [] });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [displayText, selectedAlgorithm]);

  const renderPixelText = (text: string) => {
    if (!text) return null;

    const lines: string[] = [];
    const chars = text.split("");

    for (let row = 0; row < 9; row++) {
      let line = "";
      let colIndex = 0;

      chars.forEach((char, charIndex) => {
        let fontData = FONT_5x7[char as keyof typeof FONT_5x7];

        if (!fontData) {
          fontData = FONT_5x7["?"];
        }

        for (let col = 0; col < 7; col++) {
          let isCharacterPixel = false;

          if (col >= 1 && col <= 5 && row >= 1 && row <= 7) {
            const fontRow = row - 1;
            const fontCol = col - 1;
            if (
              fontData &&
              fontData[fontRow] &&
              fontData[fontRow][fontCol] === 1
            ) {
              isCharacterPixel = true;
            }
          }

          if (isCharacterPixel) {
            const maskingChar =
              currentMaskingGrid.dynamicGrid[row] &&
              currentMaskingGrid.dynamicGrid[row][colIndex]
                ? currentMaskingGrid.dynamicGrid[row][colIndex]
                : "?";
            line += maskingChar;
          } else {
            const fixedMaskingChar =
              currentMaskingGrid.staticGrid[row] &&
              currentMaskingGrid.staticGrid[row][colIndex]
                ? currentMaskingGrid.staticGrid[row][colIndex]
                : "?";
            line += fixedMaskingChar;
          }
          colIndex++;
        }

        if (charIndex < chars.length - 1) {
          const fixedMaskingChar =
            currentMaskingGrid.staticGrid[row] &&
            currentMaskingGrid.staticGrid[row][colIndex]
              ? currentMaskingGrid.staticGrid[row][colIndex]
              : "?";
          line += fixedMaskingChar;
          colIndex++;
        }
      });

      lines.push(line);
    }

    return (
      <div className="pixel-text">
        {lines.map((line, index) => (
          <div key={index} className="text-line">
            {line}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app">
      <div className="input-section">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter text"
          className="text-input"
        />
        <button onClick={handleConfirm} className="confirm-button">
          Confirm
        </button>
      </div>

      <div className="algorithm-section">
        <label htmlFor="algorithm-select">Masking Algorithm: </label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm.name}
          onChange={(e) => {
            const algorithm = maskingAlgorithms.find(
              (alg) => alg.name === e.target.value
            );
            if (algorithm) {
              setSelectedAlgorithm(algorithm);
            }
          }}
          className="algorithm-select"
        >
          {maskingAlgorithms.map((algorithm) => (
            <option key={algorithm.name} value={algorithm.name}>
              {algorithm.name} - {algorithm.description}
            </option>
          ))}
        </select>
      </div>

      <div className="display-section">{renderPixelText(displayText)}</div>
    </div>
  );
}

export default App;
