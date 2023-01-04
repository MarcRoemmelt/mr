import { derived, get, Writable, writable } from 'svelte/store';
import autoBind from 'auto-bind';

type CursorPosition = {
  lineIndex: number;
  charIndex: number;
  top: `${number}em`;
  left: `${number}px`;
};
class TextEditorStore {
  isSaveModalOpen = writable(false);
  lines = writable<Writable<string>[]>([]);
  showLineNumber = writable(true);
  cursorPosition = writable<CursorPosition>({
    lineIndex: 0,
    charIndex: 0,
    top: '0em',
    left: '0px',
  });
  activeLineIndex = derived(
    this.cursorPosition,
    ($cursorPosition) => $cursorPosition.lineIndex
  );

  constructor() {
    this.addDummyLines();
    autoBind(this);
  }

  handleKeydown(ev: KeyboardEvent) {
    if (get(this.isSaveModalOpen)) return;
    switch (ev.key) {
      case 'Delete':
        return this.handleDelete();
      case 'Backspace':
        return this.handleBackspace();
      case 'ArrowLeft':
        return this.handleArrowLeft();
      case 'ArrowRight':
        return this.handleArrowRight();
      case 'ArrowUp':
        return this.handleArrowUp();
      case 'ArrowDown':
        return this.handleArrowDown();
      default:
    }
  }

  handleKeyPress(ev: KeyboardEvent) {
    if (get(this.isSaveModalOpen)) return;
    switch (ev.key) {
      case 'Enter': {
        this.insertNewLines();
        break;
      }
      default: {
        this.insertCharacters(ev.key);
      }
    }
  }

  setCursor(ev: MouseEvent) {
    const line = (ev.target as HTMLElement).closest('.line');
    if (!line) return;
    const lineIndex = parseInt(line.id.split('-').pop());
    const distanceLeft = ev.offsetX;
    const lineWidthArr = get(get(this.lines).at(lineIndex))
      .split('')
      .map((char, i, arr) => {
        const substring = arr.slice(0, i + 1).join('');
        const el = line.querySelector('.text') as HTMLElement;
        if (!el) throw new Error('TextElement not found');
        const font = this.getCanvasFont(el);
        const metrics = this.getTextMetrics(substring, font);
        return Math.abs(distanceLeft - metrics.width);
      }, []);
    const charIndex = lineWidthArr.reduce(
      // eslint-disable-next-line security/detect-object-injection
      (result, val, i, arr) => (val < arr[result] ? i : result),
      0
    );
    this.updateCursorPosition(() => ({ lineIndex, charIndex: charIndex + 1 }));
  }

  async openFile(data: string) {
    const lines = data.split('\n');
    this.lines.update(() => lines.map((line) => writable(line)));
  }

  async saveFile(fileName: string) {
    const FileSaver = import('file-saver');
    const data = this.getCurrentText();
    const file = new Blob([data], { type: 'text/plain' });
    FileSaver.then(({ saveAs }) => saveAs(file, `${fileName.trim()}.txt`));
  }

  private getCurrentText() {
    const lines = get(this.lines).map((line) => get(line));
    return lines.join('\n');
  }

