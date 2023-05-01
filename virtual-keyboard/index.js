const LANG = {
  'EN': 'en',
  'RU': 'ru',
};

let currentLang = LANG.EN;
let isShiftPressed = false;
let isCapsLockPressed = false;
let isAltPressed = false;

const KEYBOARD_KEY_DATASET = {
  'CODE': 'code',
  'TEXT_EN': 'textEn',
  'TEXT_RU': 'textRu',
  'SHIFT_TEXT_EN': 'shiftTextEn',
  'SHIFT_TEXT_RU': 'shiftTextRu',
}

const KEYBOARD_KEY_CODE = {
  'BACKSPACE': 'Backspace',
  'TAB': 'Tab',
  'DELETE': 'Delete',
  'CAPSLOCK': 'CapsLock',
  'ENTER': 'Enter',
  'SHIFT_LEFT': 'ShiftLeft',
  'SHIFT_RIGHT': 'ShiftRight',
  'CONTROL_LEFT': 'ControlLeft',
  'CONTROL_RIGHT': 'ControlRight',
  'WIN': 'MetaLeft',
  'ALT_LEFT': 'AltLeft',
  'ALT_RIGHT': 'AltRight',
  'ARROW_UP': 'ArrowUp',
  'ARROW_LEFT': 'ArrowLeft',
  'ARROW_DOWN': 'ArrowDown',
  'ARROW_RIGHT': 'ArrowRight',
  'SPACE': 'Space',
};

init();

async function init() {
  try {
    const wrapper = createWrapper();
    const display = createDisplay();

    const keysJson = await getKeysJson();
    const keyboard = createKeyboard(keysJson.keys);

    wrapper.append(display);
    wrapper.append(keyboard);

    document.body.append(wrapper);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    setCursorPosition();
  } catch(err) {
    console.log(err);
  }
}

async function getKeysJson() {
  const response = await fetch('keys.json');

  if (response.status == 200) {
    const keysJson = await response.json();

    return keysJson;
  }

  throw new Error(response.status);
}

function createWrapper() {
  const wrapper = document.createElement('div');

  wrapper.className = 'wrapper';

  return wrapper;
}

function createKeyboard(keys) {
  const keyboard = document.createElement('div');

  keyboard.className = 'keyboard';
  keyboard.append(createKeyboardKeys(keys));

  return keyboard;
}

function createKeyboardKeys(keys) {
  const keyboardKeys = document.createElement('div');

  keyboardKeys.className = 'keyboard__keys';

  keys.forEach(key => {
    keyboardKeys.append(createKeyboardKey(key));
  });

  keyboardKeys.addEventListener('click', handleKeyClick);

  return keyboardKeys;
}

function createKeyboardKey(key) {
  const keyboardKey = document.createElement('button');
  const langText = key['text'];
  const shiftText = key['shiftText'];
  const code = key['code'];

  keyboardKey.className = 'keyboard__key';
  if (code === 'CapsLock' || code === 'Enter' || code === 'ShiftLeft' || code === 'ShiftRight') {
    keyboardKey.classList.add('keyboard__key--large');
  }

  if (code === 'Space') {
    keyboardKey.classList.add('keyboard__key--space');
  }

  if (code === KEYBOARD_KEY_CODE.SHIFT_LEFT || code === KEYBOARD_KEY_CODE.SHIFT_RIGHT) {
    keyboardKey.addEventListener('mousedown', () => {
      isShiftPressed = true;
      updateKeyboardKeyTexts(isShiftPressed, isCapsLockPressed);
    });

    keyboardKey.addEventListener('mouseup', () => {
      isShiftPressed = false;
      updateKeyboardKeyTexts(isShiftPressed, isCapsLockPressed);
    });
  }

  if (code === KEYBOARD_KEY_CODE.ALT_LEFT || code === KEYBOARD_KEY_CODE.ALT_RIGHT) {
    keyboardKey.addEventListener('mousedown', () => {
      isAltPressed = true;
    });

    keyboardKey.addEventListener('mouseup', () => {
      isAltPressed = false;
    });
  }

  keyboardKey.dataset[KEYBOARD_KEY_DATASET.CODE] = code;

  if (typeof langText === 'object') {
    keyboardKey.textContent = langText[currentLang];
    keyboardKey.dataset[KEYBOARD_KEY_DATASET.TEXT_EN] = key['text'][LANG.EN];
    keyboardKey.dataset[KEYBOARD_KEY_DATASET.TEXT_RU] = key['text'][LANG.RU];
  } else {
    keyboardKey.textContent = key['text'];
  }

  if (shiftText) {
    keyboardKey.dataset[KEYBOARD_KEY_DATASET.SHIFT_TEXT_EN] = key['shiftText'][LANG.EN];
    keyboardKey.dataset[KEYBOARD_KEY_DATASET.SHIFT_TEXT_RU] = key['shiftText'][LANG.RU];
  }

  return keyboardKey;
}

