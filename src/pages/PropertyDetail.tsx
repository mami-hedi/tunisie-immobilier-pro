import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPropertyById, formatPrice, getRecentProperties } from "@/data/properties";
import { PropertyCard } from "@/components/PropertyCard";
import {
  ArrowLeft,
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  Phone,
  MessageCircle,
  Mail,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const property = getPropertyById(id || "");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  if (!property) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Bien non trouvé</h1>
            <p className="text-muted-foreground mb-8">
              Ce bien n'existe pas ou a été retiré de notre catalogue.
            </p>
            <Button asChild>
              <Link to="/biens">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux biens
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const similarProperties = getRecentProperties(3).filter((p) => p.id !== property.id);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par le bien "${property.title}" (Réf: ${property.id}) à ${property.city}. Pouvez-vous me donner plus d'informations ?`
    );
    window.open(`https://wa.me/21671000000?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.open("tel:+21671000000", "_self");
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="pt-28 pb-4 bg-muted">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/biens" className="hover:text-primary transition-colors">Nos Biens</Link>
            <span>/</span>
            <span className="text-foreground">{property.title}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10]">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={property.transactionType === "Vente" ? "badge-sale" : "badge-rent"}>
                    {property.transactionType}
                  </span>
                  {property.status !== "Disponible" && (
                    <span className="badge-sold">{property.status}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Property Info */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {property.type}
                  </Badge>
                  <span className="text-muted-foreground text-sm">Réf: {property.id}</span>
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {property.title}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{property.address}, {property.city}, {property.governorate}</span>
                </div>

                {/* Key features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted rounded-xl mb-8">
                  <div className="text-center">
                    <Maximize className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{property.surface} m²</div>
                    <div className="text-sm text-muted-foreground">Surface</div>
                  </div>
                  {property.rooms > 0 && (
                    <div className="text-center">
                      <BedDouble className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.rooms}</div>
                      <div className="text-sm text-muted-foreground">Pièces</div>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div className="text-center">
                      <BedDouble className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Chambres</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <Bath className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Sdb</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h2 className="font-display text-2xl font-semibold mb-4">Caractéristiques</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="text-sm text-muted-foreground mb-1">Prix</div>
                    <div className="font-display text-3xl font-bold text-primary">
                      {formatPrice(property.price, property.transactionType)}
                    </div>
                  </div>

                  {/* Agency Info */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-display font-bold text-xl">A</span>
                      </div>
                      <div>
                        <div className="font-semibold">Annonce Tunisie</div>
                        <div className="text-sm text-muted-foreground">Agence immobilière</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleCall}
                      className="w-full"
                      size="lg"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Appeler l'agence
                    </Button>

                    <Button
                      onClick={handleWhatsApp}
                      variant="secondary"
                      className="w-full"
                      size="lg"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      WhatsApp
                    </Button>

                    <Button
                      onClick={() => setShowContactForm(!showContactForm)}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Envoyer un message
                    </Button>
                  </div>

                  {/* Contact Form */}
                  {showContactForm && (
                    <form className="mt-6 pt-6 border-t border-border space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Votre nom</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Nom complet"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Téléphone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="+216 XX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="Je suis intéressé par ce bien..."
                          defaultValue={`Je suis intéressé(e) par le bien "${property.title}". Pouvez-vous me recontacter ?`}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Envoyer
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container-custom">
            <h2 className="section-title mb-8">Biens Similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
