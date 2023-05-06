import { getHighestNumberOfMemebersCommunities } from "@/services/communityServices";
import { useMemo } from "react";
import { useQuery } from "react-query";

function useHighestNumberOfMembersCommunities() {
  const queryKey = useMemo(() => ["highest-number-of-members-communities"], []);

  const query = useQuery(queryKey, getHighestNumberOfMemebersCommunities);

  return { query, queryKey };
}

export default useHighestNumberOfMembersCommunities;
