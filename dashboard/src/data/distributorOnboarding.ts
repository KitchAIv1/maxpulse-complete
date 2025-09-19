/**
 * Distributor Onboarding Content Configuration
 * Follows .cursorrules: Single responsibility, content configuration
 */

import { OnboardingContent } from '../services/OnboardingManager';

export const distributorOnboardingContent: OnboardingContent = {
  id: 'distributor-dashboard',
  title: 'Welcome to Your MAXPULSE Dashboard',
  slides: [
    {
      id: 'intro',
      title: 'Welcome to MAXPULSE',
      image: '/dashboard/assets/onboarding/distributor-dashboard/images/intro.png',
      audioEn: '/dashboard/assets/onboarding/distributor-dashboard/audio/intro-en.mp3',
      audioTl: '/dashboard/assets/onboarding/distributor-dashboard/audio/intro-tl.mp3',
      transcriptEn: 'Welcome to your MAXPULSE Distributor Dashboard! This powerful platform will help you manage your clients, track assessments, and grow your health coaching business. Let\'s take a quick tour to get you started.',
      transcriptTl: 'Maligayang pagdating sa inyong MAXPULSE Distributor Dashboard! Ang powerful na platform na ito ay tutulong sa inyo na ma-manage ang inyong mga kliyente, ma-track ang mga assessment, at palaguin ang inyong health coaching business. Mag-take tayo ng quick tour para makapagsimula kayo.',
      label: 'Intro'
    },
    {
      id: 'client-hub',
      title: 'Managing Your Clients',
      image: '/dashboard/assets/onboarding/distributor-dashboard/images/client-hub.png',
      audioEn: '/dashboard/assets/onboarding/distributor-dashboard/audio/client-hub-en.mp3',
      audioTl: '/dashboard/assets/onboarding/distributor-dashboard/audio/client-hub-tl.mp3',
      transcriptEn: 'The Client Hub is your central command center. Here you can view all your clients, track their assessment progress, see their purchase history, and manage their health journey. Each client shows their current status and the value they\'ve generated.',
      transcriptTl: 'Ang Client Hub ay inyong central command center. Dito makikita ninyo ang lahat ng inyong mga kliyente, ma-track ang kanilang assessment progress, makita ang kanilang purchase history, at ma-manage ang kanilang health journey. Bawat kliyente ay nagpapakita ng kanilang current status at ang value na na-generate nila.',
      label: 'Step 1'
    },
    {
      id: 'link-generation',
      title: 'Creating Assessment Links',
      image: '/dashboard/assets/onboarding/distributor-dashboard/images/link-generation.png',
      audioEn: '/dashboard/assets/onboarding/distributor-dashboard/audio/link-generation-en.mp3',
      audioTl: '/dashboard/assets/onboarding/distributor-dashboard/audio/link-generation-tl.mp3',
      transcriptEn: 'Generate personalized assessment links for your clients with just a few clicks. Each link is automatically tagged to you, ensuring you receive commission for any purchases. You can customize the client name and share the link via multiple channels.',
      transcriptTl: 'Mag-generate ng personalized assessment links para sa inyong mga kliyente na may ilang clicks lang. Bawat link ay automatically na-tag sa inyo, ensuring na makakakuha kayo ng commission sa lahat ng purchases. Pwede ninyong i-customize ang client name at i-share ang link sa maraming channels.',
      label: 'Step 2'
    },
    {
      id: 'earnings-tracking',
      title: 'Tracking Your Earnings',
      image: '/dashboard/assets/onboarding/distributor-dashboard/images/earnings.png',
      audioEn: '/dashboard/assets/onboarding/distributor-dashboard/audio/earnings-en.mp3',
      audioTl: '/dashboard/assets/onboarding/distributor-dashboard/audio/earnings-tl.mp3',
      transcriptEn: 'Monitor your financial success in the Finance section. View your total earnings, pending commissions, and request withdrawals. The system tracks all purchases made through your links and calculates your commissions automatically.',
      transcriptTl: 'I-monitor ang inyong financial success sa Finance section. Makita ang inyong total earnings, pending commissions, at mag-request ng withdrawals. Ang system ay nag-track ng lahat ng purchases na ginawa through sa inyong mga links at nag-calculate ng inyong commissions automatically.',
      label: 'Step 3'
    },
    {
      id: 'dashboard-overview',
      title: 'Your Performance Dashboard',
      image: '/dashboard/assets/onboarding/distributor-dashboard/images/overview.png',
      audioEn: '/dashboard/assets/onboarding/distributor-dashboard/audio/overview-en.mp3',
      audioTl: '/dashboard/assets/onboarding/distributor-dashboard/audio/overview-tl.mp3',
      transcriptEn: 'Your dashboard provides real-time insights into your business performance. See monthly assessments, total revenue, active clients, and conversion rates. Use these metrics to optimize your approach and grow your business.',
      transcriptTl: 'Ang inyong dashboard ay nagbibigay ng real-time insights sa inyong business performance. Makita ang monthly assessments, total revenue, active clients, at conversion rates. Gamitin ang mga metrics na ito para ma-optimize ang inyong approach at palaguin ang inyong business.',
      label: 'Step 4'
    },
    {
      id: 'getting-started',
      title: 'Ready to Get Started!',
      image: '/dashboard/assets/onboarding/distributor-dashboard/images/get-started.png',
      audioEn: '/dashboard/assets/onboarding/distributor-dashboard/audio/get-started-en.mp3',
      audioTl: '/dashboard/assets/onboarding/distributor-dashboard/audio/get-started-tl.mp3',
      transcriptEn: 'You\'re all set! Start by generating your first assessment link and sharing it with potential clients. Remember, you can always access this guide again by clicking the help button. Welcome to the MAXPULSE family!',
      transcriptTl: 'Ready na kayo! Magsimula sa pag-generate ng inyong first assessment link at i-share ito sa mga potential clients. Remember, pwede ninyong i-access ulit ang guide na ito sa pag-click ng help button. Welcome sa MAXPULSE family!',
      label: 'Start'
    }
  ]
};
