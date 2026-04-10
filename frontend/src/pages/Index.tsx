import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Shield, Award, Users, Home, CheckCircle, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const BASE_URL = "http://localhost:5000";

const features = [
  {
    icon: Shield,
    title: "Confiance & Sécurité",
    description: "Transactions sécurisées et accompagnement juridique complet pour votre tranquillité.",
  },
  {
    icon: Award,
    title: "Expertise Locale",
    description: "Une connaissance approfondie du marché immobilier tunisien pour vous guider au mieux.",
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
  { value: "100+", label: "Biens vendus avec succès" },
  { value: "15+", label: "Experts immobiliers dédiés" },
  { value: "98%", label: "Clients satisfaits et recommandations" },
  { value: "24h", label: "Réponse garantie à vos demandes" },
];

function adaptAnnonce(a: any) {
  return {
    id: String(a.id),
    title: a.titre,
    price: Number(a.prix),
    type: a.type_bien,
    transactionType: a.type_transaction,
    surface: Number(a.surface) || 0,
    rooms: Number(a.nb_pieces) || 0,
    bedrooms: Number(a.nb_chambres) || 0,
    bathrooms: Number(a.nb_salles_bain) || 0,
    governorate: a.gouvernorat,
    city: a.ville,
    address: a.adresse || "",
    description: a.description || "",
    images: a.image_principale
      ? [`${BASE_URL}${a.image_principale}`]
      : ["/placeholder.svg"],
    features: [],
    contact: {
      name: a.nom_contact || "",
      phone: a.tel_contact || "",
      email: a.email_contact || "",
    },
    createdAt: a.created_at,
    isFeatured: false,
  };
}

export default function Index() {
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnnonces({ statut: "active", limit: 6, page: 1 })
      .then((data: any) => {
        setRecentProperties((data.annonces || []).map(adaptAnnonce));
      })
      .catch(() => {
        // Silencieux : si le backend est down, on affiche juste rien
      })
      .finally(() => setLoading(false));
  }, []);

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

          {/* Chargement */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}

          {/* Grille annonces */}
          {!loading && recentProperties.length > 0 && (
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
          )}

          {/* Aucune annonce */}
          {!loading && recentProperties.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Home className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucune annonce disponible pour le moment.</p>
              <p className="text-sm mt-1">Revenez bientôt ou contactez-nous directement.</p>
            </div>
          )}
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
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 border-secondary-foreground/30 text-red-600 hover:bg-red-100"
              >
                <a href="tel:+21620007193">+216 20 007 193</a>
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