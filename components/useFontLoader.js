export function loadFont(name, url) {
  if (document.fonts.check(`1em "${name}"`)) return;
  const fontFace = new FontFace(name, `url(${url})`);
  fontFace.load().then((loaded) => {
    document.fonts.add(loaded);
  });
}