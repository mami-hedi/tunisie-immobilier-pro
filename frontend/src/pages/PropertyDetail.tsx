import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertyCard } from "@/components/PropertyCard";
import { api } from "@/lib/api";
import {
  ArrowLeft, MapPin, Maximize, BedDouble, Bath,
  Phone, MessageCircle, Mail, Share2, Heart,
  ChevronLeft, ChevronRight, Check, Loader2,
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

function formatPrice(price: number, transaction: string) {
  const formatted = new Intl.NumberFormat("fr-TN").format(price);
  return transaction === "location"
    ? `${formatted} DT / mois`
    : `${formatted} DT`;
}

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
    images: a.images?.length
      ? a.images.map((img: any) => `${BASE_URL}${img.url}`)
      : ["/placeholder.svg"],
    features: a.features || [],
    contact: {
      name: a.nom_contact || "",
      phone: a.tel_contact || "",
      email: a.email_contact || "",
    },
    createdAt: a.created_at,
  };
}

function adaptAnnonceSimple(a: any) {
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
    contact: { name: a.nom_contact || "", phone: a.tel_contact || "", email: a.email_contact || "" },
    createdAt: a.created_at,
    isFeatured: false,
  };
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty]         = useState<any>(null);
  const [similar, setSimilar]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm]     = useState(false);
  const [formData, setFormData] = useState({ nom: "", tel: "", message: "" });
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    setCurrentImageIndex(0);

    api.getAnnonce(Number(id))
      .then((data: any) => {
        const adapted = adaptAnnonce(data);
        setProperty(adapted);

        // Charger les biens similaires (même type_bien)
        return api.getAnnonces({
          type_bien: data.type_bien,
          statut: "active",
          limit: 4,
        }).then((res: any) => {
          const others = (res.annonces || [])
            .filter((a: any) => String(a.id) !== String(id))
            .slice(0, 3)
            .map(adaptAnnonceSimple);
          setSimilar(others);
        });
      })
      .catch(() => setError("Ce bien n'existe pas ou a été retiré."))
      .finally(() => setLoading(false));
  }, [id]);

  const nextImage = () =>
    setCurrentImageIndex(p => (p + 1) % property.images.length);
  const prevImage = () =>
    setCurrentImageIndex(p => (p - 1 + property.images.length) % property.images.length);

  const handleWhatsApp = () => {
    const phone = property.contact?.phone || "+21658146177";
    const msg = encodeURIComponent(
      `Bonjour, je suis intéressé(e) par le bien "${property.title}" (Réf: ${property.id}) à ${property.city}. Pouvez-vous me donner plus d'informations ?`
    );
    window.open(`https://wa.me/${phone.replace(/\s+/g, "")}?text=${msg}`, "_blank");
  };

  const handleCall = () => {
    const phone = property.contact?.phone || "+21658146177";
    window.open(`tel:${phone}`, "_self");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: property.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulation envoi (à connecter à une vraie route email si besoin)
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setSending(false);
  };

  // ── États de chargement / erreur ──────────────────────
  if (loading) return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center pt-24">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du bien...</p>
        </div>
      </div>
    </Layout>
  );

  if (error || !property) return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Bien non trouvé</h1>
          <p className="text-muted-foreground mb-8">
            {error || "Ce bien n'existe pas ou a été retiré de notre catalogue."}
          </p>
          <Button asChild>
            <Link to="/biens">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux biens
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );

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
            <span className="text-foreground truncate max-w-xs">{property.title}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Colonne gauche ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Galerie */}
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10]">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />

                {property.images.length > 1 && (
                  <>
                    <button onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white
                    ${property.transactionType === "vente" ? "bg-blue-600" : "bg-green-600"}`}>
                    {property.transactionType === "vente" ? "Vente" : "Location"}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Miniatures */}
              {property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {property.images.map((img: string, i: number) => (
                    <button key={i} onClick={() => setCurrentImageIndex(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition
                        ${i === currentImageIndex ? "border-primary" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Infos */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="text-sm capitalize">{property.type}</Badge>
                  <span className="text-muted-foreground text-sm">Réf: {property.id}</span>
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {property.title}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>
                    {[property.address, property.city, property.governorate]
                      .filter(Boolean).join(", ")}
                  </span>
                </div>

                {/* Stats clés */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted rounded-xl mb-8">
                  {property.surface > 0 && (
                    <div className="text-center">
                      <Maximize className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.surface} m²</div>
                      <div className="text-sm text-muted-foreground">Surface</div>
                    </div>
                  )}
                  {property.rooms > 0 && (
                    <div className="text-center">
                      <BedDouble className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.rooms}</div>
                      <div className="text-sm text-muted-foreground">Pièces</div>
                    </div>
                  )}
                  {property.bedrooms > 0 && (
                    <div className="text-center">
                      <BedDouble className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Chambres</div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="text-center">
                      <Bath className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Sdb</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {property.description && (
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-semibold mb-4">Description</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Équipements */}
                {property.features.length > 0 && (
                  <div>
                    <h2 className="font-display text-2xl font-semibold mb-4">Caractéristiques</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Colonne droite — Contact ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card">

                  {/* Prix */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="text-sm text-muted-foreground mb-1">Prix</div>
                    <div className="font-display text-3xl font-bold text-primary">
                      {formatPrice(property.price, property.transactionType)}
                    </div>
                  </div>

                  {/* Contact vendeur */}
                  {property.contact?.name && (
                    <div className="mb-6 pb-6 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-xl">
                            {property.contact.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{property.contact.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {property.contact.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Boutons */}
                  <div className="space-y-3">
                    <Button onClick={handleCall} className="w-full" size="lg">
                      <Phone className="mr-2 h-5 w-5" /> Appeler
                    </Button>
                    <Button onClick={handleWhatsApp} variant="secondary" className="w-full" size="lg">
                      <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
                    </Button>
                    <Button onClick={() => setShowContactForm(!showContactForm)}
                      variant="outline" className="w-full" size="lg">
                      <Mail className="mr-2 h-5 w-5" /> Envoyer un message
                    </Button>
                  </div>

                  {/* Formulaire contact */}
                  {showContactForm && (
                    <form onSubmit={handleSendMessage}
                      className="mt-6 pt-6 border-t border-border space-y-4">
                      {sent ? (
                        <div className="text-center py-4">
                          <Check className="h-10 w-10 text-green-500 mx-auto mb-2" />
                          <p className="font-medium text-green-600">Message envoyé !</p>
                          <p className="text-sm text-muted-foreground">Nous vous recontacterons bientôt.</p>
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2">Votre nom</label>
                            <input type="text" required
                              value={formData.nom}
                              onChange={e => setFormData(p => ({ ...p, nom: e.target.value }))}
                              className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Nom complet" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Téléphone</label>
                            <input type="tel" required
                              value={formData.tel}
                              onChange={e => setFormData(p => ({ ...p, tel: e.target.value }))}
                              className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="+216 XX XXX XXX" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Message</label>
                            <textarea rows={3} required
                              value={formData.message}
                              onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                              className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                              defaultValue={`Je suis intéressé(e) par "${property.title}". Pouvez-vous me recontacter ?`} />
                          </div>
                          <Button type="submit" className="w-full" disabled={sending}>
                            {sending ? (
                              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...</>
                            ) : "Envoyer"}
                          </Button>
                        </>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biens similaires */}
      {similar.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container-custom">
            <h2 className="section-title mb-8">Biens Similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similar.map((p: any) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}