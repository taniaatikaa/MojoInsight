import { DemografiSection } from "@/components/demografi-section";
import { HeroSection, type HeroStats } from "@/components/hero-section";
import { InfografisCtaSection } from "@/components/infografis-cta-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  VillageMapSection,
  type RtAgeBracketRow,
  type RtPekerjaanRow,
  type RtSummaryRow,
} from "@/components/village-map-section";
import type { AgeBracketRow } from "@/components/age-distribution-chart";
import type { PekerjaanRow } from "@/components/occupation-chart";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [heroStats, ageData, pekerjaanData, rtSummary, rtAgeData, rtPekerjaanData] = await Promise.all([
    supabase.from("v_hero_stats").select("*").single(),
    supabase.from("v_age_bracket_distribution").select("*"),
    supabase.from("v_pekerjaan_distribution").select("*"),
    supabase.from("v_rt_summary").select("*").order("rt_id"),
    supabase.from("v_rt_age_bracket_distribution").select("*"),
    supabase.from("v_rt_pekerjaan_distribution").select("*"),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection stats={heroStats.data as HeroStats} />
        <DemografiSection
          ageData={(ageData.data ?? []) as AgeBracketRow[]}
          pekerjaanData={(pekerjaanData.data ?? []) as PekerjaanRow[]}
          totalJiwa={(heroStats.data as HeroStats | null)?.total_jiwa ?? 0}
        />
        <VillageMapSection
          rtList={(rtSummary.data ?? []) as RtSummaryRow[]}
          ageByRt={(rtAgeData.data ?? []) as RtAgeBracketRow[]}
          pekerjaanByRt={(rtPekerjaanData.data ?? []) as RtPekerjaanRow[]}
        />
        <InfografisCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
