import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export function GET() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.4111 11.233C19.3333 10.0445 19.3333 8.35552 18.4111 7.16699C17.4889 5.97846 15.7333 5.97846 14.8111 7.16699L9.6 13.5999V19.9999H16L18.4111 11.233Z"
          fill="#3F51B5"
          fillOpacity="0.7"
        />
        <path
          d="M13.5889 20.7669C12.6667 21.9554 12.6667 23.6444 13.5889 24.833C14.5111 26.0215 16.2667 26.0215 17.1889 24.833L22.4 18.3999V11.9999H16L13.5889 20.7669Z"
          fill="#3F51B5"
        />
      </svg>
    ),
    {
      width: 32,
      height: 32,
    }
  );
}
