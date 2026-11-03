import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, ChevronRight, Zap, Users, BookOpen, Lightbulb, Target, Search, ExternalLink } from 'lucide-react';

const categories = [
  { name: 'Artificial Intelligence', slug: 'artificial-intelligence', icon: '🧠', description: 'Machine learning, neural networks, AI research' },
  { name: 'Energy', slug: 'energy', icon: '⚡', description: 'Renewable energy, fusion, battery technology' },
  { name: 'Biotechnology', slug: 'biotechnology', icon: '🧬', description: 'Genetic engineering, synthetic biology, medical research' },
  { name: 'Robotics', slug: 'robotics', icon: '🤖', description: 'Autonomous systems, humanoid robots, automation' },
  { name: 'Semiconductors', slug: 'semiconductors', icon: '🔬', description: 'Chip design, fabrication, quantum devices' },
  { name: 'Quantum Computing', slug: 'quantum-computing', icon: '⚛️', description: 'Quantum algorithms, hardware, error correction' },
  { name: 'Materials Science', slug: 'materials-science', icon: '💎', description: 'Advanced materials, nanomaterials, metamaterials' },
  { name: 'Space', slug: 'space', icon: '🚀', description: 'Space exploration, propulsion, planetary science' },
];

const featuredBTs = [
  {
    title: 'Room-Temperature Superconductivity',
    summary: 'Achieving zero electrical resistance at ambient conditions would revolutionize energy transmission, computing, and transportation.',
    category: 'Materials Science',
    skills: ['Condensed Matter Physics', 'Materials Synthesis', 'Computational Modeling'],
    status: 'teams_working',
    teams: 3,
  },
  {
    title: 'Scalable Quantum Error Correction',
    summary: 'Building fault-tolerant quantum computers requires breakthrough error correction that scales to millions of qubits.',
    category: 'Quantum Computing',
    skills: ['Quantum Information Theory', 'Quantum Hardware', 'Error Correction Codes'],
    status: 'open',
    teams: 1,
  },
  {
    title: 'Artificial General Intelligence Alignment',
    summary: 'Ensuring AGI systems remain beneficial and aligned with human values as capabilities advance toward superintelligence.',
    category: 'Artificial Intelligence',
    skills: ['ML Safety Research', 'Interpretability', 'Reward Modeling', 'Governance'],
    status: 'open',
    teams: 2,
  },
];

