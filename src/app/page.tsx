import Navbar from "@/components/portfolio/Navbar";
import IntroGate from "@/components/portfolio/IntroGate";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Work from "@/components/portfolio/Work";
import Now from "@/components/portfolio/Now";
import Skills from "@/components/portfolio/Skills";
import CompetitiveSection from "@/components/portfolio/Competitive";
import Achievements from "@/components/portfolio/Achievements";
import { GithubCta, Contact } from "@/components/portfolio/Contact";
import { getData, publishedProjects, buildingProjects, sortedAchievements, sortedCommunities } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getData();
  const projects = publishedProjects(data);
  const building = buildingProjects(data);
  const communities = sortedCommunities(data);
  const achievements = sortedAchievements(data);

  return (
    <IntroGate
      name={data.profile.name}
      tagline={data.profile.heroSub}
      photo={data.profile.photo}
    >
      <Navbar name={data.profile.name} githubUrl={data.socials.github} />
      <main>
        <Hero profile={data.profile} />
        <About
          profile={data.profile}
          communities={communities}
          competitive={data.competitive}
        />
        <Now projects={building} />
        <Work projects={projects} />
        <Skills categories={data.skills} currentFocus={data.profile.currentFocus} />
        <CompetitiveSection
          competitive={data.competitive}
          communities={communities}
        />
        <Achievements achievements={achievements} />
        <GithubCta githubUrl={data.socials.github} />
      </main>
      <Contact socials={data.socials} />
    </IntroGate>
  );
}
