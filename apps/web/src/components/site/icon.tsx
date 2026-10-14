// Icons stored by name in the database (categories, forum rooms). An explicit
// map keeps the bundle small; unknown names fall back to a tag.
import {
  BedDouble, BookOpen, Brain, Briefcase, Code, Coffee, Dumbbell, GraduationCap, HeartPulse, Landmark, Languages, Laptop,
  Megaphone, MessageCircle, NotebookPen, Palette, Rocket, Shirt, ShoppingBag, ShoppingBasket, Smartphone, Sofa, Sparkles,
  Sprout, Tag, Trophy, Tv, Utensils, Wheat, Wrench,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "bed-double": BedDouble, "book-open": BookOpen, brain: Brain, briefcase: Briefcase, code: Code, coffee: Coffee,
  dumbbell: Dumbbell, "graduation-cap": GraduationCap, "heart-pulse": HeartPulse, landmark: Landmark, languages: Languages,
  laptop: Laptop, megaphone: Megaphone, "message-circle": MessageCircle, "notebook-pen": NotebookPen, palette: Palette,
  rocket: Rocket, shirt: Shirt, "shopping-bag": ShoppingBag, "shopping-basket": ShoppingBasket, smartphone: Smartphone,
  sofa: Sofa, sparkles: Sparkles, sprout: Sprout, trophy: Trophy, tv: Tv, utensils: Utensils, wheat: Wheat, wrench: Wrench,
};

export const ICON_NAMES = Object.keys(ICONS);

export function NamedIcon({ name, className }: { name: string | null | undefined; className?: string }) {
  const Icon = (name && ICONS[name]) || Tag;
  return <Icon className={className} />;
}
