import type { MediaType } from '@entities/media';

const BACKGROUND_BY_TYPE: Record<MediaType, string> = {
  image: '#eaf2ff',
  video: '#f1eafe',
  document: '#e9f8f0',
};

const ACCENT_BY_TYPE: Record<MediaType, string> = {
  image: '#3972d5',
  video: '#8054c7',
  document: '#28835a',
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function getIcon(type: MediaType): string {
  switch (type) {
    case 'image':
      return `
        <rect
          x="74"
          y="62"
          width="52"
          height="44"
          rx="6"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
        />
        <circle
          cx="112"
          cy="76"
          r="5"
          fill="currentColor"
        />
        <path
          d="M80 98l13-14 10 10 8-8 10 12"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      `;

    case 'video':
      return `
        <rect
          x="72"
          y="62"
          width="56"
          height="44"
          rx="7"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
        />
        <path
          d="M94 76l17 9-17 9z"
          fill="currentColor"
        />
      `;

    case 'document':
      return `
        <path
          d="M83 58h25l14 14v42H83z"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linejoin="round"
        />
        <path
          d="M108 58v15h14"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linejoin="round"
        />
        <path
          d="M92 88h21M92 98h17"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
        />
      `;
  }
}

export function createMockThumbnail(
  type: MediaType,
  fileName: string,
): string {
  const background = BACKGROUND_BY_TYPE[type];
  const accent = ACCENT_BY_TYPE[type];

  const shortName =
    fileName.length > 24
      ? `${fileName.slice(0, 21)}...`
      : fileName;

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 200 200"
    >
      <rect
        width="200"
        height="200"
        rx="16"
        fill="${background}"
      />

      <g style="color:${accent}">
        ${getIcon(type)}
      </g>

      <text
        x="100"
        y="145"
        text-anchor="middle"
        fill="${accent}"
        font-family="Arial, sans-serif"
        font-size="13"
        font-weight="600"
      >
        ${escapeXml(shortName)}
      </text>

      <text
        x="100"
        y="166"
        text-anchor="middle"
        fill="${accent}"
        opacity="0.7"
        font-family="Arial, sans-serif"
        font-size="11"
        text-transform="uppercase"
      >
        ${type.toUpperCase()}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    svg,
  )}`;
}