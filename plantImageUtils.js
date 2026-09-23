const fallbackPlantImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eef8ef" />
      <stop offset="100%" stop-color="#d5ead7" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)" />
  <circle cx="610" cy="110" r="70" fill="#f4f0c1" opacity="0.85" />
  <path d="M400 420c-34-74-22-151 21-209 62 30 100 93 103 173-43 28-87 40-124 36Z" fill="#5d8c63"/>
  <path d="M387 436c-13-77 17-148 75-194 47 44 64 115 45 187-40 16-83 19-120 7Z" fill="#6da772"/>
  <path d="M405 434c28-74 86-126 154-146 25 59 11 130-37 184-39 4-80-7-117-38Z" fill="#7fba84"/>
  <path d="M282 440c-24-70-7-145 41-198 58 28 95 84 100 154-37 34-87 52-141 44Z" fill="#7aa969"/>
  <path d="M255 466h290l-32 76H287l-32-76Z" fill="#b47a4d"/>
  <path d="M274 454h252l-21 35H295l-21-35Z" fill="#cb9366"/>
  <text x="400" y="116" text-anchor="middle" font-size="46" font-family="Georgia, serif" fill="#31553a">
    PlantNest
  </text>
  <text x="400" y="156" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" fill="#56745d">
    Image coming soon
  </text>
</svg>
`)}`;

export function getPlantImageProps(image, name = "Plant", imagePosition = "center") {
  return {
    src: image || fallbackPlantImage,
    alt: name,
    loading: "lazy",
    decoding: "async",
    referrerPolicy: "no-referrer",
    style: {
      objectPosition: imagePosition
    },
    onError: (event) => {
      if (event.currentTarget.src !== fallbackPlantImage) {
        event.currentTarget.src = fallbackPlantImage;
      }
    }
  };
}

export { fallbackPlantImage };
