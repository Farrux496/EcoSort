import React from 'react';

interface EcoSortLogoProps {
  variant?: 'official-bubbly' | 'horizontal' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const EcoSortLogo: React.FC<EcoSortLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showSlogan = false,
  className = '',
}) => {
  // Official bubbly stacked logo matching uploaded Image 2
  if (variant === 'official-bubbly') {
    const dimensions = {
      sm: { w: 120, h: 120 },
      md: { w: 180, h: 180 },
      lg: { w: 240, h: 240 },
      xl: { w: 300, h: 300 },
    }[size];

    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <svg
          viewBox="0 0 400 400"
          width={dimensions.w}
          height={dimensions.h}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform hover:scale-105 duration-200"
        >
          {/* Ground shadow */}
          <ellipse cx="200" cy="355" rx="100" ry="8" fill="#D3E2D5" />

          {/* Leaf 1 (Left & Upper) */}
          <g>
            <path
              d="M260 145 C240 100 270 40 310 60 C325 100 290 140 260 145 Z"
              fill="#52BE44"
              stroke="#1C2D1F"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            {/* Leaf 1 center vein */}
            <path
              d="M272 135 C285 110 295 90 305 70"
              stroke="#1C2D1F"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Leaf 1 specular shine */}
            <path
              d="M265 110 C270 85 285 65 300 65"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Leaf 2 (Right & Smaller) */}
          <g>
            <path
              d="M305 145 C320 120 375 90 385 115 C370 145 330 160 305 145 Z"
              fill="#52BE44"
              stroke="#1C2D1F"
              strokeWidth="9"
              strokeLinejoin="round"
            />
            {/* Leaf 2 center vein */}
            <path
              d="M318 143 C340 135 360 125 375 118"
              stroke="#1C2D1F"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Leaf 2 specular shine */}
            <path
              d="M335 125 C355 115 370 115 375 120"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.75"
            />
          </g>

          {/* "eco" letters */}
          <g>
            {/* 'e' */}
            <path
              d="M 125 160 C 125 130 145 110 175 110 C 205 110 220 135 220 165 C 220 170 215 175 205 175 L 140 175 C 142 195 155 205 175 205 C 190 205 200 198 206 188 C 210 182 220 182 224 188 C 228 194 225 202 218 210 C 206 224 190 230 170 230 C 135 230 115 205 115 170 Z M 140 155 L 195 155 C 194 138 185 128 172 128 C 158 128 145 138 140 155 Z"
              fill="#4EBD42"
              stroke="#182A1B"
              strokeWidth="11"
              strokeLinejoin="round"
              transform="translate(-40, 20)"
            />
            {/* Highlight arc on 'e' */}
            <path
              d="M 105 142 C 115 132 128 128 140 128"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* 'c' */}
            <path
              d="M 235 155 C 230 142 220 132 205 132 C 182 132 170 152 170 175 C 170 198 182 218 205 218 C 220 218 230 208 236 195 C 240 188 250 188 254 195 C 258 202 254 212 245 222 C 232 235 218 240 200 240 C 160 240 142 210 142 175 C 142 140 162 110 202 110 C 220 110 238 118 250 132 C 256 140 252 150 245 154 C 240 157 236 156 235 155 Z"
              fill="#4EBD42"
              stroke="#182A1B"
              strokeWidth="11"
              strokeLinejoin="round"
              transform="translate(10, 10)"
            />
            {/* Highlight arc on 'c' */}
            <path
              d="M 185 130 C 200 123 218 125 228 132"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* 'o' */}
            <path
              d="M 285 125 C 315 125 338 148 338 180 C 338 212 315 235 285 235 C 255 235 232 212 232 180 C 232 148 255 125 285 125 Z M 285 150 C 268 150 258 162 258 180 C 258 198 268 210 285 210 C 302 210 312 198 312 180 C 312 162 302 150 285 150 Z"
              fill="#4EBD42"
              stroke="#182A1B"
              strokeWidth="11"
              strokeLinejoin="round"
              transform="translate(15, 5)"
            />
            {/* Highlight on 'o' */}
            <path
              d="M 275 140 C 290 135 305 138 315 145"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.9"
            />
            <circle cx="330" cy="165" r="3.5" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* "sort" letters */}
          <g transform="translate(45, 125)">
            {/* 's' */}
            <path
              d="M 85 125 C 80 120 70 115 58 115 C 45 115 36 122 36 132 C 36 142 46 148 60 152 C 78 158 92 168 92 184 C 92 202 76 215 54 215 C 38 215 26 208 18 196 C 14 189 16 180 24 176 C 30 172 38 175 42 182 C 45 188 50 192 56 192 C 63 192 68 188 68 182 C 68 174 58 170 45 165 C 28 158 16 148 16 132 C 16 114 32 100 56 100 C 72 100 86 108 94 118 C 98 124 95 134 88 138 C 84 140 82 135 85 125 Z"
              fill="#4EBD42"
              stroke="#182A1B"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            {/* Highlight on 's' */}
            <path
              d="M 45 110 C 58 108 68 112 75 118"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* 'o' */}
            <path
              d="M 142 110 C 168 110 188 130 188 158 C 188 186 168 206 142 206 C 116 206 96 186 96 158 C 96 130 116 110 142 110 Z M 142 132 C 128 132 120 142 120 158 C 120 174 128 184 142 184 C 156 184 164 174 164 158 C 164 142 156 132 142 132 Z"
              fill="#4EBD42"
              stroke="#182A1B"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            {/* Highlight on 'o' */}
            <path
              d="M 125 122 C 138 118 152 120 162 126"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* 'r' */}
            <path
              d="M 198 115 L 198 202 C 198 210 204 216 212 216 C 220 216 226 210 226 202 L 226 150 C 230 138 240 130 252 130 C 258 130 264 132 268 135 C 274 139 282 136 285 128 C 288 120 284 112 276 108 C 265 102 250 102 238 112 C 232 117 228 124 225 130 L 225 115 C 225 107 219 101 211 101 C 203 101 198 107 198 115 Z"
              fill="#4EBD42"
              stroke="#182A1B"
              strokeWidth="10"
              strokeLinejoin="round"
            />
            {/* Highlight on 'r' */}
            <path
              d="M 235 112 C 245 110 255 112 262 118"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* 't' */}
            <path
              d="M 300 85 L 300 110 L 322 110 C 328 110 334 115 334 122 C 334 129 328 134 322 134 L 300 134 L 300 182 C 300 190 305 194 314 194 C 320 194 326 191 330 187 C 336 182 344 183 348 189 C 352 195 350 204 342 210 C 332 218 320 220 308 220 C 288 220 276 208 276 184 L 276 134 L 262 134 C 255 134 250 129 250 122 C 250 115 255 110 262 110 L 276 110 L 276 85 C 276 77 282 72 290 72 C 298 72 300 77 300 85 Z"
              fill="#4EBD42"
              stroke="#182A1B"
              strokeWidth="10"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {showSlogan && (
          <p className="mt-2 text-sm font-semibold text-emerald-800 tracking-tight">
            Tábiyattı birge qorǵaymız
          </p>
        )}
      </div>
    );
  }

  // Horizontal brand mark seen in header Screen 1 & Screen 2
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-1">
        <span className={`font-extrabold tracking-tight text-[#0D7C66] ${textSizes} flex items-center`}>
          <span>Eco</span>
          <span className="relative">
            <span>S</span>
            {/* Sprouting leaf over 'o' / 'S' */}
            <svg
              className="absolute -top-3.5 -right-3 w-5 h-5 text-emerald-500 drop-shadow-sm pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 18C4 10 10 4 20 4C20 14 14 20 4 18Z"
                fill="#48BB78"
                stroke="#1B4D3E"
                strokeWidth="2"
              />
              <path
                d="M4 18C10 14 14 10 20 4"
                stroke="#1B4D3E"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span>ort</span>
        </span>
      </div>

      {showSlogan && (
        <span className="text-xs font-medium text-emerald-900 tracking-tight opacity-90">
          Tábiyattı birge qorǵaymız
        </span>
      )}
    </div>
  );
};
