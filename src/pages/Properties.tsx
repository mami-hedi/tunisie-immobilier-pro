import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProperties, governorates, propertyTypes, transactionTypes } from "@/data/properties";
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  // Get filter values from URL
  const selectedGovernorate = searchParams.get("gouvernorat") || "";
  const selectedType = searchParams.get("type") || "";
  const selectedTransaction = searchParams.get("transaction") || "";
  const selectedBudget = searchParams.get("budget") || "";

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...mockProperties];

    // Apply filters
    if (selectedGovernorate && selectedGovernorate !== "all") {
      result = result.filter((p) => p.governorate === selectedGovernorate);
    }
    if (selectedType && selectedType !== "all") {
      result = result.filter((p) => p.type === selectedType);
    }
    if (selectedTransaction && selectedTransaction !== "all") {
      result = result.filter((p) => p.transactionType === selectedTransaction);
    }
    if (selectedBudget && selectedBudget !== "all") {
      const [min, max] = selectedBudget.split("-").map((v) => parseInt(v.replace("+", "")));
      result = result.filter((p) => {
        if (selectedBudget.includes("+")) {
          return p.price >= min;
        }
        return p.price >= min && p.price <= max;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "surface-desc":
        result.sort((a, b) => b.surface - a.surface);
        break;
      case "recent":
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [selectedGovernorate, selectedType, selectedTransaction, selectedBudget, sortBy]);

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
              <span className="font-semibold text-foreground">{filteredProperties.length}</span>{" "}
              bien{filteredProperties.length > 1 ? "s" : ""} trouvé{filteredProperties.length > 1 ? "s" : ""}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-none px-3",
                    viewMode === "grid" && "bg-muted"
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-none px-3",
                    viewMode === "list" && "bg-muted"
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results grid */}
          {filteredProperties.length > 0 ? (
            <div
              className={cn(
                "grid gap-8",
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <List className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                Aucun bien trouvé
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Aucun bien ne correspond à vos critères de recherche. 
                Essayez de modifier vos filtres ou contactez-nous pour une recherche personnalisée.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
