import { CommunityModel, communityStateAtom } from "@/atoms/communitiesAtom";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { FC, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import CreatePostLink from "@/components/community/CreatePostLink";
import PostsList from "@/components/community/PostsList";
import PageContent from "@/components/Layout/PageContent";
import safeJsonStringify from "safe-json-stringify";
import CommunityHeader from "./CommunityHeader";
import CommunityNotFound from "./CommunityNotFound";
import AboutCommunity from "@/components/community/AboutCommunity";

const CommunityPage: FC<CommunityPageProps> = ({ community }) => {
  const setCommunityState = useSetRecoilState(communityStateAtom);

  useEffect(() => {
    setCommunityState((prev) => ({ ...prev, currentCommunity: community }));
  }, [community, setCommunityState]);

  if (!community.creatorID) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <CommunityHeader community={community} />
      <PageContent>
        <>
          <CreatePostLink />
          <PostsList community={community} />
        </>
        <>
          <AboutCommunity community={community} />
        </>
      </PageContent>
    </>
  );
};

interface CommunityPageProps {
  community: CommunityModel;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{ props: { community: CommunityModel } } | null> {
  try {
    const communityDocRef = doc(firestore, "communities", context.query.communityName as string);
    const communityDoc = await getDoc(communityDocRef);
    if (communityDoc.exists()) {
      const communityData = communityDoc.data();
      return {
        props: {
          community: JSON.parse(safeJsonStringify({ id: communityDoc.id, ...(communityData ?? {}) })),
        },
      };
    } else {
      return {
        props: {
          community: { id: communityDoc.id },
        },
      };
    }
  } catch (e) {
    console.log("--- community page error", e);
    return null;
  }
}

export default CommunityPage;
