import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layouts/layout";

// Redux
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import appReducer from "../redux/appSlice";
import { createWrapper } from "next-redux-wrapper";
import { Analytics } from "@vercel/analytics/react";

import { theme as chakraTheme } from "../components/theme";
import KYAModal from "../components/KYAModal";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

// Store must be made here for next.js or else it wont work
export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ChakraProvider theme={chakraTheme}>
            <Layout>
              <KYAModal />
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </Provider>
      </QueryClientProvider>
      <Analytics />
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
