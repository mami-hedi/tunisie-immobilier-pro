import { Link } from "react-router-dom";
import { MapPin, Maximize, BedDouble, ArrowRight } from "lucide-react";
import { Property, formatPrice } from "@/data/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const statusBadge = {
    Disponible: null,
    Vendu: "badge-sold",
    Loué: "badge-sold",
  };

  return (
    <div className={cn("property-card group", className)}>
      {/* Image */}
      <div className="image-container aspect-[4/3] relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={property.transactionType === "Vente" ? "badge-sale" : "badge-rent"}>
            {property.transactionType}
          </span>
          {property.status !== "Disponible" && (
            <span className={statusBadge[property.status]}>
              {property.status}
            </span>
          )}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg font-bold text-primary text-lg">
            {formatPrice(property.price, property.transactionType)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <Badge variant="secondary" className="text-xs font-medium">
            {property.type}
          </Badge>
        </div>

        <h3 className="font-display text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm">{property.city}, {property.governorate}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4" />
            <span>{property.surface} m²</span>
          </div>
          {property.rooms > 0 && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" />
              <span>{property.rooms} pièces</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button asChild variant="ghost" className="w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground">
          <Link to={`/bien/${property.id}`}>
            <span>Voir le bien</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
