import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      content: "+216 71 000 000",
      link: "tel:+21671000000",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@annoncetunisie.tn",
      link: "mailto:contact@annoncetunisie.tn",
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "123 Avenue Habib Bourguiba\n1001 Tunis, Tunisie",
      link: null,
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "Lun - Ven: 9h - 18h\nSam: 9h - 13h",
      link: null,
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contactez-Nous
            </h1>
            <p className="text-muted-foreground text-lg">
              Une question, un projet immobilier ? Notre équipe est à votre disposition 
              pour vous accompagner dans toutes vos démarches.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">
                  Nos Coordonnées
                </h2>
                <p className="text-muted-foreground">
                  N'hésitez pas à nous contacter par téléphone, email ou en 
                  vous rendant directement à notre agence.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{info.title}</div>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-muted-foreground hover:text-primary transition-colors whitespace-pre-line"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <div className="text-muted-foreground whitespace-pre-line">
                          {info.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="pt-8 border-t border-border space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Réponse garantie sous 24h</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Estimation gratuite et sans engagement</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Conseils personnalisés</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
                <h2 className="font-display text-2xl font-semibold mb-6">
                  Envoyez-nous un message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Nom complet <span className="text-primary">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Téléphone <span className="text-primary">*</span>
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+216 XX XXX XXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sujet</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Objet de votre message"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Message <span className="text-primary">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre projet ou posez votre question..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (placeholder) */}
      <section className="h-[400px] bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              Carte Google Maps<br />
              123 Avenue Habib Bourguiba, Tunis
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
