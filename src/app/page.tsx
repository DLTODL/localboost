import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LocalBoost — Get Found Online, Generate Leads',
  description: 'Quick services for local businesses. SEO audits, Google Business setup, lead capture. Starting at €50.',
}

export default function Home() {
  const services = [
    {
      name: 'Google Business Profile',
      price: '50',
      desc: 'Claim, verify & optimize your Google Business profile',
      features: ['Business claim & verification', 'Photo & description', 'Hours & services', 'Initial optimization'],
      popular: false,
    },
    {
      name: 'SEO Audit',
      price: '75',
      desc: 'Complete website analysis with actionable recommendations',
      features: ['Website audit', 'Keyword research', 'Competitor analysis', 'Action plan'],
      popular: false,
    },
    {
      name: 'Lead Capture Setup',
      price: '100',
      desc: 'Turn website visitors into leads with optimized forms',
      features: ['Contact form optimization', 'Email notifications', 'Lead tracking', 'Integration'],
      popular: true,
    },
  ]

  const monthlyPlans = [
    {
      name: 'Lead Generator',
      price: '99',
      desc: 'Consistent leads month after month',
      features: ['Local SEO', 'Google Ads management', 'Monthly report', 'Email support'],
    },
    {
      name: 'Full Presence',
      price: '199',
      desc: 'Complete online growth package',
      features: ['Everything in Lead Gen', 'Content creation', 'Review management', 'Priority support'],
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold">LocalBoost</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#services" className="text-gray-600 hover:text-primary">Services</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary">Pricing</a>
          </nav>
          <a href="#pricing" className="bg-primary text-white px-5 py-2 rounded-lg font-medium">
            Get Started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🚀 For Dutch local businesses
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop losing leads.<br />
            <span className="text-primary">Start growing.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We help local businesses get found online and convert visitors into customers.
            Quick services, clear pricing, results you can see.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing" className="bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg">
              Get Free Audit
            </a>
            <a href="#services" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg">
              See Services
            </a>
          </div>
          <p className="text-gray-500 mt-4">No credit card • Free audit consultation • Fast turnaround</p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Quick Services</h2>
          <p className="text-center text-gray-600 mb-12">One-time projects, delivered in 1-3 days</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 border ${service.popular ? 'ring-2 ring-primary' : 'border-gray-200'}`}>
                {service.popular && (
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                )}
                <h3 className="text-xl font-bold mt-4">{service.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">€{service.price}</span>
                </div>
                <p className="text-gray-600 mt-2">{service.desc}</p>
                <ul className="mt-6 space-y-3">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-primary">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#pricing" className={`block mt-8 text-center py-3 rounded-lg font-semibold ${
                  service.popular ? 'bg-primary text-white' : 'border-2 border-gray-300'
                }`}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">1</div>
              <h3 className="font-semibold">Choose Service</h3>
              <p className="text-gray-600">Pick from our quick services or get a custom quote</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">2</div>
              <h3 className="font-semibold">We Deliver</h3>
              <p className="text-gray-600">Fast turnaround,typically 1-3 days</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">3</div>
              <h3 className="font-semibold">You Get Results</h3>
              <p className="text-gray-600">More leads, better rankings, growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Monthly Plans</h2>
          <p className="text-center text-gray-600 mb-12">Ongoing growth, cancel anytime</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {monthlyPlans.map((plan, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">€{plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.desc}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-primary">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-8 bg-primary text-white py-3 rounded-lg font-semibold">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to grow?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Get your free audit consultation. No obligation, no credit card.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button type="submit" className="bg-accent text-white px-6 py-3 rounded-lg font-semibold">
              Get Free Audit
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold">LocalBoost</span>
          </div>
          <p className="text-gray-400">© 2026 LocalBoost. Netherlands.</p>
        </div>
      </footer>
    </main>
  )
}