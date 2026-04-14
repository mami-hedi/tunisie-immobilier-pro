import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// ✅ URL dynamique selon l'environnement
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const GOUVERNORATS = [
  'Tunis','Ariana','Ben Arous','Manouba','Nabeul','Zaghouan','Bizerte',
  'Béja','Jendouba','Kef','Siliana','Sousse','Monastir','Mahdia',
  'Sfax','Kairouan','Kasserine','Sidi Bouzid','Gabès','Médenine',
  'Tataouine','Gafsa','Tozeur','Kébili'
];

const FEATURES = [
  'Climatisation','Chauffage','Ascenseur','Parking','Piscine',
  'Jardin','Terrasse','Balcon','Meublé','Gardien','Interphone',
  'Fibre optique','Panneaux solaires','Cave'
];

const defaultForm = {
  titre: '', description: '', type_bien: 'appartement',
  type_transaction: 'vente', prix: '', surface: '',
  nb_pieces: '', nb_chambres: '', nb_salles_bain: '',
  gouvernorat: 'Tunis', ville: '', adresse: '',
  nom_contact: '', tel_contact: '', email_contact: '',
  statut: 'active',
};

export default function AnnonceForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm]               = useState(defaultForm);
  const [features, setFeatures]       = useState<string[]>([]);
  const [images, setImages]           = useState<string[]>([]);
  const [files, setFiles]             = useState<File[]>([]);
  const [previews, setPreviews]       = useState<string[]>([]);
  const [loading, setLoading]         = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.getAnnonce(Number(id))
      .then((data: any) => {
        const { images: imgs, features: feats, ...rest } = data;
        setForm({
          titre:          rest.titre          || '',
          description:    rest.description    || '',
          type_bien:      rest.type_bien      || 'appartement',
          type_transaction: rest.type_transaction || 'vente',
          prix:           rest.prix           || '',
          surface:        rest.surface        || '',
          nb_pieces:      rest.nb_pieces      || '',
          nb_chambres:    rest.nb_chambres    || '',
          nb_salles_bain: rest.nb_salles_bain || '',
          gouvernorat:    rest.gouvernorat    || 'Tunis',
          ville:          rest.ville          || '',
          adresse:        rest.adresse        || '',
          nom_contact:    rest.nom_contact    || '',
          tel_contact:    rest.tel_contact    || '',
          email_contact:  rest.email_contact  || '',
          statut:         rest.statut         || 'active',
        });
        setFeatures(feats || []);
        setImages(imgs?.map((i: any) => i.url) || []);
      })
      .catch(() => toast.error('Annonce introuvable'))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleFeature = (f: string) => {
    setFeatures(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selected]);
    setPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
  };

  const removeNewImage      = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };
  const removeExistingImage = (i: number) =>
    setImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titre || !form.prix || !form.ville) {
      toast.error('Titre, prix et ville sont obligatoires');
      return;
    }
    setLoading(true);
    try {
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        const result = await api.uploadImages(files);
        uploadedUrls = result.urls || [];
      }

      const payload = {
        ...form,
        features,
        images: [...images, ...uploadedUrls],
      };

      if (isEdit) {
        await api.updateAnnonce(Number(id), payload);
        toast.success('Annonce mise à jour ✅');
      } else {
        await api.createAnnonce(payload);
        toast.success('Annonce créée ✅');
      }
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          🏠 {isEdit ? 'Modifier' : 'Nouvelle'} annonce
        </h1>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm"
            onClick={() => navigate('/admin/dashboard')}>
            ← Retour
          </Button>
          <Button variant="outline" size="sm"
            className="text-white border-red-500 bg-red-500 hover:bg-red-600"
            onClick={() => { logout(); navigate('/admin'); }}>
            Déconnexion
          </Button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Informations principales */}
        <Section title="📋 Informations principales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Titre de l'annonce *</Label>
              <Input name="titre" value={form.titre} onChange={handleChange}
                placeholder="Ex: Appartement S+2 vue mer à Sousse" required />
            </div>

            <div>
              <Label>Type de bien *</Label>
              <select name="type_bien" value={form.type_bien} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                {['appartement','maison','villa','terrain','local','bureau'].map(t => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Type de transaction *</Label>
              <select name="type_transaction" value={form.type_transaction} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                <option value="vente">Vente</option>
                <option value="location">Location</option>
              </select>
            </div>

            <div>
              <Label>Prix (DT) *</Label>
              <Input name="prix" type="number" value={form.prix} onChange={handleChange}
                placeholder="Ex: 250000" required min="0" />
            </div>

            <div>
              <Label>Surface (m²)</Label>
              <Input name="surface" type="number" value={form.surface} onChange={handleChange}
                placeholder="Ex: 120" min="0" />
            </div>

            <div>
              <Label>Nombre de pièces</Label>
              <Input name="nb_pieces" type="number" value={form.nb_pieces} onChange={handleChange}
                placeholder="Ex: 4" min="0" />
            </div>

            <div>
              <Label>Chambres</Label>
              <Input name="nb_chambres" type="number" value={form.nb_chambres} onChange={handleChange}
                placeholder="Ex: 3" min="0" />
            </div>

            <div>
              <Label>Salles de bain</Label>
              <Input name="nb_salles_bain" type="number" value={form.nb_salles_bain} onChange={handleChange}
                placeholder="Ex: 2" min="0" />
            </div>

            <div>
              <Label>Statut</Label>
              <select name="statut" value={form.statut} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="en_attente">En attente</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Label>Description</Label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={5} placeholder="Décrivez le bien en détail..."
                className="w-full border rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </Section>

        {/* Localisation */}
        <Section title="📍 Localisation">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Gouvernorat *</Label>
              <select name="gouvernorat" value={form.gouvernorat} onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                {GOUVERNORATS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <Label>Ville *</Label>
              <Input name="ville" value={form.ville} onChange={handleChange}
                placeholder="Ex: Sousse" required />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input name="adresse" value={form.adresse} onChange={handleChange}
                placeholder="Ex: Rue de la République" />
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section title="📞 Contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Nom</Label>
              <Input name="nom_contact" value={form.nom_contact} onChange={handleChange}
                placeholder="Ex: Mohamed Ali" />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input name="tel_contact" value={form.tel_contact} onChange={handleChange}
                placeholder="Ex: +216 20 000 000" />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email_contact" type="email" value={form.email_contact} onChange={handleChange}
                placeholder="Ex: contact@email.com" />
            </div>
          </div>
        </Section>

        {/* Équipements */}
        <Section title="✨ Équipements & caractéristiques">
          <div className="flex flex-wrap gap-2">
            {FEATURES.map(f => (
              <button key={f} type="button" onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-full text-sm border transition
                  ${features.includes(f)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>
                {f}
              </button>
            ))}
          </div>
        </Section>

        {/* Photos */}
        <Section title="📸 Photos">
          {/* ✅ Images existantes avec BASE_URL dynamique */}
          {images.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Images actuelles :</p>
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative w-28 h-28">
                    <img
                      src={url.startsWith('http') ? url : `${BASE_URL}${url}`}
                      alt=""
                      className="w-full h-full object-cover rounded-lg border"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 rounded">
                        Principale
                      </span>
                    )}
                    <button type="button" onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nouvelles images */}
          {previews.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Nouvelles images :</p>
              <div className="flex flex-wrap gap-3">
                {previews.map((url, i) => (
                  <div key={i} className="relative w-28 h-28">
                    <img src={url} alt=""
                      className="w-full h-full object-cover rounded-lg border" />
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
            <span className="text-3xl mb-1">📁</span>
            <span className="text-sm text-gray-500">Cliquez pour ajouter des photos</span>
            <span className="text-xs text-gray-400">JPG, PNG, WEBP — max 5 Mo par image</span>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </label>
        </Section>

        {/* Boutons */}
        <div className="flex gap-4 justify-end pb-10">
          <Button type="button" variant="outline"
            onClick={() => navigate('/admin/dashboard')}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-8">
            {loading
              ? 'Enregistrement...'
              : isEdit ? '💾 Mettre à jour' : '➕ Créer l\'annonce'}
          </Button>
        </div>

      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-700 mb-4 pb-2 border-b">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-gray-600 mb-1">{children}</p>;
}