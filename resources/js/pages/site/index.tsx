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

export default function Home() {
    return (
        <>
          <Hero />
          <Stats />
          <Featured />
          <WhyUs />
          <ClubOverview />
          <HowItWorks />
          <Plans />
          <Testimonials />
          <Articles />
          <FAQ />
          <ContactCTA />
        </>
    )
}