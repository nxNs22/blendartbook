import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesBar from "./components/FeaturesBar";
import BestsellersSection from "./components/BestsellersSection";
import CategoriesSection from "./components/CategoriesSection";
import PromoBanner from "./components/PromoBanner";
import Footer from "./components/Footer";
import NewArrivals from "./components/NewArrivals";
import MonthlySet from "./components/MonthlySet";
import WorldLiterature from "./components/WorldLiterature";

export default function Home() {
  return (
    <>
      
 
      
      <main className="flex-1">
        <HeroSection />
        
        {/* BestsellersSection artık Supabase'den veri çekiyor */}
        <NewArrivals/>
        <MonthlySet/>
        <WorldLiterature/>
        <BestsellersSection /> 
        <CategoriesSection />
 
        <FeaturesBar />
      </main>


    </>
  );
}