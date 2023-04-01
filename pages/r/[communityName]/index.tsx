import { CommunityModel } from "@/atoms/communitiesAtom";
import CreatePostLink from "@/components/community/CreatePostLink";
import PostsList from "@/components/community/PostsList";
import PageContent from "@/components/Layout/PageContent";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { FC } from "react";
import safeJsonStringify from "safe-json-stringify";
import CommunityHeader from "./CommunityHeader";
import CommunityNotFound from "./CommunityNotFound";

const CommunityPage: FC<CommunityPageProps> = ({ community }) => {
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
        <>Right Side</>
      </PageContent>
    </>
  );
};

interface CommunityPageProps {
  community: CommunityModel;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(firestore, "communities", context.query.communityName as string);
    const communityDoc = await getDoc(communityDocRef);
    const communityData = communityDoc.data();
    if (communityDoc.exists()) {
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
