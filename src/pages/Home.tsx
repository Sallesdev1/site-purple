import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import CTA from "../components/CTA";

// Página inicial do site Purple //
export default function Home() {
    return (
        <>
            <Hero />
            <Features />
            <Pricing />
            <Faq />
            <CTA />
        </>
    )
}