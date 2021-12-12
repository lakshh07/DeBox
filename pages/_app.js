import "../styles/globals.css";
import "../styles/main.css";
// import { MoralisProvider } from "react-moralis";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    // <MoralisProvider
    //   appId="nbL1de2uev0wO4oiD612iH0Gy6iE8Ih92IIbr36h"
    //   serverUrl="https://vxhqaxl9zklv.usemoralis.com:2053/server"
    // >
    <ChakraProvider>
      <div className="app">
        <div className="blur-box">
          <Component {...pageProps} />
        </div>
      </div>
    </ChakraProvider>
    // </MoralisProvider>
  );
}

export default MyApp;
