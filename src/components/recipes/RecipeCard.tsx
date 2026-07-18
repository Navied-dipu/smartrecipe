import Link from "next/link";
import { Recipe } from "@/types/recipe";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="glass-card rounded-3xl overflow-hidden recipe-card flex flex-col h-full bg-[#1c1209]/80 border-white/[0.05]">
      {/* Image Placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#2d1810] to-[#1a0e05] flex items-center justify-center">
        <span className="text-6xl drop-shadow-lg opacity-80">
          {recipe.cuisine === "Italian" ? "🍝" : 
           recipe.cuisine === "Mexican" ? "🌮" : 
           recipe.cuisine === "Japanese" ? "🍱" : 
           recipe.cuisine === "Indian" ? "🍛" : "🥗"}
        </span>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-semibold text-white border border-white/10 shadow-sm">
          {recipe.difficulty}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-500/10 text-primary-400 border border-primary-500/20">
            {recipe.cuisine}
          </span>
          {recipe.dietType.map((diet) => (
            <span key={diet} className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-accent-500/10 text-accent-400 border border-accent-500/20">
              {diet}
            </span>
          ))}
        </div>

        <h3 className="font-display text-xl font-bold text-white mb-2 line-clamp-1">{recipe.title}</h3>
        <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">{recipe.description}</p>

        <div className="flex items-center justify-between text-xs font-medium text-neutral-300 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">⏱️</span> {recipe.cookTime} min
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-primary-400">★</span> {recipe.rating}
          </div>
        </div>

        <Link
          href={`/recipes/${recipe.id}`}
          className="w-full py-2.5 rounded-xl border border-white/[0.08] text-center text-sm font-semibold text-white hover:bg-white/[0.05] hover:border-white/20 transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
