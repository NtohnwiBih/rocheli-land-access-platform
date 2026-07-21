import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import i18n from './i18n';
import SettingsLayout from '@/layouts/settings/layout';
import SiteLayout from '@/layouts/site-layout';
import { MemberLayout } from './layouts/member-layout';
import { AdminLayout } from './layouts/admin-layout';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function mount(el: HTMLElement, App: any, props: any) {
    const app = (
        <TooltipProvider delayDuration={0}>
            <App {...props} />
            <Toaster />
        </TooltipProvider>
    );

    // If the element already has server-rendered markup (SSR), hydrate it.
    // Otherwise this is a plain client-rendered mount.
    if (el.innerHTML.trim().length > 0) {
        hydrateRoot(el, app);
    } else {
        createRoot(el).render(app);
    }
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('site/'):
                return SiteLayout;
            case name.startsWith('member/'):
                return MemberLayout;
            case name.startsWith('admin/'):
                return AdminLayout;
            case name.startsWith('auth/'):
                return null;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    setup({ el, App, props }) {
        const tryMount = () => {
            if (el) mount(el, App, props);
        };

        if (i18n.isInitialized) {
            tryMount();
        } else {
            i18n.on('initialized', tryMount);
        }
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();