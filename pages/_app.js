import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import dynamic from "next/dynamic";
import { SSRProvider } from "react-bootstrap";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Script from "next/script";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "3a76da05417c26717431548829f54cac",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <SSRProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} modalSize="compact">
            <Head>
              <meta key="deScription" property="og:deScription" content="P2P" />
              <meta
                property="og:image"
                key="image"
                style={{ width: "100%" }}
                content=""
              />
              <link rel="icon" type="image/x-icon" style={{ width: "100%" }} />
            </Head>

            <Component {...pageProps} />

            <Script src="jquery-3.6.3.min.js"></Script>
            <Script src="https://code.jquery.com/jquery-3.6.4.js"></Script>

            <Script src="jquery.min.js"></Script>

            {/* {/ <Footer /> /} */}
            <Script
              src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
              integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
              crossOrigin="anonymous"
            ></Script>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
              integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/fontawesome.min.css"
              integrity="sha512-RvQxwf+3zJuNwl4e0sZjQeX7kUa3o82bDETpgVCH2RiwYSZVDdFJ7N/woNigN/ldyOOoKw8584jM4plQdt8bhA=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/v5-font-face.min.css"
              integrity="sha512-FrptovHG4M5T2rAIxvIeTsv3z3luk7BF7WEYdUkTB8VtkqD+8ZYlVPpJgIGqWK65sxuom0q6/lpXpBu43CdaPg=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.9.1/font/bootstrap-icons.min.css"
              integrity="sha512-5PV92qsds/16vyYIJo3T/As4m2d8b6oWYfoqV+vtizRB6KhF1F9kYzWzQmsO6T3z3QG2Xdhrx7FQ+5R1LiQdUA=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            <script src="https://unpkg.com/swiper/js/swiper.min.js"></script>
            <link
              href="https://unpkg.com/swiper/css/swiper.min.css"
              rel="stylesheet"
            />

            <Script
              src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
              integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
              crossOrigin="anonymous"
            ></Script>
            <script
              src="https://cdpn.io/cpe/boomboom/pen.js?key=pen.js-f218a54e-611e-c972-6c37-439fc63a6d55"
              crossOrigin=""
            ></script>
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
              integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
              crossOrigin="anonymous"
            />

            {/* start */}
            <script
              src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
              integrity="sha512-bPs7Ae6pVvhOSiIcyUClR7/q2OAsRiovw4vAkX+zJbw3ShAeeqezq50RIIcIURq7Oa20rW2n2q+fyXBNcU9lrw=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            ></script>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
              integrity="sha512-tS3S5qG0BlhnQROyJXvNjeEM4UpMXHrQfTGmbQ1gKmelCxlSEBUaxhRBj/EFTzpbP4RVSrpEikbmdJobCvhE3g=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
              integrity="sha512-sMXtMNL1zRzolHYKEujM2AqCLUR9F2C4/05cdbxjjLSRvMQIciEPCQZo++nk7go3BtSuK9kfa/s+a4f4i5pLkw=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <script
              src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
              integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            ></script>
            <link
              rel="stylesheet"
              href="owlcarousel/owl.carousel.min.css"
            ></link>
            <link
              rel="stylesheet"
              href="owlcarousel/owl.theme.default.min.css"
            ></link>
            <script src="jquery.min.js"></script>
            <script src="owlcarousel/owl.carousel.min.js"></script>
            {/* end */}

            {/* <Script src="js/owl.carousle.min.js"></Script> */}
            <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
              crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/owl.carousel.min.css"></link>
            <link rel="stylesheet" href="/owl.theme.default.min.css"></link>
            <Script src="https://code.jquery.com/jquery-3.6.4.js"></Script>
            <Script
              src="https://code.jquery.com/jquery-3.6.3.min.js"
              integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU="
              crossOrigin="anonymous"
            ></Script>
          </RainbowKitProvider>
        </WagmiConfig>
      </SSRProvider>
    </SessionProvider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), { ssr: false });
