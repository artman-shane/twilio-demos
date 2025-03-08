export function measureFontSize(fontFamily, fontSize) {
    const element = document.createElement('span');
    element.style.fontFamily = fontFamily;
    element.style.fontSize = fontSize;
    element.style.position = 'absolute';
    element.style.visibility = 'hidden';
    element.textContent = 'o';
    document.body.appendChild(element);
    const { width, height } = element.getBoundingClientRect();
    document.body.removeChild(element);
    return { width, height };
  }