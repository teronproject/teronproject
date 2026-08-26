import React from 'react'

export default function Logo({ className = "", ...props }) {
  return (
    <svg className={className} {...props} viewBox="200 -200 4050 1300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          .hammer {
            transform-origin: 2925px 828px;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .group:hover .hammer {
            animation: premium-strike 1.2s infinite;
          }
          @keyframes premium-strike {
            0% { transform: rotate(0deg); }
            30% { transform: rotate(18deg); animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
            45% { transform: rotate(-4deg); animation-timing-function: cubic-bezier(0.0, 0, 0.2, 1); }
            65% { transform: rotate(2deg); animation-timing-function: ease-in-out; }
            80%, 100% { transform: rotate(0deg); }
          }
        `}
      </style>
      
      {/* N */}
      <g style={{ transformOrigin: '3600px 452px', transform: 'scale(0.85)' }}>
        <path d="M4081.28 903.789L3667.33 273.431V903.789H3492.45V0.402344H3698.79L4092.61 599.305V0.402344H4268.75V903.789H4081.28Z" fill="white"/>
      </g>
      
      {/* O (Token Logo) */}
      <g style={{ transformOrigin: '2901px 452px', transform: 'scale(1.25)' }}>
        <path d="M2880.53 0.388214C2886.64 -0.370572 2897.12 0.216192 2903.54 0.21995C3013.34 0.930258 3119.08 41.8418 3200.75 115.22C3291.41 196.598 3345.52 311.025 3350.89 432.731C3356.47 551.662 3314.53 667.925 3234.34 755.926C3152.63 845.432 3038.6 898.652 2917.52 903.799C2910.89 904.287 2902.68 903.914 2895.94 903.923C2785.92 903.124 2679.95 862.314 2597.82 789.114C2509.02 710.404 2454.99 599.739 2447.56 481.31C2442.66 399.242 2459.93 317.365 2497.55 244.261C2515.71 209.85 2538 177.781 2563.92 148.765C2629.67 75.6067 2717.63 26.0717 2814.28 7.77746C2837.92 3.30527 2857.04 1.87206 2880.53 0.388214Z" fill="url(#paint0_radial_219_308)"/>
<path d="M2888.01 75.8917C3095.84 69.8309 3269.24 233.373 3275.35 441.203C3281.46 649.033 3117.96 822.475 2910.13 828.634C2702.23 834.792 2528.72 671.222 2522.61 463.328C2516.5 255.429 2680.11 81.9538 2888.01 75.8917Z" fill="url(#paint1_linear_219_308)"/>
<g filter="url(#filter0_i_219_308)">
<g clipPath="url(#clip0_219_308)">
<rect width="746.77" height="746.767" rx="373.384" transform="matrix(-1 0 0 1 3272.33 78.9014)" fill="url(#paint2_linear_219_308)"/>
<g filter="url(#filter1_d_219_308)" className="hammer">
<path d="M2762.82 263.827C2755.28 265.693 2727.77 271.627 2722.36 275.026C2721.93 279.515 2735.55 330.929 2737.3 338.021L2750.15 390.006C2752.46 399.369 2754.53 408.878 2757.17 418.15C2757.5 419.309 2758.07 421.751 2759.3 422.185C2764.18 423.902 2818.34 407.15 2829.03 406.104C2830.78 405.932 2833.32 405.837 2834.86 406.891C2835.86 407.581 2836.29 409.081 2836.64 410.195C2839 417.674 2840.55 425.634 2842.43 433.257L2853.68 478.638C2851.2 479.239 2848.63 479.661 2846.17 480.316C2842.17 481.385 2838.3 482.007 2839.45 487.055C2841.96 497.994 2844.73 508.84 2847.43 519.724L2862.78 581.695L2910.38 773.858L2918.67 807.492C2919.9 812.454 2922.13 825.706 2925.97 828.462C2929.86 828.771 2960.71 820.402 2967.07 818.903C2982.32 815.099 2997.65 811.518 3012.88 807.613C3015.85 806.849 3019.8 805.842 3019 801.932C3018.02 797.127 3016.79 792.403 3015.61 787.648L3009.36 762.495L2989.67 683.139L2953.06 535.178C2947.18 511.425 2941.32 487.636 2935.46 463.879C2935.06 462.323 2934.75 461.078 2933.29 460.192C2931.28 458.977 2928.59 460.078 2926.49 460.562C2923.86 461.167 2921.24 461.862 2918.64 462.521L2908.06 419.467C2906.67 413.967 2900.87 394.731 2902.03 390.025C2904.9 386.035 2918.06 383.828 2923.16 382.573L2955.81 374.543C2960.63 373.361 2965.57 372.35 2970.23 370.771C2973.3 369.729 2972.55 367.677 2971.9 365.054C2966.58 343.743 2961.14 321.84 2955.86 300.573L2940.93 240.435C2939.59 235.025 2938.66 227.921 2936.26 222.8C2935.83 221.879 2934.75 221.784 2933.85 221.586C2921.91 224.105 2908.44 227.777 2896.5 230.74L2829.14 247.428L2762.82 263.827ZM2699.49 279.504C2692.26 281.294 2633.87 294.914 2632.36 297.043C2631.67 298.024 2631.51 298.743 2631.69 299.907C2632.9 307.551 2635.45 315.446 2637.31 322.982L2648.82 369.416L2660.93 418.407C2662.91 426.421 2664.89 434.658 2667.03 442.646C2667.36 443.882 2668.48 444.54 2669.53 445.315C2677.52 443.821 2732.62 430.578 2737.14 427.997C2737.08 422.577 2733.88 411.874 2732.52 406.369L2723.61 370.383L2709.29 312.527C2706.83 302.579 2704.37 292.508 2701.8 282.584C2701.28 280.598 2700.97 280.69 2699.49 279.504ZM2978.17 210.518C2973.65 211.639 2960.71 214.557 2956.88 216.195C2956.2 218.849 2960.23 233.627 2961.09 237.105L2969.42 270.619L2984.55 331.676C2987.02 341.68 2989.48 351.736 2991.99 361.731C2992.37 363.247 2992.66 364.135 2993.83 365.106L3035.86 354.753C3041.07 353.469 3058.96 349.766 3062.35 346.843C3062.18 342.543 3056.79 322.168 3055.44 316.708L3038.96 250.118L3030.39 215.502C3029.28 211.002 3028.11 205.987 3026.82 201.503C3026.5 200.375 3024.81 199.72 3023.7 199.194L2978.17 210.518Z" fill="white"/>
        </g>
      </g>
      </g>
      </g>
      
      {/* T, E, R */}
      <g style={{ transformOrigin: '2000px 452px', transform: 'scale(0.85)' }}>
        <path d="M1822.2 903.789H1630.95V0.402344H1984.5C2098.58 0.402344 2187.07 25.9857 2249.98 77.1525C2312.89 127.48 2344.35 199.617 2344.35 293.563C2344.35 353.956 2326.31 407.639 2290.25 454.612C2255.02 500.746 2205.11 534.298 2140.52 555.268L2373.29 903.789H2145.55L1941.72 584.206H1822.2V903.789ZM1822.2 158.935V426.932H1975.7C2033.57 426.932 2077.61 416.027 2107.81 394.218C2138 371.571 2153.1 338.019 2153.1 293.563C2153.1 248.267 2138 214.715 2107.81 192.907C2077.61 170.259 2033.57 158.935 1975.7 158.935H1822.2Z" fill="white"/>
        <path d="M1483 737.707V903.789H875.293V0.402344H1474.2V166.485H1066.54V356.472H1436.45V521.296H1066.54V737.707H1483Z" fill="white"/>
        <path d="M475.599 903.789H284.353V172.776H0V0.402344H761.21V172.776H475.599V903.789Z" fill="white"/>
      </g>
<defs>
<filter id="filter0_i_219_308" x="2525.56" y="78.9014" width="746.77" height="749.666" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2.89862"/>
<feGaussianBlur stdDeviation="5.72849"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.80803 0 0 0 0 0.595922 0 0 0 0 0 0 0 0 0.6 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_219_308"/>
</filter>
<filter id="filter1_d_219_308" x="2618.53" y="187.641" width="456.916" height="655.463" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
<feFlood floodOpacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1.54034"/>
<feGaussianBlur stdDeviation="6.54646"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_219_308"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_219_308" result="shape"/>
</filter>
<radialGradient id="paint0_radial_219_308" cx="0" cy="0" r="1" gradientTransform="matrix(-707.128 -439.282 442.404 -701.919 3222.43 657.654)" gradientUnits="userSpaceOnUse">
<stop stopColor="#E9C85A"/>
<stop offset="0.363448" stopColor="#F0B100"/>
<stop offset="0.649646" stopColor="#F0B100"/>
<stop offset="1" stopColor="#E9C85A"/>
</radialGradient>
<linearGradient id="paint1_linear_219_308" x1="2898.98" y1="75.7285" x2="2898.98" y2="828.802" gradientUnits="userSpaceOnUse">
<stop stopColor="#FEDD27"/>
<stop offset="1" stopColor="#FFE649"/>
</linearGradient>
<linearGradient id="paint2_linear_219_308" x1="373.385" y1="0" x2="373.385" y2="746.767" gradientUnits="userSpaceOnUse">
<stop stopColor="#F0B100"/>
<stop offset="1" stopColor="#E1A600"/>
</linearGradient>
<clipPath id="clip0_219_308">
<rect width="746.77" height="746.767" rx="373.384" transform="matrix(-1 0 0 1 3272.33 78.9014)" fill="white"/>
</clipPath>
</defs>
</svg>
  )
}
