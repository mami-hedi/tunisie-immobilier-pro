import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Award, 
  Users, 
  Target, 
  Heart, 
  ArrowRight, 
  CheckCircle,
  Building2,
  Handshake,
  TrendingUp
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "L'immobilier est notre passion depuis plus de 15 ans. Chaque projet est unique et mérite toute notre attention.",
  },
  {
    icon: Handshake,
    title: "Confiance",
    description: "La transparence et l'honnêteté sont au cœur de notre relation avec nos clients. Votre confiance est notre priorité.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Nous visons l'excellence dans chaque service que nous offrons, de la première visite à la signature finale.",
  },
  {
    icon: TrendingUp,
    title: "Expertise",
    description: "Notre connaissance approfondie du marché tunisien nous permet de vous conseiller au mieux.",
  },
];

const services = [
  {
    title: "Achat immobilier",
    description: "Accompagnement personnalisé pour trouver le bien de vos rêves. Recherche, visites, négociation et suivi administratif.",
  },
  {
    title: "Vente immobilière",
    description: "Estimation gratuite, mise en valeur de votre bien, diffusion sur les meilleurs canaux et suivi des visites.",
  },
  {
    title: "Location",
    description: "Gestion locative complète : recherche de locataires, états des lieux, gestion administrative et technique.",
  },
  {
    title: "Conseil & Investissement",
    description: "Conseils personnalisés pour vos investissements immobiliers. Analyse de rentabilité et accompagnement fiscal.",
  },
];

const stats = [
  { value: "2008", label: "Année de création" },
  { value: "500+", label: "Transactions réussies" },
  { value: "15", label: "Experts immobiliers" },
  { value: "98%", label: "Clients satisfaits" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              À Propos de Notre Agence
            </h1>
            <p className="text-muted-foreground text-lg">
              Depuis 2008, Annonce Tunisie accompagne les Tunisiens dans leurs projets 
              immobiliers avec passion, professionnalisme et engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Notre Histoire</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Une agence à taille humaine, des ambitions de leader
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Fondée en 2008 à Tunis, Annonce Tunisie est née de la volonté de créer 
                  une agence immobilière différente, où la relation client prime sur le volume.
                </p>
                <p>
                  Notre équipe de 15 experts passionnés vous accompagne dans tous vos projets : 
                  achat, vente, location ou investissement. Nous couvrons l'ensemble du territoire 
                  tunisien avec une expertise particulière sur le Grand Tunis, le Sahel et le Cap Bon.
                </p>
                <p>
                  Notre philosophie est simple : comprendre vos besoins, vous conseiller avec 
                  honnêteté et vous accompagner jusqu'à la réalisation de votre projet.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 text-center"
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos Valeurs</h2>
            <p className="section-subtitle mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/20 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos Services</h2>
            <p className="section-subtitle mx-auto">
              Un accompagnement complet pour tous vos projets immobiliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-card border border-border rounded-2xl hover:border-primary/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mb-6">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-secondary-foreground/70 text-lg mb-8">
              Contactez-nous dès aujourd'hui pour bénéficier d'une estimation gratuite 
              et des conseils de nos experts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/contact">
                  Contactez-nous
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                <Link to="/biens">
                  Voir nos biens
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
