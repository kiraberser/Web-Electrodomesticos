import { HeroSection } from '@/components/ui'
import { Carousel } from '@/components/features/home'
import { FeaturesGrid } from '@/components/features/home'

const App = () => {

    return (
        <div className='bg-[#D4EBF8]'>
            <Carousel/>
            <FeaturesGrid/>
            <HeroSection/>
        </div>
    )
}

export default App