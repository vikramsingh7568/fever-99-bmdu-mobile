import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

let initialRoute = null;
let initialParams = null;

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.current.navigate(name, params);
  } else {
    initialRoute = name;
    initialParams = params;
  }
}

export function gotoInitialRoute() {
  initialRoute && navigate(initialRoute, initialParams);
}

//step one

// import { createNavigationContainerRef } from '@react-navigation/native';

// export const navigationRef = createNavigationContainerRef();

// export function navigate(name, params) {
//   if (navigationRef.current) {
//     navigationRef.current.navigate(name, params);
//   }
// }
