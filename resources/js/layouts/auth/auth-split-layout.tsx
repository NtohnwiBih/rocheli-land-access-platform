import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Globe, Moon, Star, Sun } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const testimonials = [
    {
        quote: "Rocheli made land ownership feel possible. Six months in, I had a title in my hands.",
        name: "Emeka Obi",
        role: "Growth Plan member",
    },
    {
        quote: "The Land Access Club gave me a clear, disciplined path to buying my first plot without stress.",
        name: "Adaeze Nwosu",
        role: "Prime Plan member",
    },
    {
        quote: "Transparent process from day one. I always knew exactly where my contributions stood.",
        name: "Tunde Bakare",
        role: "Advance Plan member",
    },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const [dark, setDark] = useState(false);
    const [lang, setLang] = useState<'EN' | 'FR'>('EN');
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
    }, [dark]);

    useEffect(() => {
        const id = setInterval(() => {
            setTestimonialIndex((i) => (i + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(id);
    }, []);

    const active = testimonials[testimonialIndex];

    return (
        <div className="relative grid h-dvh flex-col lg:max-w-none lg:grid-cols-2">
            {/* Left column */}
            <div className="flex h-full flex-col justify-between bg-background px-8 py-8 sm:px-12">
                <div className="flex items-center justify-between">
                    <Link href={home()} className="flex items-center gap-2.5">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')}
                            className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
                        >
                            <Globe className="h-3.5 w-3.5" />
                            {lang}
                        </button>
                        <button
                            onClick={() => setDark(!dark)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-background/80 text-muted-foreground backdrop-blur transition hover:border-primary/40 hover:text-foreground"
                            aria-label="Toggle theme"
                        >
                            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="flex flex-col items-start gap-2 text-left">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        <div className="mt-6">{children}</div>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Rocheli Real Properties
                </div>
            </div>

            {/* Right column — hero image + sliding testimonial */}
            <div className="relative hidden h-full flex-col overflow-hidden lg:flex">
                <img
                    src="/hero-estate.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/80" />

                <div className="relative z-10 mt-auto p-10">
                    <div className="relative h-40 max-w-md">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={testimonialIndex}
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="absolute inset-0 rounded-2xl bg-rocheli-navy/70 p-6 text-white backdrop-blur-md"
                            >
                                <div className="flex gap-1 text-rocheli-gold">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current" />
                                    ))}
                                </div>
                                <p className="mt-3 text-sm leading-relaxed">
                                    "{active.quote}"
                                </p>
                                <div className="mt-4">
                                    <div className="text-sm font-semibold">{active.name}</div>
                                    <div className="text-xs text-white/70">{active.role}</div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-4 flex gap-1.5">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setTestimonialIndex(i)}
                                aria-label={`Show testimonial ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === testimonialIndex
                                        ? 'w-6 bg-rocheli-gold'
                                        : 'w-1.5 bg-white/40 hover:bg-white/60'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}