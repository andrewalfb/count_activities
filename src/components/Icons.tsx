type IconProps = {
  size?: number;
  color?: string;
};


const iconSize = 24;

export function TimerIcon(
  { size = iconSize, 
    color = 'currentColor',
  }: IconProps) {

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 490 490"
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden="true"
        focusable="false"
      >
        <g>
          <path
            d="M417.418,136.155l41.024-41.24l-43.116-42.896L373.652,93.92c-20.224-14.732-43.051-26.091-67.657-33.238V32.838
      C305.995,14.733,291.262,0,273.148,0h-56.306c-18.104,0-32.838,14.733-32.838,32.838V60.68
      C92.842,87.158,26.014,171.422,26.014,271.009C26.014,391.764,124.249,490,244.994,490c120.755,0,218.991-98.236,218.991-218.991
      C463.986,220.186,446.579,173.355,417.418,136.155z M443.31,281.217c-2.396,47.073-21.267,89.868-50.94,122.731l-16.839-16.839
      l-14.436,14.435l16.839,16.84c-32.863,29.674-75.659,48.545-122.731,50.94v-23.916h-20.417v23.916
      c-47.071-2.395-89.863-21.266-122.723-50.938l16.842-16.842l-14.435-14.435l-16.842,16.842
      c-29.672-32.864-48.542-75.66-50.938-122.734h23.915v-20.416H46.69c2.395-47.073,21.265-89.867,50.936-122.728l16.843,16.836
      l14.435-14.436l-16.844-16.835c32.861-29.67,75.653-48.539,122.725-50.935V96.62h20.417V72.704
      c47.073,2.396,89.869,21.265,122.732,50.937l-16.841,16.833l14.436,14.436l16.841-16.834
      c29.673,32.861,48.543,75.653,50.939,122.726h-23.916v20.416H443.31z M415.406,80.889l14.166,14.106l-25.523,25.653
      c-4.58-4.842-9.382-9.471-14.383-13.881L415.406,80.889z M204.421,32.838c0-6.849,5.573-12.421,12.421-12.421h56.306
      c6.858,0,12.431,5.573,12.431,12.421v22.975c-13.157-2.475-26.719-3.785-40.584-3.785c-13.861,0-27.421,1.31-40.574,3.784V32.838z"
            fill={color}
          />
          <path
            d="M330.998,108.443l17.486,10.527l-94.745,157.302l-17.486-10.527L330.998,108.443z"
            fill={color}
          />
        </g>
      </svg>
    );
}



export function HobbyIcon({
  size = iconSize,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <defs>
        <style>{`
          .a {
            fill: none;
            stroke: currentColor;
            stroke-width: 2.0;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
        `}</style>
      </defs>

      <rect className="a" x="5.5" y="5.5" width="15.8571" height="15.8571" />
      <rect
        className="a"
        x="27.5004"
        y="6.3575"
        width="14.1421"
        height="14.1421"
        transform="translate(0.6303 28.3788) rotate(-45)"
      />
      <rect className="a" x="5.5" y="26.6429" width="15.8571" height="15.8571" />
      <rect className="a" x="26.6429" y="26.6429" width="15.8571" height="15.8571" />
    </svg>
  );
}

export function StatisticsIcon({
  size = iconSize,
  color = 'currentColor',
}: IconProps) {



  return (
    <svg 
      fill={color}
      height={size}
      width={size} 
      version="1.1"
      id="Layer_1" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 492.308 492.308"
    >
      <g>
        <g>
          <path d="M355.813,0H32.264v492.308h427.779V104.231L355.813,0z M361.582,33.615l64.846,64.846h-64.846V33.615z M440.351,472.615
            H51.957V19.692h289.933v98.462h98.462V472.615z"/>
        </g>
      </g>
      <g>
        <g>
          <path d="M315.543,331.885v109.947h92.308V331.885H315.543z M388.159,422.139h-52.923v-70.563h52.923V422.139z"/>
        </g>
      </g>
      <g>
        <g>
          <path d="M199.995,272.808v169.024h92.308V272.808H199.995z M272.611,422.139h-52.923V292.5h52.923V422.139z"/>
        </g>
      </g>
      <g>
        <g>
          <path d="M84.447,213.731v228.101h92.308V213.731H84.447z M157.062,422.139h-52.923V233.423h52.923V422.139z"/>
        </g>
      </g>
    </svg>
  );
}

export function BritishIcon({
  size = iconSize,
  color = 'currentColor'
}: IconProps) {

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 36 36" 
      xmlns="http://www.w3.org/2000/svg" 
      aria-hidden="true" 
      role="img" 
      preserveAspectRatio="xMidYMid meet">
        <path 
          fill="#EF2B2D" d="M10 5H4a4 4 0 0 0-4 4v6h10V5zm22 0H16v10h20V9a4 4 0 0 0-4-4zM10 31H4a4 4 0 0 1-4-4v-6h10v10zm22 0H16V21h20v6a4 4 0 0 1-4 4z"></path><path fill="#002868" d="M14.5 5h-2.944l-.025 11.5H0v3h11.525L11.5 31h3V19.5H36v-3H14.5z"></path><path fill="#EEE" d="M14.5 31H16V21h20v-1.5H14.5zM16 5h-1.5v11.5H36V15H16zm-4.5 0H10v10H0v1.5h11.5zM0 19.5V21h10v10h1.5V19.5z">
        </path>
    </svg>
  )
}

export function stopIcon({
  size = iconSize,
  color = 'currentColor'
}: IconProps) {
  
  return (
    <svg
      width={size}
      height={size} 
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_429_11149)">
      <rect 
        x="5" y="5" width="14" height="14" rx="2" 
        stroke={color}
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"/>
      </g>
      <defs>
      <clipPath id="clip0_429_11149">
      <rect width="24" height="24" fill="white"/>
      </clipPath>
      </defs>
    </svg>
  )
}

export function pauseIcon({
  size = iconSize,
  color = 'currentColor'
}: IconProps) {

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_429_11098)">
        <path d="M5 7C5 5.89543 5.89543 5 7 5H8C9.10457 5 10 5.89543 10 7V17C10 18.1046 9.10457 19 8 19H7C5.89543 19 5 18.1046 5 17V7Z" 
        stroke={color}
        strokeWidth="2.5" 
        strokeLinejoin="round"
        fill="white"
        />
        <path d="M14 7C14 5.89543 14.8954 5 16 5H17C18.1046 5 19 5.89543 19 7V17C19 18.1046 18.1046 19 17 19H16C14.8954 19 14 18.1046 14 17V7Z" 
        stroke={color}
        strokeWidth="2.5" 
        strokeLinejoin="round"
          fill="white"
        />
      </g>

    </svg>
  )
}

export function startIcon({
  size = iconSize,
  color = 'currentColor'
}: IconProps) {

  return (
    <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_429_11238)">
      <path 
        d="M19 10.2679C20.3333 11.0377 20.3333 12.9623 19 13.7321L10 18.9282C8.66667 19.698 7 18.7358 7 17.1962L7 6.80385C7 5.26425 8.66667 4.302 10 5.0718L19 10.2679Z" 
        stroke={color}
        strokeWidth="2.5" 
        strokeLinejoin="round"
      />
      </g>
    <defs>
      <clipPath id="clip0_429_11238">
      <rect width="24" height="24" fill="white"/>
      </clipPath>
      </defs>
    </svg>
    )
}