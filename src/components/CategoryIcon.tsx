import React from 'react';
import {
  Laptop,
  Palette,
  Film,
  Megaphone,
  Star,
  Home,
  Car,
  ShoppingBag,
  UserCheck,
  GraduationCap,
  Briefcase,
  Building2,
  Truck,
  PartyPopper,
  Sparkles,
  HeartHandshake,
  Wheat,
  Package,
  Boxes,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'Megaphone':
      return <Megaphone className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Truck':
      return <Truck className={className} />;
    case 'PartyPopper':
      return <PartyPopper className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Wheat':
      return <Wheat className={className} />;
    case 'Package':
      return <Package className={className} />;
    default:
      return <Boxes className={className} />;
  }
};
