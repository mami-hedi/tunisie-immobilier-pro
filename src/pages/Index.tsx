import { Link } from "react-router-dom";
import { ArrowRight, Shield, Award, Users, Home, CheckCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { getRecentProperties } from "@/data/properties";

const features = [
  {
    icon: Shield,
    title: "Confiance & Sécurité",
    description: "Transactions sécurisées et accompagnement juridique complet pour votre tranquillité.",
  },
  {
    icon: Award,
    title: "Expertise Locale",
    description: "Plus de 15 ans d'expérience sur le marché immobilier tunisien.",
  },
  {
    icon: Users,
    title: "Accompagnement Personnalisé",
    description: "Un conseiller dédié vous accompagne de la recherche à la signature.",
  },
  {
    icon: Home,
    title: "Biens Sélectionnés",
    description: "Chaque bien est vérifié et répond à nos critères de qualité stricts.",
  },
];

const stats = [
  { value: "500+", label: "Biens vendus" },
  { value: "15+", label: "Années d'expérience" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "24h", label: "Réponse garantie" },
];

export default function Index() {
  const recentProperties = getRecentProperties(6);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="bg-secondary py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-foreground/70 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Properties Section */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h2 className="section-title">Nos Biens Récents</h2>
              <p className="section-subtitle">
                Découvrez notre dernière sélection de biens immobiliers de qualité
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/biens">
                Voir tous les biens
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentProperties.map((property, index) => (
              <div
                key={property.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Pourquoi Nous Choisir ?</h2>
            <p className="section-subtitle mx-auto">
              Une équipe de professionnels passionnés à votre service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mb-6">
              Vous avez un projet immobilier ?
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-8 leading-relaxed">
              Que vous souhaitiez acheter, vendre ou louer, notre équipe d'experts 
              est à votre disposition pour vous accompagner dans votre projet.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/contact">
                  Contactez-nous
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                <a href="tel:+21671000000">
                  +216 71 000 000
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-secondary-foreground/60">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">Estimation gratuite</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">Réponse sous 24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
