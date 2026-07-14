import { Breadcrumb } from "@/components/site/breadcrumbs";
import { SectionHeader } from "@/components/site/section";
import { team } from "@/lib/mock-data";
import { Head } from "@inertiajs/react";
import { Eye, Heart, Target } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
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
            eyebrow="Our story"
            title={
                <>
                Building the trusted{" "}
                <span className="italic text-gradient-gold">bridge to land</span>{" "}in
                Cameroon.
                </>
            }
            description=" Rocheli was born from a simple observation: land ownership in Cameroon should be secure, structured and accessible — not a maze. We built a platform, a legal engine, and a members' club to make it so."
          />
          
          <section className="py-24">
            <div className="container-x grid gap-12 lg:grid-cols-2 items-center">
            <div className="rounded-[2rem] overflow-hidden shadow-elegant">
                <img
                src="/family-land.jpg"
                alt="Rocheli team with a new landowner"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
                />
            </div>
            <div>
                <SectionHeader
                eyebrow="Company story"
                title={
                    <>
                    From a small team of{" "}
                    <span className="italic text-gradient-blue">believers</span> to a
                    movement of 5,000+ members.
                    </>
                }
                />
                <p className="mt-6 text-muted-foreground leading-relaxed">
                Founded in Douala in 2019, Rocheli started with 12 members and one
                5-hectare parcel. Today we manage 15,000 acres across Douala, Yaoundé,
                Kribi, Buea and Bafoussam — and have transferred more than 2,000 land
                titles into member hands.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                Our conviction is unchanged: verified land, structured savings and
                radical transparency are the shortest path to generational wealth in
                Central Africa.
                </p>
            </div>
            </div>
          </section>

          <section className="py-24 bg-muted/40">
            <div className="container-x grid gap-6 md:grid-cols-3">
            {[
                {
                icon: Target,
                title: "Mission",
                body: "Make verified land ownership accessible to every ambitious Cameroonian through structured, transparent programs.",
                },
                {
                icon: Eye,
                title: "Vision",
                body: "A generation of African families whose wealth is anchored in land they legally, unquestionably own.",
                },
                {
                icon: Heart,
                title: "Values",
                body: "Integrity above expedience. Transparency by default. Excellence at every touchpoint. Members before margins.",
                },
            ].map((v, i) => (
                <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl bg-card border border-border p-8 hover:shadow-elegant transition"
                >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-blue text-white shadow-glow">
                    <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{v.body}</p>
                </motion.div>
            ))}
            </div>
          </section>

          <section className="py-24">
            <div className="container-x">
            <SectionHeader
                align="center"
                eyebrow="Leadership"
                title="The people building Rocheli"
                description="A senior team spanning real estate, law, finance and technology."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((m, i) => (
                <motion.div
                    key={m.name}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group rounded-3xl bg-card border border-border p-8 hover:shadow-elegant hover:-translate-y-1 transition-all"
                >
                    <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-blue text-white font-display text-2xl font-bold shadow-glow group-hover:scale-105 transition-transform">
                    {m.initials}
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold">{m.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                </motion.div>
                ))}
            </div>
            </div>
          </section>
        </>
    )
}