  addDummyLines() {
    this.lines.update((lines) => [
      ...lines,
      writable('Shopping List:'),
      writable(' - Apples'),
      writable(' - Bananas'),
    ]);
  }
  private handleBackspace() {
    const { lineIndex, charIndex } = get(this.cursorPosition);
    const activeLine = get(this.lines).at(lineIndex);
    if (!activeLine) return;

    const content = get(activeLine);
    const charsBeforeCursor = content.substring(0, charIndex);
    /* Break over to previous line (if previous line exists) */
    if (!charsBeforeCursor && lineIndex > 0) {
      this.moveCursor(-1);
      this.lines.update((lines) => {
        const removedLine = lines.at(lineIndex);
        const prevLine = lines.at(lineIndex - 1);
        const remainingChars = get(removedLine).substring(charIndex);
        lines.splice(lineIndex, 1);
        prevLine.update((text) => `${text}${remainingChars}`);
        return lines;
      });
    } else {
      activeLine.update(
        (text) =>
          `${text.substring(0, charIndex - 1)}${text.substring(charIndex)}`
      );
      this.moveCursor(-1);
    }
  }
  private handleDelete() {
    const { lineIndex, charIndex } = get(this.cursorPosition);
    const lines = get(this.lines);
    const activeLine = lines.at(lineIndex);
    if (!activeLine) return;

    const content = get(activeLine);
    /* Remove the char to the right of the cursor */
    if (content.length > charIndex) {
      activeLine.update(
        (text) =>
          `${text.substring(0, charIndex)}${text.substring(charIndex + 1)}`
      );
      /* Remove the line-break to the right of the cursor */
    } else {
      if (lineIndex === lines.length - 1) return;

      this.lines.update((lines) => {
        const currentLine = lines.at(lineIndex);
        const nextLine = lines.at(lineIndex + 1);
        const nextLineChars = get(nextLine);
        currentLine.update((text) => `${text}${nextLineChars}`);
        lines.splice(lineIndex + 1, 1);
        return lines;
      });
    }
  }
  private handleArrowLeft() {
    this.moveCursor(-1);
  }
  private handleArrowRight() {
    this.moveCursor(1);
  }
  private handleArrowUp() {
    this.moveCursor(0, -1);
  }
  private handleArrowDown() {
    this.moveCursor(0, 1);
  }
  private insertCharacters(
    chars: string,
    position?: { lineIndex: number; charIndex: number }
  ) {
    const { lineIndex, charIndex } = position || get(this.cursorPosition);

    const activeLine = get(this.lines).at(lineIndex);
    if (!activeLine) return;
    activeLine.update(
      (text) =>
        `${text.substring(0, charIndex)}${chars}${text.substring(charIndex)}`
    );
    this.moveCursor(chars.length);
  }
  private insertNewLines(
    num = 1,
    position?: { lineIndex: number; charIndex: number }
  ) {
    const { lineIndex, charIndex } = position || get(this.cursorPosition);
    const newLineIndex = lineIndex + 1;
    const newLines = new Array(num).fill(null).map(() => writable(''));
    this.lines.update((lines) => {
      lines.splice(newLineIndex, 0, ...newLines);
      return lines;
    });

    setTimeout(() => {
      this.moveCursor(0, num);

      this.lines.update((lines) => {
        const slicedLine = lines.at(lineIndex);
        const slicedLineText = get(slicedLine);
        slicedLine.update((text) => `${text.substring(0, charIndex)}`);
        const lastNewLine = lines.at(lineIndex + num);
        lastNewLine.update(() => `${slicedLineText.substring(charIndex)}`);
        return lines;
      });
    });
  }
  private moveCursor(horizontal = 0, vertical = 0) {
    if (horizontal < 0) this.cursorLeft(Math.abs(horizontal));
    if (horizontal > 0) this.cursorRight(horizontal);
    if (vertical < 0) this.cursorUp(Math.abs(vertical));
    if (vertical > 0) this.cursorDown(vertical);
  }
  // eslint-disable-next-line max-lines-per-function
  private cursorLeft(value: number) {
    // eslint-disable-next-line max-lines-per-function
    this.updateCursorPosition(({ charIndex, lineIndex }) => {
      /* Move left in current line */
      if (charIndex >= value) {
        return {
          lineIndex,
          charIndex: charIndex - value,
        };
        /* Break over to previous line */
      } else {
        let prevLineIndex = lineIndex - 1;
        if (prevLineIndex < 0) return { lineIndex: 0, charIndex: 0 };

        let remainder = value - charIndex;
        let charPosInPrevLine = 0;
        while (remainder > 0) {
          /* Decrement remainder since moving up a line counts as character */
          remainder--;

          const prevLine = get(this.lines).at(prevLineIndex);
          if (!prevLine) {
            return { lineIndex: prevLineIndex + 1, charIndex: 0 };
          }

          const charsInPrevLine = get(prevLine).length;
          if (remainder - charsInPrevLine <= 0) {
            charPosInPrevLine = charsInPrevLine - remainder;
          } else {
            remainder = remainder - charsInPrevLine;
            prevLineIndex--;
          }
        }

        return {
          lineIndex: prevLineIndex,
          charIndex: charPosInPrevLine,
        };
      }
    });
  }
  // eslint-disable-next-line max-lines-per-function
  private cursorRight(value: number) {
    // eslint-disable-next-line max-lines-per-function
    this.updateCursorPosition(({ charIndex, lineIndex }) => {
      const lines = get(this.lines);
      const currentLine = lines.at(lineIndex);
      const charsInLine = get(currentLine).length;
      /* Current line has chars to the righ of the cursor */
      if (charIndex + value <= charsInLine) {
        return {
          lineIndex,
          charIndex: charIndex + value,
        };
        /* Go to next line if it exists */
      } else {
        let remainder = charIndex + value - charsInLine;
        let charPosInNextLine = 0;
        let nextLineIndex = lineIndex + 1;

        while (remainder > 0) {
          /* Decrement remainder since line-break counts as a character */
          remainder--;

          const nextLine = lines.at(nextLineIndex);
          if (!nextLine) {
            const line = lines.at(nextLineIndex - 1);
            const charsInLine = get(line).length;
            return { charIndex: charsInLine, lineIndex: nextLineIndex - 1 };
          }

          const charsInNextLine = get(nextLine).length;
          if (remainder - charsInNextLine <= 0) {
            charPosInNextLine = remainder;
          } else {
            remainder = remainder - charsInNextLine;
            nextLineIndex++;
          }
        }

        return {
          lineIndex: nextLineIndex,
          charIndex: charPosInNextLine,
        };
      }
    });
  }
  private cursorUp(value: number) {
    this.updateCursorPosition(({ charIndex, lineIndex }) => {
      if (lineIndex === 0) {
        return {
          lineIndex,
          charIndex: 0,
        };
      } else {
        const prevLine = get(this.lines).at(lineIndex - value);
        if (!prevLine) return { lineIndex: 0, charIndex: 0 };

        const charsInPrevLine = get(prevLine).length;
        return {
          lineIndex: lineIndex - value,
          charIndex: Math.min(charsInPrevLine, charIndex),
        };
      }
    });
  }
  private cursorDown(value: number) {
    this.updateCursorPosition(({ charIndex, lineIndex }) => {
      const lines = get(this.lines);
      const numLines = lines.length;
      const currentLine = lines.at(lineIndex);
      /* Cursor is on the last line => Go to end of line */
      if (lineIndex + value > numLines - 1) {
        return {
          lineIndex,
          charIndex: get(currentLine).length,
        };
        /* There is another line blow => Go to next line on same/last char */
      } else {
        const nextLine = get(this.lines).at(lineIndex + 1);

        if (!nextLine) {
          const lastLine = lines.at(lines.length - 1);
          const lastLineCharNum = get(lastLine).length;
          return { lineIndex: numLines - 1, charIndex: lastLineCharNum };
        }

        const charsInNextLine = get(nextLine).length;
        return {
          lineIndex: lineIndex + value,
          charIndex: Math.min(charsInNextLine, charIndex),
        };
      }
    });
  }
  private updateCursorPosition(
    updater: (
      cursorPosition: CursorPosition
    ) => Pick<CursorPosition, 'charIndex' | 'lineIndex'>
  ) {
    this.cursorPosition.update((cursorPosition) => {
      const { charIndex, lineIndex } = updater(cursorPosition);
      const $line = get(this.lines).at(lineIndex);
      const subLine = get($line)?.substring(0, charIndex) ?? '';
      const lineEl = window.document.querySelector<HTMLElement>(
        `#text-editor-line-${lineIndex} .text`
      );
      const font = this.getCanvasFont(lineEl);
      const metrics = this.getTextMetrics(subLine, font);
      return {
        lineIndex,
        charIndex,
        top: `${lineIndex}em`,
        left: `${Math.ceil(metrics.width) - 1}px`,
      };
    });
  }
  private _canvas: HTMLCanvasElement;
  get canvas() {
    if (!this._canvas) {
      this._canvas = window.document.createElement('canvas');
    }
    return this._canvas;
  }
  private getTextMetrics(text: string, font: string) {
    const context = this.canvas.getContext('2d');
    context.font = font;
    return context.measureText(text);
  }
  private getCssStyle(element: HTMLElement, prop: string) {
    const value = window.getComputedStyle(element, null).getPropertyValue(prop);
    if (value) return value;
    return this.getCssStyle(element.parentElement, prop);
  }

  private getCanvasFont(el: HTMLElement) {
    const fontWeight = this.getCssStyle(el, 'font-weight');
    const fontSize = this.getCssStyle(el, 'font-size');
    const fontFamily = this.getCssStyle(el, 'font-family');

    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }
}
export const textEditorStore = new TextEditorStore();
