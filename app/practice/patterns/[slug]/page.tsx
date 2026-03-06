"use client";

import { useParams } from "next/navigation";
import ChallengeHub from "@/components/Labs/ChallengeHub";

export default function PatternChallengePage() {
  const params = useParams();
  const slug = params.slug as string;
  return <ChallengeHub patternSlug={slug} />;
}
