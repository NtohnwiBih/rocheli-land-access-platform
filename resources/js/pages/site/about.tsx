import { Breadcrumb } from "@/components/site/breadcrumbs";
import { SectionHeader } from "@/components/site/section";
import { Head } from "@inertiajs/react";
import { Eye, Heart, Target } from "lucide-react";
import { motion } from "motion/react";
import { resolveIcon } from "@/lib/icon-map";

type ValueCard = { icon: string; title: string; body: string };

type TeamMember = { id: number | string; name: string; role: string; image?: string | null };

type Props = {
  content: {
    hero?: { eyebrow?: string; title?: string; titleAccent?: string; description?: string };
    story?: { eyebrow?: string; title?: string; titleAccent?: string; paragraph1?: string; paragraph2?: string; image?: string };
    mission?: { values?: ValueCard[] };
    leadership?: { eyebrow?: string; title?: string; description?: string };
  };
  teams: TeamMember[];
};

function splitAccent(text: string): { word: string; rest: string } {
  const [word, ...restWords] = text.trim().split(/\s+/);
  return { word: word ?? "", rest: restWords.length ? ` ${restWords.join(" ")}` : "" };
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const fallbackValues: ValueCard[] = [
  { icon: "Target", title: "Mission", body: "Make verified land ownership accessible to every ambitious Cameroonian through structured, transparent programs." },
  { icon: "Eye", title: "Vision", body: "A generation of African families whose wealth is anchored in land they legally, unquestionably own." },
  { icon: "Heart", title: "Values", body: "Integrity above expedience. Transparency by default. Excellence at every touchpoint. Members before margins." },
];

export default function About({ content = {}, teams = [] }: Props) {
  const hero = content.hero ?? {};
  const story = content.story ?? {};
  const values = content.mission?.values?.length ? content.mission.values : fallbackValues;
  const leadership = content.leadership ?? {};

  const heroAccent = splitAccent(hero.titleAccent ?? "bridge to land");
  const storyAccent = splitAccent(story.titleAccent ?? "believers to a movement of 5,000+ members.");

  return (
    <>
      <Head title="About — Rocheli Real Properties">
        <meta
          name="description"
          content="Rocheli is a technology-driven real estate company redefining how Cameroonians access verified land through the Land Access Club."
        />
        <meta property="og:title" content="About Rocheli Real Properties" />
        <meta
          property="og:description"
          content="Meet the team building Cameroon's most trusted path to land ownership"
        />
      </Head>

      <Breadcrumb
        eyebrow={hero.eyebrow ?? "Our story"}
        title={
          <>
            {hero.title ?? "Building the trusted"}{" "}
            <span className="italic text-gradient-gold">{heroAccent.word}</span>
            {heroAccent.rest}
          </>
        }
        description={
          hero.description ??
          "Rocheli was born from a simple observation: land ownership in Cameroon should be secure, structured and accessible — not a maze. We built a platform, a legal engine, and a members' club to make it so."
        }
      />

      <section className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2 items-center">
          <div className="rounded-[2rem] overflow-hidden shadow-elegant">
            <img
              src={story.image || "/family-land.jpg"}
              alt="Rocheli team with a new landowner"
              loading="lazy"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div>
            <SectionHeader
              eyebrow={story.eyebrow ?? "Company story"}
              title={
                <>
                  {story.title ?? "From a small team of"}{" "}
                  <span className="italic text-gradient-blue">{storyAccent.word}</span>
                  {storyAccent.rest}
                </>
              }
            />
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {story.paragraph1 ??
                "Founded in Douala in 2019, Rocheli started with 12 members and one 5-hectare parcel. Today we manage 15,000 acres across Douala, Yaoundé, Kribi, Buea and Bafoussam — and have transferred more than 2,000 land titles into member hands."}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {story.paragraph2 ??
                "Our conviction is unchanged: verified land, structured savings and radical transparency are the shortest path to generational wealth in Central Africa."}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/40">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {values.map((v, i) => {
            const Icon = resolveIcon(v.icon) ?? [Target, Eye, Heart][i] ?? Target;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl bg-card border border-border p-8 hover:shadow-elegant transition"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-blue text-white shadow-glow">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{v.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <SectionHeader
            align="center"
            eyebrow={leadership.eyebrow ?? "Leadership"}
            title={leadership.title ?? "The people building Rocheli"}
            description={leadership.description ?? "A senior team spanning real estate, law, finance and technology."}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teams.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted"
              >
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-blue">
                    <span className="font-display text-4xl font-bold text-white">
                      {initialsFor(m.name)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-lg font-semibold text-white">{m.name}</h3>
                  <p className="mt-0.5 text-sm text-white/75">{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}