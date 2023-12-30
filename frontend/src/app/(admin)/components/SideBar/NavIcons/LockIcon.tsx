import React from 'react';

const LockIcon = ({ stroke = '#7791fa' }: { stroke?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
    <path
      d="M12 17.75C12.5523 17.75 13 17.3023 13 16.75C13 16.1977 12.5523 15.75 12 15.75C11.4477 15.75 11 16.1977 11 16.75C11 17.3023 11.4477 17.75 12 17.75Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 10.75H5C3.89543 10.75 3 11.6454 3 12.75V20.75C3 21.8546 3.89543 22.75 5 22.75H19C20.1046 22.75 21 21.8546 21 20.75V12.75C21 11.6454 20.1046 10.75 19 10.75Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 10.75V7.75C7 6.42392 7.52678 5.15215 8.46447 4.21447C9.40215 3.27678 10.6739 2.75 12 2.75C13.3261 2.75 14.5979 3.27678 15.5355 4.21447C16.4732 5.15215 17 6.42392 17 7.75V10.75"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LockIcon;
