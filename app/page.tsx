import { VSSection, VSBackground } from '../components/ui/vs-background';
import { VSHeading, VSText } from '../components/ui/vs-text';
import { VSButton } from '../components/ui/vs-button';

export default function Home() {
  return (
    <VSSection className="bg-[var(--theme-bg-primary)] min-h-screen flex flex-col items-center justify-center">
      <VSHeading size="xl" className="gradient-text mb-4 text-center">
        Welcome to the Clash Blog
      </VSHeading>
      <VSText size="lg" className="body-text text-center max-w-2xl mb-8">
        This blog now uses the full Clash theme system, including gradients, theme-aware backgrounds, and VS components for a seamless brand experience.
      </VSText>
      <VSButton variant="primary" size="lg" className="mt-4">
        Read the Blog
      </VSButton>
    </VSSection>
  );
}
