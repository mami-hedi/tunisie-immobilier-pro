import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LogoAnnonce from '../assets/logo_annoonce_tunsietunisie.png';

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Vente", href: "/biens?transaction=Vente" },
  { name: "Location", href: "/biens?transaction=Location" },
  { name: "À Propos", href: "/a-propos" },
 
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const location = useLocation();
  const headerRef = useRef(null);

  // Calcul dynamique de la hauteur du header
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }

    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.getBoundingClientRect().height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-custom border-b border-border"
      >
        {/* Top bar */}
        <div className="bg-secondary text-secondary-foreground py-2 hidden md:block">
          <div className="container-custom flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+21671000000" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span>+216 71 000 000</span>
              </a>
              <a href="mailto:contact@annoncetunisie.tn" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                <span>contact@annoncetunisie.tn</span>
              </a>
            </div>
            <div className="text-secondary-foreground/70">
              Votre agence immobilière de confiance
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 h-40">
              <div className="flex items-center h-full">
                <div className="ml-2 h-full flex items-center">
                  <img 
                    src={LogoAnnonce} 
                    alt="Annonce Tunisie" 
                    className="max-h-full object-contain"
                  />
                </div>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "nav-link font-medium",
                    location.pathname === item.href ? "text-primary after:w-full" : ""
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button asChild>
                <Link to="/contact">
                  Nous Contacter
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
              <div className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-lg font-medium py-2 transition-colors",
                      location.pathname === item.href
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Nous Contacter
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main content avec padding dynamique */}
      <main style={{ paddingTop: `${headerHeight}px` }}>
        {/* Contenu de la page ici */}
      </main>
    </>
  );
}
