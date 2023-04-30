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
  } catch(err) {}
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

  keyboardKey.className = 'keyboard__key';
  keyboardKey.textContent = key['text'];
  keyboardKey.dataset['code'] = key['code'];

  return keyboardKey;
}

function handleKeyDown(event) {
  const keyCode = event.code;
  const keyboardKey = document.querySelector(`[data-code="${keyCode}"`);

  setActiveKeyboardKey(keyboardKey);
}

function setActiveKeyboardKey(keyboardKey) {
  keyboardKey.classList.add('keyboard__key--active');
}

function handleKeyUp(event) {
  const keyCode = event.code;
  const keyboardKey = document.querySelector(`[data-code="${keyCode}"`);

  setInactiveKeyboardKey(keyboardKey);
}

function setInactiveKeyboardKey(keyboardKey) {
  keyboardKey.classList.remove('keyboard__key--active');
}