const steps = [
  {
    number: '01',
    title: 'Discover Problems',
    description: 'Explore curated, important unsolved problems across science and engineering. Each BT is structured with context, research, and open questions.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Research & Discuss',
    description: 'Dive into linked papers, share hypotheses, debate evidence, and critique approaches. Structured discussions keep signal high.',
    icon: BookOpen,
  },
  {
    number: '03',
    title: 'Form Teams',
    description: 'Connect with complementary experts. Request to join teams or create your own around approved BTs.',
    icon: Users,
  },
  {
    number: '04',
    title: 'Experiment & Build',
    description: 'Track objectives, share progress, link repositories, and iterate. Turn research into prototypes, papers, and products.',
    icon: Lightbulb,
  },
  {
    number: '05',
    title: 'Publish Breakthroughs',
    description: 'Showcase outcomes: research papers, open-source projects, prototypes, products, and startups. Credit contributors.',
    icon: Target,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-near-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full mb-8 animate-fade-in">
              <Zap className="w-4 h-4 text-electric-lime" />
              <span className="text-sm font-medium text-warm-off-white">Now in Public Beta</span>
            </div>

            {/* Headline */}
            <h1 className="heading-1 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              The world&apos;s biggest problems
              <br />
              <span className="text-electric-lime">need more minds.</span>
            </h1>

            {/* Subheadline */}
            <p className="body-lg max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
              BT connects researchers, engineers, and innovators to solve meaningful real-world problems.
              From room-temperature superconductors to AGI alignment — discover, research, collaborate, and breakthrough.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link to="/explore">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="w-5 h-5" />
                  Explore Problems
                </Button>
              </Link>
              <Link to="/submit">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Zap className="w-5 h-5" />
                  Drop a BT
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="text-center">
                <div className="heading-2 font-bold text-electric-lime">47</div>
                <div className="body-sm text-muted-text">Active BTs</div>
              </div>
              <div className="w-px h-10 bg-gray-800 mx-2 hidden md:block" />
              <div className="text-center">
                <div className="heading-2 font-bold text-electric-lime">12</div>
                <div className="body-sm text-muted-text">Active Teams</div>
              </div>
              <div className="w-px h-10 bg-gray-800 mx-2 hidden md:block" />
              <div className="text-center">
                <div className="heading-2 font-bold text-electric-lime">8</div>
                <div className="body-sm text-muted-text">Categories</div>
              </div>
              <div className="w-px h-10 bg-gray-800 mx-2 hidden md:block" />
              <div className="text-center">
                <div className="heading-2 font-bold text-electric-lime">3</div>
                <div className="body-sm text-muted-text">Breakthroughs</div>
              </div>
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-lime/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-electric-lime/3 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* How BT Works */}
      <section className="page-section bg-gray-950/50">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">How BT Works</h2>
            <p className="body-lg">
              A structured journey from problem discovery to measurable breakthrough.
              No likes, no followers — just evidence, collaboration, and progress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="card-hover group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-700 group-hover:text-electric-lime transition-colors">
                    {step.number}
                  </span>
                  <step.icon className="w-6 h-6 text-electric-lime group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="heading-4 mb-2">{step.title}</h3>
                <p className="body-md">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured BTs */}
      <section className="page-section">
        <div className="section-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="heading-2 mb-2">Featured BTs</h2>
              <p className="body-md">Important problems with active collaboration</p>
            </div>
            <Link to="/explore" className="link text-sm font-medium">
              View all <ChevronRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredBTs.map((bt) => (
              <Link
                key={bt.title}
                to={`/bt/${bt.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="card-hover group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <Badge variant="secondary" size="sm">
                    {bt.category}
                  </Badge>
                  <Badge
                    variant={bt.status === 'teams_working' ? 'violet' : 'default'}
                    size="sm"
                  >
                    {bt.status === 'teams_working' ? 'Teams Working' : 'Open'}
                  </Badge>
                </div>
                <h3 className="heading-4 mb-3 group-hover:text-electric-lime transition-colors">
                  {bt.title}
                </h3>
                <p className="body-md mb-4 line-clamp-3">{bt.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {bt.skills.slice(0, 3).map((skill) => (
                    <Badge variant="outline" size="sm" key={skill}>
                      {skill}
                    </Badge>
                  ))}
                  {bt.skills.length > 3 && (
                    <Badge variant="outline" size="sm">
                      +{bt.skills.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="body-sm text-muted-text">
                    {bt.teams} team{bt.teams !== 1 ? 's' : ''} working
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-electric-lime group-hover:gap-2 transition-all">
                    View
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-section bg-gray-950/50">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Explore by Category</h2>
            <p className="body-lg">Browse problems across science and engineering domains</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/explore?category=${category.slug}`}
                className="card-hover group p-6 text-center"
              >
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <h3 className="heading-4 mb-2 group-hover:text-electric-lime transition-colors">
                  {category.name}
                </h3>
                <p className="body-sm text-muted-text line-clamp-2">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Active Collaborations */}
      <section className="page-section">
        <div className="section-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="heading-2 mb-2">Active Collaborations</h2>
              <p className="body-md">Teams currently working on breakthroughs</p>
            </div>
            <Link to="/teams" className="link text-sm font-medium">
              View all <ChevronRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Quantum Error Correction Collective',
                bt: 'Scalable Quantum Error Correction',
                members: 5,
                status: 'active',
                progress: 'Implementing surface code on superconducting qubits',
              },
              {
                name: 'High-Tc Superconductor Synthesis',
                bt: 'Room-Temperature Superconductivity',
                members: 8,
                status: 'active',
                progress: 'DFT screening of hydride compounds under pressure',
              },
              {
                name: 'AI Alignment Research Group',
                bt: 'Artificial General Intelligence Alignment',
                members: 12,
                status: 'forming',
                progress: 'Literature review on interpretability methods',
              },
            ].map((team) => (
              <Link key={team.name} to={`/teams/${team.name.toLowerCase().replace(/\s+/g, '-')}`} className="card-hover group">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant={team.status === 'active' ? 'success' : 'warning'} size="sm">
                    {team.status}
                  </Badge>
                </div>
                <h3 className="heading-4 mb-2 group-hover:text-electric-lime transition-colors">
                  {team.name}
                </h3>
                <p className="body-sm text-muted-text mb-3">Working on: {team.bt}</p>
                <p className="body-sm mb-4 text-warm-off-white/80 line-clamp-2">{team.progress}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="flex items-center gap-1.5 body-sm text-muted-text">
                    <Users className="w-4 h-4" />
                    {team.members} members
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-electric-lime group-hover:gap-2 transition-all">
                    View team
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Breakthroughs */}
      <section className="page-section bg-gray-950/50">
        <div className="section-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="heading-2 mb-2">Recent Breakthroughs</h2>
              <p className="body-md">Outcomes published through BT</p>
            </div>
            <Link to="/breakthroughs" className="link text-sm font-medium">
              View all <ChevronRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Surface Code Threshold Demonstrated',
                type: 'experiment',
                bt: 'Scalable Quantum Error Correction',
                description: 'First experimental demonstration of below-threshold error rates in a distance-5 surface code on superconducting hardware.',
                link: 'https://arxiv.org/abs/...',
              },
              {
                title: 'Interpretability Dashboard for LLMs',
                type: 'open_source',
                bt: 'Artificial General Intelligence Alignment',
                description: 'Open-source tool for visualizing attention patterns and neuron activations in transformer models.',
                link: 'https://github.com/...',
              },
              {
                title: 'Hydride Superconductor Phase Diagram',
                type: 'research_paper',
                bt: 'Room-Temperature Superconductivity',
                description: 'Computational mapping of stable high-temperature superconducting phases in ternary hydride systems.',
                link: 'https://journals.aps.org/...',
              },
            ].map((breakthrough) => (
              <Link key={breakthrough.title} to={breakthrough.link} target="_blank" rel="noopener noreferrer" className="card-hover group">
                <div className="flex items-start gap-3 mb-4">
                  <Badge variant={breakthrough.type === 'research_paper' ? 'violet' : breakthrough.type === 'open_source' ? 'default' : 'success'} size="sm">
                    {breakthrough.type.replace('_', ' ')}
                  </Badge>
                </div>
                <h3 className="heading-4 mb-3 group-hover:text-electric-lime transition-colors">
                  {breakthrough.title}
                </h3>
                <p className="body-sm text-muted-text mb-3">From: {breakthrough.bt}</p>
                <p className="body-md mb-4 line-clamp-3">{breakthrough.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="flex items-center gap-1.5 body-sm text-muted-text">
                    <ExternalLink className="w-3.5 h-3.5" />
                    View publication
                  </span>
                  <ChevronRight className="w-4 h-4 text-electric-lime group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="page-section relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-lime/10 via-transparent to-violet/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-electric-lime/5 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-4">Ready to start your breakthrough?</h2>
            <p className="body-lg mb-8">
              Join a community of researchers, engineers, and innovators tackling the world's most important problems.
              Your expertise could be the missing piece.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Join BT
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Browse Problems
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}