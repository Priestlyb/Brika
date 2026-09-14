/**
 * -----------------------------------------------------------------------------
 * File: src/constants/pricing/pricing.constants.ts
 * -----------------------------------------------------------------------------
 * Brika pricing configuration.
 * -----------------------------------------------------------------------------
 */

export type BillingPeriod = "monthly" | "yearly";

export type PricingPlan = {
    id: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    description: string;
    generations: string;
    features: string[];
    popular?: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
    {
        id: "free",
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: "Explore Brika and start building.",
        generations: "5 generations",
        features: [
            "5 AI generations",
            "Basic 3D conversion",
            "Project workspace",
        ],
    },

    {
        id: "starter",
        name: "Starter",
        monthlyPrice: 25000,
        yearlyPrice: 250000,
        description: "For individuals getting serious.",
        generations: "30 generations",
        features: [
            "30 AI generations",
            "Advanced 3D conversion",
            "Cloud project storage",
            "Version history",
        ],
    },

    {
        id: "growth",
        name: "Growth",
        monthlyPrice: 50000,
        yearlyPrice: 500000,
        description: "For growing creative workflows.",
        generations: "100 generations",
        features: [
            "100 AI generations",
            "Advanced 3D conversion",
            "Priority processing",
            "Project collaboration",
            "Version history",
        ],
        popular: true,
    },

    {
        id: "pro",
        name: "Pro",
        monthlyPrice: 100000,
        yearlyPrice: 1000000,
        description: "For professionals and teams.",
        generations: "Unlimited generations",
        features: [
            "Unlimited generations",
            "Priority processing",
            "Team collaboration",
            "Advanced project controls",
            "Priority support",
        ],
    },
];

export const DEFAULT_PLAN_ID = "growth";

export function formatNaira(value: number): string {
    if (value === 0) {
        return "₦0";
    }

    return `₦${value.toLocaleString("en-NG")}`;
}