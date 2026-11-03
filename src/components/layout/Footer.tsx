import { Link } from 'react-router-dom';
import { Mail, ExternalLink } from 'lucide-react';

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function MailIcon() {
  return <Mail className="w-5 h-5" />;
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Explore Problems', href: '/explore' },
      { name: 'Research Library', href: '/research' },
      { name: 'Teams', href: '/teams' },
      { name: 'Breakthroughs', href: '/breakthroughs' },
      { name: 'Drop a BT', href: '/submit' },
    ],
    company: [
      { name: 'About BT', href: '/about' },
      { name: 'Mission', href: '/mission' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    resources: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Help Center', href: '/help' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Security', href: '/security' },
      { name: 'Data Requests', href: '/data-requests' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/breakthru', icon: <GithubIcon /> },
    { name: 'Twitter', href: 'https://twitter.com/breakthru', icon: <TwitterIcon /> },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/breakthru', icon: <LinkedinIcon /> },
    { name: 'Email', href: 'mailto:hello@breakthru.org', icon: <MailIcon /> },
  ];

  return (
    <footer className="bg-near-black border-t border-gray-800">
      <div className="section-container py-16 lg:py-24">
        {/* Main content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6" aria-label="BT Home">
              <span className="heading-3 font-bold text-electric-lime">BT</span>
              <span className="text-sm text-muted-text">BreakThru</span>
            </Link>
            <p className="body-md text-muted-text mb-6 max-w-xs">
              Every breakthrough starts with a BT. Connecting minds to solve the world's most important problems.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-text hover:text-electric-lime transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <nav aria-label="Product links">
            <h3 className="heading-4 font-semibold text-warm-off-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-text hover:text-electric-lime transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company links">
            <h3 className="heading-4 font-semibold text-warm-off-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-text hover:text-electric-lime transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources links">
            <h3 className="heading-4 font-semibold text-warm-off-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-text hover:text-electric-lime transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h3 className="heading-4 font-semibold text-warm-off-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-text hover:text-electric-lime transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-text">
              © {currentYear} BT BreakThru. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-text">
              <span>Built with transparency and scientific rigor</span>
              <a
                href="https://github.com/breakthru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-electric-lime transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}