function handleKeyDown(event) {
  const keyCode = event.code;
  const keyboardKey = document.querySelector(`[data-code="${keyCode}"`);

  setActiveKeyboardKey(keyboardKey);

  isShiftPressed = event.shiftKey;
  isAltPressed = event.altKey;
  updateKeyboardKeyTexts(isShiftPressed, isCapsLockPressed);
}

function toggleLang() {
  currentLang = currentLang === LANG.EN ? LANG.RU : LANG.EN;
}

function updateKeyboardKeyTexts(isShiftPressed, isCapsLockPressed) {
  const keyboardKeys = document.querySelectorAll(`[data-code]`);

  keyboardKeys.forEach(keyboardKey => {
    const textEn = isShiftPressed ? keyboardKey.dataset[KEYBOARD_KEY_DATASET.SHIFT_TEXT_EN] : keyboardKey.dataset[KEYBOARD_KEY_DATASET.TEXT_EN];
    const textRu = isShiftPressed ? keyboardKey.dataset[KEYBOARD_KEY_DATASET.SHIFT_TEXT_RU] : keyboardKey.dataset[KEYBOARD_KEY_DATASET.TEXT_RU];

    let text = currentLang === LANG.EN ? textEn : textRu;
    if (isCapsLockPressed && isLetter(text)) {
      text = isShiftPressed ? text.toLowerCase() : text.toUpperCase();
    }

    keyboardKey.textContent = text;
  });
}

function setActiveKeyboardKey(keyboardKey) {
  keyboardKey.classList.add('keyboard__key--active');
}

function handleKeyUp(event) {
  const keyCode = event.code;
  const keyboardKey = document.querySelector(`[data-code="${keyCode}"`);

  handleKeyboardKey(keyboardKey);

  setInactiveKeyboardKey(keyboardKey);

  isShiftPressed = event.shiftKey;
  isAltPressed = event.altKey;
  updateKeyboardKeyTexts(isShiftPressed, isCapsLockPressed);
}

function setInactiveKeyboardKey(keyboardKey) {
  keyboardKey.classList.remove('keyboard__key--active');
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-zA-Zа-яА-Я]/i);
}

function createDisplay() {
  const displayWrapper = document.createElement('div');
  const displayTextarea = document.createElement('textarea');

  displayWrapper.className = 'display';
  displayTextarea.className = 'display__textarea';

  displayTextarea.rows = 10;
  displayTextarea.cols = 20;

  displayWrapper.append(displayTextarea);

  return displayWrapper;
}

function handleKeyClick(event) {
  const keyboardKey = event.target;
  const isKeyboardKey = keyboardKey.classList.contains('keyboard__key');

  if (isKeyboardKey) {
    handleKeyboardKey(keyboardKey);
  }
}

