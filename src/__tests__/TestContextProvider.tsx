import { Provider } from "react-redux";
import { setupStore } from "../store";

const reduxStore = setupStore();

test('dummy test', () => {});  // TODO: Remove from test discovery so we don't need this

export const TestContextProvider = ({children}: any) => {
  return <Provider store={reduxStore}>
    {children}
  </Provider>
}
