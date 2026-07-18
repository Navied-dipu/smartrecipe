"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const CUISINES = [
  "Italian", "Mexican", "Indian", "Japanese", "Thai",
  "Mediterranean", "American", "French", "Chinese", "Greek",
  "Spanish", "Lebanese", "Korean", "Vietnamese",
];

const DIET_TYPES = [
  "Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo",
  "Dairy-Free", "Low-Carb", "High-Protein",
];

const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Short description must be at least 10 characters"),
  fullDescription: z.string().optional(),
  ingredients: z.array(z.object({ value: z.string().min(1, "Ingredient cannot be empty") })).min(1, "Add at least one ingredient"),
  steps: z.array(z.object({ value: z.string().min(1, "Step cannot be empty") })).min(1, "Add at least one step"),
  cuisine: z.string().min(1, "Please select a cuisine"),
  dietType: z.array(z.string()).optional(),
  cookTimeMinutes: z.number({ message: "Cook time must be a number" }).min(1, "Cook time must be at least 1 minute"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function AddRecipeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // AI Panel state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLength, setAiLength] = useState<"short" | "detailed">("detailed");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Selected diet types
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: [{ value: "" }],
      steps: [{ value: "" }],
      difficulty: "Easy",
      cookTimeMinutes: 30,
      cuisine: "",
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: "steps" });

  const toggleDiet = (diet: string) => {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  const generateRecipe = useCallback(async () => {
    if (!aiPrompt.trim()) {
      setAiError("Please enter a prompt first.");
      return;
    }
    setIsGenerating(true);
    setAiError(null);

    try {
      const res = await fetch(`${API_URL}/api/ai/generate-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: aiPrompt, length: aiLength }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Pre-fill form fields from AI response
      if (data.title) setValue("title", data.title);
      if (data.description) setValue("description", data.description);
      if (data.fullDescription) setValue("fullDescription", data.fullDescription);
      if (data.cookTimeMinutes) setValue("cookTimeMinutes", data.cookTimeMinutes);
      if (data.difficulty && ["Easy", "Medium", "Hard"].includes(data.difficulty)) {
        setValue("difficulty", data.difficulty);
      }
      if (data.cuisine) setValue("cuisine", data.cuisine);
      if (data.imageUrl) setValue("imageUrl", data.imageUrl);
      if (data.dietType?.length) setSelectedDiets(data.dietType);

      if (data.ingredients?.length) {
        // Replace all ingredient fields
        const count = ingredientFields.length;
        for (let i = count - 1; i >= 0; i--) removeIngredient(i);
        data.ingredients.forEach((ing: string) => appendIngredient({ value: ing }));
      }
      if (data.steps?.length || data.instructions?.length) {
        const instructions = data.steps || data.instructions;
        const count = stepFields.length;
        for (let i = count - 1; i >= 0; i--) removeStep(i);
        instructions.forEach((step: string) => appendStep({ value: step }));
      }

      setHasGenerated(true);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt, aiLength, setValue, ingredientFields.length, stepFields.length, appendIngredient, appendStep, removeIngredient, removeStep]);

  const onSubmit = async (data: RecipeFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...data,
        ingredients: data.ingredients.map((i) => i.value),
        steps: data.steps.map((s) => s.value),
        dietType: selectedDiets,
      };

      const res = await fetch(`${API_URL}/api/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      router.push("/recipes/manage");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full bg-white/[0.03] border ${
      hasError
        ? "border-red-500/50 focus:ring-red-500/20"
        : "border-white/10 focus:border-[#E8872B]/50 focus:ring-[#E8872B]/20"
    } rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all`;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
          Add a <span className="gradient-text">Recipe</span>
        </h1>
        <p className="text-neutral-400 text-lg">
          Share your creation with the community — or let AI draft it for you.
        </p>
      </div>

      {/* ── AI Generate Panel ── */}
      <div className="glass-card rounded-2xl p-6 mb-8 border border-[#E8872B]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8872B]/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8872B] to-[#C0543A] flex items-center justify-center text-lg shadow-lg">
              ✨
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Generate with AI</h2>
              <p className="text-neutral-400 text-sm">Describe a dish and let AI fill the form</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. spicy Thai basil chicken with jasmine rice"
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#E8872B]/50 focus:ring-2 focus:ring-[#E8872B]/20 transition-all"
              onKeyDown={(e) => e.key === "Enter" && generateRecipe()}
            />
            {/* Length Toggle */}
            <div className="flex items-center bg-white/[0.05] rounded-xl p-1 border border-white/10 shrink-0">
              {(["short", "detailed"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAiLength(opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    aiLength === opt
                      ? "bg-gradient-to-r from-[#E8872B] to-[#C0543A] text-white shadow"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {aiError && (
            <p className="text-red-400 text-sm mb-3">{aiError}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={generateRecipe}
              disabled={isGenerating || !aiPrompt.trim()}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>✨ {hasGenerated ? "Regenerate" : "Generate Recipe"}</>
              )}
            </button>
            {hasGenerated && (
              <p className="text-accent-400 text-sm flex items-center gap-1.5">
                <span>✓</span> Fields pre-filled — edit as needed
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Shimmer overlay while generating */}
      {isGenerating && (
        <div className="space-y-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-12 rounded-xl shimmer delay-${(i + 1) * 100}`} />
          ))}
        </div>
      )}

      {/* ── Recipe Form ── */}
      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <section className="glass-card rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-bold text-base border-b border-white/[0.06] pb-3">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Recipe Title <span className="text-red-400">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="e.g. Creamy Tuscan Garlic Chicken"
              className={inputClass(!!errors.title)}
            />
            {errors.title && <p className="mt-1.5 text-sm text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Short Description <span className="text-red-400">*</span>
            </label>
            <input
              {...register("description")}
              placeholder="A one-liner that sells this dish"
              className={inputClass(!!errors.description)}
            />
            {errors.description && <p className="mt-1.5 text-sm text-red-400">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Full Description
              <span className="text-neutral-500 text-xs ml-2">(optional)</span>
            </label>
            <textarea
              {...register("fullDescription")}
              rows={4}
              placeholder="Describe the dish in detail — flavors, origins, what makes it special…"
              className={`${inputClass()} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Image URL
              <span className="text-neutral-500 text-xs ml-2">(optional)</span>
            </label>
            <input
              {...register("imageUrl")}
              placeholder="https://example.com/image.jpg"
              className={inputClass(!!errors.imageUrl)}
            />
            {errors.imageUrl && <p className="mt-1.5 text-sm text-red-400">{errors.imageUrl.message}</p>}
            {watch("imageUrl") && !errors.imageUrl && (
              <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={watch("imageUrl")} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </div>
        </section>

        {/* Details */}
        <section className="glass-card rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-bold text-base border-b border-white/[0.06] pb-3">
            Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Cuisine <span className="text-red-400">*</span>
              </label>
              <select
                {...register("cuisine")}
                className={`${inputClass(!!errors.cuisine)} appearance-none`}
              >
                <option value="">Select cuisine</option>
                {CUISINES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.cuisine && <p className="mt-1.5 text-sm text-red-400">{errors.cuisine.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Cook Time (mins) <span className="text-red-400">*</span>
              </label>
              <input
                {...register("cookTimeMinutes", { valueAsNumber: true })}
                type="number"
                min={1}
                placeholder="30"
                className={inputClass(!!errors.cookTimeMinutes)}
              />
              {errors.cookTimeMinutes && <p className="mt-1.5 text-sm text-red-400">{errors.cookTimeMinutes.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Difficulty <span className="text-red-400">*</span>
              </label>
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                {(["Easy", "Medium", "Hard"] as const).map((d) => {
                  const selected = watch("difficulty") === d;
                  const color = d === "Easy" ? "from-accent-600 to-accent-500" : d === "Medium" ? "from-primary-600 to-primary-500" : "from-secondary-600 to-secondary-500";
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setValue("difficulty", d)}
                      className={`flex-1 py-3 text-sm font-semibold transition-all ${
                        selected
                          ? `bg-gradient-to-r ${color} text-white`
                          : "bg-white/[0.02] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Diet Type chips */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Diet Type
              <span className="text-neutral-500 text-xs ml-2">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DIET_TYPES.map((diet) => {
                const active = selectedDiets.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDiet(diet)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      active
                        ? "bg-[#E8872B]/20 border-[#E8872B]/60 text-[#E8872B]"
                        : "border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-base border-b border-white/[0.06] pb-3">
            Ingredients <span className="text-red-400">*</span>
          </h3>
          {errors.ingredients?.root && (
            <p className="text-sm text-red-400">{errors.ingredients.root.message}</p>
          )}
          <div className="space-y-3">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-[#E8872B]/10 border border-[#E8872B]/20 flex items-center justify-center text-xs text-[#E8872B] font-bold shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <input
                    {...register(`ingredients.${index}.value`)}
                    placeholder={`e.g. 2 cloves garlic, minced`}
                    className={inputClass(!!errors.ingredients?.[index]?.value)}
                  />
                  {errors.ingredients?.[index]?.value && (
                    <p className="mt-1 text-xs text-red-400">{errors.ingredients[index]?.value?.message}</p>
                  )}
                </div>
                {ingredientFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="mt-3 w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center text-lg shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendIngredient({ value: "" })}
            className="btn-outline px-5 py-2 text-sm flex items-center gap-2 mt-2"
          >
            + Add Ingredient
          </button>
        </section>

        {/* Steps */}
        <section className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-base border-b border-white/[0.06] pb-3">
            Steps / Instructions <span className="text-red-400">*</span>
          </h3>
          {errors.steps?.root && (
            <p className="text-sm text-red-400">{errors.steps.root.message}</p>
          )}
          <div className="space-y-3">
            {stepFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-[#4A7C59]/10 border border-[#4A7C59]/30 flex items-center justify-center text-xs text-[#4A7C59] font-bold shrink-0 mt-3">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <textarea
                    {...register(`steps.${index}.value`)}
                    rows={2}
                    placeholder={`Step ${index + 1}…`}
                    className={`${inputClass(!!errors.steps?.[index]?.value)} resize-none`}
                  />
                  {errors.steps?.[index]?.value && (
                    <p className="mt-1 text-xs text-red-400">{errors.steps[index]?.value?.message}</p>
                  )}
                </div>
                {stepFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="mt-3 w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center text-lg shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => appendStep({ value: "" })}
            className="btn-outline px-5 py-2 text-sm flex items-center gap-2 mt-2"
          >
            + Add Step
          </button>
        </section>

        {/* Submit */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-10 py-3.5 text-base flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              "Publish Recipe"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline px-8 py-3.5 text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddRecipePage() {
  return (
    <ProtectedRoute>
      <AddRecipeForm />
    </ProtectedRoute>
  );
}