function handleKeyboardKey(keyboardKey) {
  const textarea = document.querySelector('.display__textarea');
  const textareaStartPosition = textarea.selectionStart;
  const textareaEndPosition = textarea.selectionEnd;

  const code = keyboardKey.dataset[KEYBOARD_KEY_DATASET.CODE];
  let value = keyboardKey.textContent;

  if (!Object.values(KEYBOARD_KEY_CODE).includes(code)) {
    textarea.value = addSymbol(textarea.value, value, textareaStartPosition, textareaEndPosition);
    setCursorPosition(textareaStartPosition + 1);
  } else {
    switch (code) {
      case KEYBOARD_KEY_CODE.BACKSPACE:
        const newTextareaStartPosition = textareaStartPosition === textareaEndPosition ? textareaStartPosition - 1 : textareaStartPosition;
        textarea.value = removeSymbol(textarea.value, newTextareaStartPosition, textareaEndPosition);
        setCursorPosition(newTextareaStartPosition);
        break;
      case KEYBOARD_KEY_CODE.TAB:
        textarea.value = addSymbol(textarea.value, '\t', textareaStartPosition, textareaEndPosition);
        setCursorPosition(textareaStartPosition + 1);
        break;
      case KEYBOARD_KEY_CODE.DELETE:
        const newTextareaEndPosition = textareaStartPosition === textareaEndPosition ? textareaEndPosition + 1 : textareaEndPosition;
        textarea.value = removeSymbol(textarea.value, textareaStartPosition, newTextareaEndPosition);
        setCursorPosition(textareaStartPosition);
        break;
      case KEYBOARD_KEY_CODE.ENTER:
        textarea.value = addSymbol(textarea.value, '\n', textareaStartPosition, textareaEndPosition);
        setCursorPosition(textareaStartPosition + 1);
        break;
      case KEYBOARD_KEY_CODE.CAPSLOCK:
        isCapsLockPressed = !isCapsLockPressed;
        break;
      case KEYBOARD_KEY_CODE.SPACE:
        textarea.value = addSymbol(textarea.value, ' ', textareaStartPosition, textareaEndPosition);
        setCursorPosition(textareaStartPosition + 1);
        break;
      case KEYBOARD_KEY_CODE.ARROW_LEFT:
        setCursorPosition(textareaStartPosition - 1);
        break;
      case KEYBOARD_KEY_CODE.ARROW_RIGHT:
        setCursorPosition(textareaStartPosition + 1);
        break;
      case KEYBOARD_KEY_CODE.ARROW_UP:
        const enterLastPosition = textarea.value.lastIndexOf('\n', textareaStartPosition - 1);
        setCursorPosition(enterLastPosition !== - 1 ? enterLastPosition : 0);
        break;
      case KEYBOARD_KEY_CODE.ARROW_DOWN:
        const enterFirstPosition = textarea.value.indexOf('\n', textareaEndPosition + 1);
        setCursorPosition(enterFirstPosition !== - 1 ? enterFirstPosition + 1 : textarea.value.length);
        break;
      case KEYBOARD_KEY_CODE.SHIFT_LEFT:
      case KEYBOARD_KEY_CODE.SHIFT_RIGHT:
        isShiftPressed = true;
        break;
      case KEYBOARD_KEY_CODE.ALT_LEFT:
      case KEYBOARD_KEY_CODE.ALT_RIGHT:
        isAltPressed = true;
        break;
      default:
        setCursorPosition();
    }

    if (isShiftPressed && isAltPressed) {
      toggleLang();
      updateKeyboardKeyTexts(isShiftPressed, isCapsLockPressed);
    }
  }
}

function addSymbol(str, symbol, start, end) {
  return str.slice(0, start) + symbol + str.slice(end);
}

function removeSymbol(str, start, end) {
  return str.slice(0, start) + str.slice(end);
}

function setCursorPosition(position) {
  const textarea = document.querySelector('.display__textarea');

  const end = textarea.value.length;
  position = position !== undefined ? position : end;
  position = position < 0 ? 0 : position;

  textarea.setSelectionRange(position, position);
  textarea.focus();
}

function removeSymbolOnRight(str, position) {
  return str.slice(0, position) + str.slice(position + 1);
}

