const LANG = {
  'EN': 'en',
  'RU': 'ru',
};

let currentLang = LANG.EN;

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

  keyboardKey.className = 'keyboard__key';
  keyboardKey.dataset[KEYBOARD_KEY_DATASET.CODE] = key['code'];

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

  if (event.shiftKey && event.altKey) {
    toggleLang();
  }

  changeKeyboardKeyLangTexts(event.shiftKey);
}

function toggleLang() {
  currentLang = currentLang === LANG.EN ? LANG.RU : LANG.EN;
}

function changeKeyboardKeyLangTexts(isShiftPressed) {
  const keyboardKeys = document.querySelectorAll(`[data-code]`);

  keyboardKeys.forEach(keyboardKey => {
    const textEn = isShiftPressed ? keyboardKey.dataset[KEYBOARD_KEY_DATASET.SHIFT_TEXT_EN] : keyboardKey.dataset[KEYBOARD_KEY_DATASET.TEXT_EN];
    const textRu = isShiftPressed ? keyboardKey.dataset[KEYBOARD_KEY_DATASET.SHIFT_TEXT_RU] : keyboardKey.dataset[KEYBOARD_KEY_DATASET.TEXT_RU];
    if (textEn && textRu) {
      keyboardKey.textContent = currentLang === LANG.EN ? textEn : textRu;
    }
  });
}

function setActiveKeyboardKey(keyboardKey) {
  keyboardKey.classList.add('keyboard__key--active');
}

function handleKeyUp(event) {
  const keyCode = event.code;
  const keyboardKey = document.querySelector(`[data-code="${keyCode}"`);

  setInactiveKeyboardKey(keyboardKey);
  changeKeyboardKeyLangTexts(event.shiftKey);
}

function setInactiveKeyboardKey(keyboardKey) {
  keyboardKey.classList.remove('keyboard__key--active');
}
