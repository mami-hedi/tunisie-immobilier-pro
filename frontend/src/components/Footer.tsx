import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

// TikTok n'existe pas dans lucide-react : icône maison au même style (stroke, 24x24)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const footerLinks = {
  navigation: [
    { name: "Accueil", href: "/" },
  { name: "Vente", href: "/biens?transaction=Vente" },
  { name: "Location", href: "/biens?transaction=Location" },
  { name: "À Propos", href: "/a-propos" },
  { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Achat immobilier", href: "/biens?type=Vente" },
    { name: "Location", href: "/biens?type=Location" },
    { name: "Estimation gratuite", href: "/contact" },
    { name: "Conseils personnalisés", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 h-16">
              <div className="flex items-center h-full">
                <div className="ml-2 h-full flex items-center">
                  Annonce Tunisie Tunisie
                </div>
              </div>
            </Link>
            <p className="text-secondary-foreground/70 leading-relaxed">
              Votre partenaire de confiance pour tous vos projets immobiliers en Tunisie. 
             
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61552025910201"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/annonce_tunisie_tunisie/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@annoncetunisietunisie"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Navigation</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Nos Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-secondary-foreground/70">
                  8050 Hammamet, Tunisie
                </span>
              </li>
              <li>
                <a
                  href="tel:+21671000000"
                  className="flex items-center gap-3 text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  +216 20 007 193
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@annoncetunisie.tn"
                  className="flex items-center gap-3 text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  contact@annonce-tunisie-tunisie.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 flex justify-center text-center">
  <p className="text-secondary-foreground/50 text-sm">
    © {new Date().getFullYear()} Annonce Tunisie Tunisie. Tous droits réservés. 
    <br />
    Créé par{" "}
    <a
      href="https://www.mh-digital-solution.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary underline"
    >
      MH Digital Solution
    </a>
  </p>
</div>
      </div>
    </footer>
  );
}