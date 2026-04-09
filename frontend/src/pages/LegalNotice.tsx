import { Layout } from "@/components/Layout";

export default function LegalNotice() {
  return (
    <Layout>
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Mentions Légales
          </h1>
          <p className="text-muted-foreground text-lg">
            Informations légales concernant le site Annonce Tunisie
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-custom max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-12">
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  1. Éditeur du site
                </h2>
                <div className="text-muted-foreground space-y-2">
                  <p><strong>Raison sociale :</strong> Annonce Tunisie SARL</p>
                  <p><strong>Siège social :</strong> 123 Avenue Habib Bourguiba, 1001 Tunis, Tunisie</p>
                  <p><strong>Téléphone :</strong> +216 71 000 000</p>
                  <p><strong>Email :</strong> contact@annoncetunisie.tn</p>
                  <p><strong>Registre du Commerce :</strong> B123456789</p>
                  <p><strong>Capital social :</strong> 100 000 TND</p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  2. Directeur de la publication
                </h2>
                <p className="text-muted-foreground">
                  Le directeur de la publication est M. Ahmed Ben Ali, en qualité de Gérant.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  3. Hébergement
                </h2>
                <div className="text-muted-foreground space-y-2">
                  <p><strong>Hébergeur :</strong> Lovable Technologies</p>
                  <p><strong>Adresse :</strong> San Francisco, CA, États-Unis</p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  4. Propriété intellectuelle
                </h2>
                <p className="text-muted-foreground">
                  L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) 
                  est la propriété exclusive d'Annonce Tunisie, à l'exception des marques, logos ou 
                  contenus appartenant à d'autres sociétés partenaires ou auteurs. Toute reproduction, 
                  distribution, modification, adaptation, retransmission ou publication de ces différents 
                  éléments est strictement interdite sans l'accord exprès par écrit d'Annonce Tunisie.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  5. Protection des données personnelles
                </h2>
                <p className="text-muted-foreground">
                  Conformément à la loi organique n°2004-63 du 27 juillet 2004 portant sur la protection 
                  des données à caractère personnel, vous disposez d'un droit d'accès, de rectification 
                  et de suppression des données vous concernant. Pour exercer ce droit, vous pouvez nous 
                  contacter à l'adresse suivante : contact@annoncetunisie.tn
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  6. Cookies
                </h2>
                <p className="text-muted-foreground">
                  Ce site utilise des cookies pour améliorer l'expérience utilisateur. En naviguant sur 
                  ce site, vous acceptez l'utilisation de cookies conformément à notre politique de 
                  confidentialité. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  7. Limitation de responsabilité
                </h2>
                <p className="text-muted-foreground">
                  Annonce Tunisie ne pourra être tenue responsable des dommages directs et indirects 
                  causés au matériel de l'utilisateur lors de l'accès au site. Annonce Tunisie décline 
                  toute responsabilité quant à l'utilisation qui pourrait être faite des informations 
                  et contenus présents sur le site.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">
                  8. Droit applicable
                </h2>
                <p className="text-muted-foreground">
                  Le présent site et ses mentions légales sont régis par le droit tunisien. 
                  En cas de litige, les tribunaux tunisiens seront seuls compétents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
