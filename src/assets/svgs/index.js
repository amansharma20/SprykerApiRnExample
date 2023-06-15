import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const GoBackIcon = props => (
  <Svg
    width={18}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M17 7a1 1 0 1 1 0 2V7ZM.293 8.707a1 1 0 0 1 0-1.414L6.657.929A1 1 0 0 1 8.07 2.343L2.414 8l5.657 5.657a1 1 0 1 1-1.414 1.414L.293 8.707ZM17 9H1V7h16v2Z"
      fill="#023373"
    />
  </Svg>
);
