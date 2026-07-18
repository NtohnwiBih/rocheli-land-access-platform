import { Plans } from "@/components/site/plans";
import ClubOverview from "@/components/site/home/club-overview";
import Hero from "@/components/site/home/hero";
import HowItWorks from "@/components/site/home/how-it-works";
import Featured from "@/components/site/home/properties";
import Stats from "@/components/site/home/stats";
import WhyUs from "@/components/site/home/why-us";
import Testimonials from "@/components/site/home/testimonials";
import Articles from "@/components/site/home/articles";
import FAQ from "@/components/site/home/faqs";
import ContactCTA from "@/components/site/home/cta";

type HomeContent = Record<string, Record<string, any>>;

interface Props {
  content: HomeContent;
  testimonials: any[];
  faqs: any[];
  articles: any[];
}

export default function Home({ content, testimonials, faqs, articles }: Props) {
  return (
    <>
      <Hero content={content.hero} />
      <Stats content={content.hero} />
      <Featured />
      <WhyUs content={content.whyRocheli} />
      <ClubOverview content={content.savingsProgram} />
      <HowItWorks content={content.steps} />
      <Plans />
      <Testimonials content={content.testimonials} items={testimonials} />
      <Articles content={content.articles} items={articles} />
      <FAQ content={content.faq} items={faqs} />
      <ContactCTA content={content.cta} />
    </>
  );
}