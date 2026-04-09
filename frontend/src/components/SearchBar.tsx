import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { governorates, propertyTypes, transactionTypes } from "@/data/properties";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  variant?: "hero" | "page";
  className?: string;
}

export function SearchBar({ variant = "hero", className }: SearchBarProps) {
  const navigate = useNavigate();
  const [governorate, setGovernorate] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [budget, setBudget] = useState("");

  const budgetOptions = [
    { value: "0-100000", label: "Moins de 100 000 TND" },
    { value: "100000-300000", label: "100 000 - 300 000 TND" },
    { value: "300000-500000", label: "300 000 - 500 000 TND" },
    { value: "500000-1000000", label: "500 000 - 1 000 000 TND" },
    { value: "1000000+", label: "Plus de 1 000 000 TND" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (governorate) params.set("gouvernorat", governorate);
    if (propertyType) params.set("type", propertyType);
    if (transactionType) params.set("transaction", transactionType);
    if (budget) params.set("budget", budget);
    
    navigate(`/biens?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "w-full",
        isHero
          ? "bg-background/95 backdrop-blur-custom rounded-2xl p-6 shadow-xl"
          : "bg-card rounded-xl p-4 shadow-card border border-border",
        className
      )}
    >
      <div className={cn(
        "grid gap-4",
        isHero
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
      )}>
        {/* Gouvernorat */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Gouvernorat</label>
          <Select value={governorate} onValueChange={setGovernorate}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Toute la Tunisie" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">Toute la Tunisie</SelectItem>
              {governorates.map((gov) => (
                <SelectItem key={gov} value={gov}>
                  {gov}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type de bien */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Type de bien</label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">Tous les types</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transaction */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Transaction</label>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Vente / Location" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">Vente / Location</SelectItem>
              {transactionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Budget</label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Tous budgets" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">Tous budgets</SelectItem>
              {budgetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className={cn("flex items-end", isHero && "lg:col-span-1")}>
          <Button
            onClick={handleSearch}
            className="w-full h-10"
            size="lg"
          >
            <Search className="h-5 w-5 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
}
