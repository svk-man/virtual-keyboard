const LANG = {
  'EN': 'en',
  'RU': 'ru',
};

let currentLang = LANG.EN;
let isCapsLockPressed = false;

const KEYBOARD_KEY_DATASET = {
  'CODE': 'code',
  'TEXT_EN': 'textEn',
  'TEXT_RU': 'textRu',
  'SHIFT_TEXT_EN': 'shiftTextEn',
  'SHIFT_TEXT_RU': 'shiftTextRu',
}

showKeyboard();

async function showKeyboard() {
  try {
    const keysJson = await getKeysJson();
    const keyboardWrapper = createKeyboardWrapper();
    const keyboard = createKeyboard(keysJson.keys);

    keyboardWrapper.append(keyboard);
    document.body.append(keyboardWrapper);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
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

function createKeyboardWrapper() {
  const keyboardWrapper = document.createElement('div');

  keyboardWrapper.className = 'wrapper';

  return keyboardWrapper;
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

  updateKeyboardKeyTexts(event.shiftKey, isCapsLockPressed);
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

  if (keyCode === 'CapsLock') {
    isCapsLockPressed = !isCapsLockPressed;
  }

  if (event.shiftKey && event.altKey) {
    toggleLang();
  }

  setInactiveKeyboardKey(keyboardKey);
  updateKeyboardKeyTexts(event.shiftKey, isCapsLockPressed);
}

function setInactiveKeyboardKey(keyboardKey) {
  keyboardKey.classList.remove('keyboard__key--active');
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-zA-Zа-яА-Я]/i);
}
