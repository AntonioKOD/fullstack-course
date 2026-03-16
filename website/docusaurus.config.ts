import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const GITHUB_REPO = 'https://github.com/AntonioKOD/fullstack-course';
const BMC_URL = 'https://buymeacoffee.com/codewithtoni';
const AUTHOR_GITHUB = 'https://github.com/AntonioKOD';

const config: Config = {
  title: 'Full-Stack Development Bootcamp',
  tagline: 'From HTML to production-grade apps with TypeScript, Next.js & NestJS',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://fullstack.codewithtoni.com',
  baseUrl: '/',

  organizationName: 'AntonioKOD',
  projectName: 'fullstack-course',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  scripts: [
    {
      src: 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js',
      'data-name': 'BMC-Widget',
      'data-cfasync': 'false',
      'data-id': 'codewithtoni',
      'data-description': 'Support me on Buy me a coffee!',
      'data-message': 'This course is free. A coffee keeps it going.',
      'data-color': '#FFDD00',
      'data-position': 'Right',
      'data-x_margin': '18',
      'data-y_margin': '18',
      async: true,
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: `${GITHUB_REPO}/edit/main/website/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/course-social-card.jpg',

    announcementBar: {
      id: 'open_source_support',
      content:
        'This course is <strong>free and open source</strong>. If it has been useful to you, <a href="' +
        BMC_URL +
        '" target="_blank" rel="noopener noreferrer">consider supporting it</a> or <a href="' +
        GITHUB_REPO +
        '" target="_blank" rel="noopener noreferrer">starring the repo</a>.',
      backgroundColor: '#0f172a',
      textColor: '#cbd5e1',
      isCloseable: true,
    },

    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'Full-Stack Bootcamp',
      logo: {
        alt: 'Course Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'courseSidebar',
          position: 'left',
          label: 'Curriculum',
        },
        {
          // GitHub stars badge
          type: 'html',
          position: 'right',
          value: `<a
            href="${GITHUB_REPO}"
            target="_blank"
            rel="noopener noreferrer"
            class="navbar__link navbar-stars"
            aria-label="GitHub repository"
          >
            <img
              src="https://img.shields.io/github/stars/AntonioKOD/fullstack-course?style=social"
              alt="GitHub Stars"
              height="20"
            />
          </a>`,
        },
        {
          // Buy Me a Coffee button
          type: 'html',
          position: 'right',
          value: `<a
            href="${BMC_URL}"
            target="_blank"
            rel="noopener noreferrer"
            class="navbar-bmc-btn"
            aria-label="Support on Buy Me a Coffee"
          >Support</a>`,
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Course',
          items: [
            { label: 'Introduction', to: '/' },
            { label: 'Phase 1 — Web Foundations', to: '/module-01/overview' },
            { label: 'Phase 2 — Node.js Backend', to: '/module-07/overview' },
            { label: 'Phase 3 — CS & Advanced Backend', to: '/module-13/overview' },
            { label: 'Phase 4 — Modern Frontend', to: '/module-16/overview' },
            { label: 'Phase 5 — Production', to: '/module-21/overview' },
            { label: 'Capstone Project', to: '/capstone/overview' },
          ],
        },
        {
          title: 'Open Source',
          items: [
            {
              label: 'GitHub Repository',
              href: GITHUB_REPO,
            },
            {
              label: 'Report an Issue',
              href: `${GITHUB_REPO}/issues`,
            },
            {
              label: 'Contribute',
              href: `${GITHUB_REPO}/blob/main/CONTRIBUTING.md`,
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Buy Me a Coffee',
              href: BMC_URL,
            },
            {
              label: 'Star on GitHub',
              href: GITHUB_REPO,
            },
            {
              label: 'Share with a Friend',
              href: `https://twitter.com/intent/tweet?text=Free%20full-stack%20bootcamp%20covering%20TypeScript%2C%20Next.js%2C%20NestJS%20%26%20more%3A&url=https://fullstack.codewithtoni.com`,
            },
          ],
        },
      ],
      copyright: `Built by <a href="${AUTHOR_GITHUB}" target="_blank" rel="noopener noreferrer" class="footer__link-item">Antonio Kodheli</a> &mdash; Free &amp; Open Source`,
    },

    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'sql', 'json', 'tsx', 'typescript', 'docker', 'yaml'],
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
