import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

// Adaptateur : convertit le format API → format PropertyCard
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
    address: a.adresse || '',
    description: a.description || '',
    images: a.image_principale
      ? [`http://localhost:5000${a.image_principale}`]
      : ['/placeholder.svg'],
    features: [],
    contact: {
      name: a.nom_contact || '',
      phone: a.tel_contact || '',
      email: a.email_contact || '',
    },
    createdAt: a.created_at,
    isFeatured: false,
  };
}

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode]     = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy]         = useState("recent");
  const [properties, setProperties] = useState<any[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const LIMIT = 12;

  // Filtres depuis l'URL
  const selectedGovernorate = searchParams.get("gouvernorat") || "";
  const selectedType        = searchParams.get("type")        || "";
  const selectedTransaction = searchParams.get("transaction") || "";
  const selectedBudget      = searchParams.get("budget")      || "";
  const searchQuery         = searchParams.get("search")      || "";

  const fetchProperties = useCallback(async (currentPage = 1, append = false) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: LIMIT,
        statut: 'active',
      };

      if (selectedGovernorate && selectedGovernorate !== 'all')
        params.gouvernorat = selectedGovernorate;
      if (selectedType && selectedType !== 'all')
        params.type_bien = selectedType;
      if (selectedTransaction && selectedTransaction !== 'all')
        params.type_transaction = selectedTransaction;
      if (searchQuery)
        params.search = searchQuery;

      // Budget
      if (selectedBudget && selectedBudget !== 'all') {
        const [min, max] = selectedBudget.split('-').map(v => parseInt(v.replace('+', '')));
        params.prix_min = min;
        if (!selectedBudget.includes('+')) params.prix_max = max;
      }

      // Tri
      if (sortBy === 'price-asc')  { params.sort = 'prix'; params.order = 'ASC'; }
      if (sortBy === 'price-desc') { params.sort = 'prix'; params.order = 'DESC'; }
      if (sortBy === 'surface-desc') { params.sort = 'surface'; params.order = 'DESC'; }

      const data = await api.getAnnonces(params);
      const adapted = (data.annonces || []).map(adaptAnnonce);

      setProperties(prev => append ? [...prev, ...adapted] : adapted);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError('Impossible de charger les annonces. Vérifiez que le serveur est lancé.');
    } finally {
      setLoading(false);
    }
  }, [selectedGovernorate, selectedType, selectedTransaction, selectedBudget, searchQuery, sortBy]);

  // Rechargement à chaque changement de filtre
  useEffect(() => {
    setPage(1);
    fetchProperties(1, false);
  }, [fetchProperties]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage, true);
  };

  const hasMore = properties.length < total;

  return (
    <Layout>
      {/* Page Header */}
      <section className="pt-32 pb-12 bg-muted">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nos Biens Immobiliers
            </h1>
            <p className="text-muted-foreground text-lg">
              Explorez notre catalogue de biens sélectionnés avec soin.
              Appartements, villas, terrains et locaux commerciaux dans toute la Tunisie.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-background border-b border-border sticky top-[72px] z-40">
        <div className="container-custom">
          <SearchBar variant="page" />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-background">
        <div className="container-custom">

          {/* Results header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <p className="text-muted-foreground">
              {loading && properties.length === 0 ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Chargement...
                </span>
              ) : (
                <>
                  <span className="font-semibold text-foreground">{total}</span>{" "}
                  bien{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
                </>
              )}
            </p>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="surface-desc">Surface</SelectItem>
                </SelectContent>
              </Select>

              {/* View mode toggle */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button variant="ghost" size="sm"
                  className={cn("rounded-none px-3", viewMode === "grid" && "bg-muted")}
                  onClick={() => setViewMode("grid")}>
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm"
                  className={cn("rounded-none px-3", viewMode === "list" && "bg-muted")}
                  onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200 mb-8">
              <p className="text-red-600 font-medium">⚠️ {error}</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchProperties(1)}>
                Réessayer
              </Button>
            </div>
          )}

          {/* Résultats */}
          {!error && (
            <>
              {properties.length > 0 ? (
                <div className={cn(
                  "grid gap-8",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                )}>
                  {properties.map((property, index) => (
                    <div key={property.id} className="animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}>
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              ) : !loading ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <List className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-2">Aucun bien trouvé</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Aucun bien ne correspond à vos critères de recherche.
                    Essayez de modifier vos filtres ou contactez-nous.
                  </p>
                </div>
              ) : null}

              {/* Bouton charger plus */}
              {hasMore && !loading && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" onClick={handleLoadMore}
                    className="px-10 border-2">
                    Voir plus de biens ({total - properties.length} restants)
                  </Button>
                </div>
              )}

              {/* Spinner "charger plus" */}
              {loading && properties.length > 0 && (
                <div className="text-center mt-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </Layout>
  );
}