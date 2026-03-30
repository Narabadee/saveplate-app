/**
 * SavePlate Smart Pricing Engine
 * Heuristic-driven pricing suggestions for food rescue.
 */

const CATEGORY_CONFIGS = {
    'Bakery': { low: 0.3, suggested: 0.4, high: 0.5, tips: ["Bakery items move fastest in the late afternoon.", "Bundling bread and pastries usually yields 100% sell-through."] },
    'Thai': { low: 0.35, suggested: 0.45, high: 0.55, tips: ["Rice-based dishes are popular dinner rescues.", "A 50% discount is the standard for ready-to-eat meals."] },
    'Healthy': { low: 0.4, suggested: 0.5, high: 0.6, tips: ["Salad bowls retain high value due to organic ingredients.", "Health-conscious users frequently check around 5 PM."] },
    'Café': { low: 0.35, suggested: 0.45, high: 0.55, tips: ["Coffee and cake combos are popular afternoon rescues.", "Quick turnover is key for fresh café items."] },
    'Italian': { low: 0.4, suggested: 0.5, high: 0.6, tips: ["Pizzas and pastas stay fresh for longer pickup windows.", "Larger portions can be priced closer to 50%."] },
    'Default': { low: 0.35, suggested: 0.45, high: 0.55, tips: ["A 50% discount is the best way to ensure 0% waste.", "Setting clear pickup times improves conversion."] }
};

export function suggestPrice(category, originalPrice, quantity, pickupStart) {
    // Normalize category
    // Data.js categories look like '🥐 Bakery', '🍜 Thai', etc.
    const cleanCat = category ? category.split(' ')[1] || category : 'Default';
    const config = CATEGORY_CONFIGS[cleanCat] || CATEGORY_CONFIGS['Default'];

    // Adjust for urgency (if pickup is less than 2 hours away)
    // For now, simple mockup logic:
    let multiplier = 1.0;
    const currentHour = new Date().getHours();
    const pickupHour = parseInt(pickupStart.split(':')[0]);
    if (pickupHour - currentHour < 2 && pickupHour - currentHour > 0) {
        multiplier = 0.9; // Lower price to sell faster
    }

    const low = Math.round(originalPrice * config.low * multiplier);
    const suggested = Math.round(originalPrice * config.suggested * multiplier);
    const high = Math.round(originalPrice * config.high * multiplier);

    // Confidence/Sell-out probability
    const probability = suggested < (originalPrice * 0.4) ? 95 : 80;

    return {
        low,
        suggested,
        high,
        probability,
        tip: config.tips[Math.floor(Math.random() * config.tips.length)]
    };
}

export async function fetchAITip(category, suggestedPrice, pickupStart) {
    try {
        // Using Hugging Face Free Inference API (No key needed for low-volume public usage)
        // Model: Qwen 2.5 72B Instruct (Highly capable free model)
        const response = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inputs: `As an AI pricing assistant for a food rescue app called SavePlate, give a very short (max 15 words) encouraging tip for a ${category} merchant pricing their bag at ฿${suggestedPrice} for pickup at ${pickupStart}. Be professional and friendly.`,
                parameters: { max_new_tokens: 50, return_full_text: false }
            })
        });

        if (!response.ok) throw new Error("HF API error");
        const data = await response.json();
        return data[0]?.generated_text?.trim() || null;
    } catch (err) {
        console.warn("Pricing AI Tip Error (Normal for free API):", err);
        return null; // Fallback to heuristic tip
    }
}
