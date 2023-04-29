import { CommunityModel, communityStateAtom } from "@/atoms/communitiesAtom";
import { GetServerSidePropsContext } from "next";
import { FC, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import CreatePostLink from "@/components/community/CreatePostLink";
import PostsList from "@/components/community/PostsList";
import PageContent from "@/components/Layout/PageContent";
import CommunityHeader from "./CommunityHeader";
import CommunityNotFound from "./CommunityNotFound";
import AboutCommunity from "@/components/community/AboutCommunity";
import { getCommunity } from "@/services/community";

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

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: CommunityPageProps } | null> {
  const community = await getCommunity({ communityID: context.query.communityName as string });
  if (!community) return null;
  return {
    props: {
      community: community,
    },
  };
}

export default CommunityPage;
