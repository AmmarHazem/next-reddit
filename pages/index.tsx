import Head from "next/head";
import PageContent from "@/components/Layout/PageContent";
import { Inter } from "@next/font/google";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [user, loadingUser] = useAuthState(auth);

  const buildUserHomeFeed = () => {};

  const buildNoUserHomeFeed = () => {};

  const getUserPostVotes = () => {};

  useEffect(() => {}, []);

  return (
    <>
      <Head>
        <title>Next Reddit</title>
        <meta name="description" content="My own version of Reddit built using NextJS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContent>
        <>Post Feed</>
        <>Recommendations</>
      </PageContent>
    </>
  );
}
