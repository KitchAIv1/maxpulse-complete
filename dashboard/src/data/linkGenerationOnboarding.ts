/**
 * Link Generation Onboarding Content Configuration
 * Follows .cursorrules: Single responsibility, content configuration
 */

import { OnboardingContent } from '../services/OnboardingManager';

export const linkGenerationOnboardingContent: OnboardingContent = {
  id: 'link-generation',
  title: 'Master the Assessment Link Generator',
  slides: [
    {
      id: 'intro',
      title: 'Welcome to Link Generation',
      image: '/dashboard/assets/onboarding/link-generation/images/sales-intro.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/sales-intro-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/sales-intro-tl.mp3',
      transcriptEn: 'Welcome to the MAXPULSE Assessment Link Generator! This powerful tool is your key to connecting with clients and earning commissions. Every link you create is automatically tagged to you, ensuring you get credit for all purchases made through your assessments.',
      transcriptTl: 'Maligayang pagdating sa MAXPULSE Assessment Link Generator! Ang powerful tool na ito ay inyong susi sa pag-connect sa mga kliyente at pag-earn ng commissions. Bawat link na ginagawa ninyo ay automatically na-tag sa inyo, ensuring na makakakuha kayo ng credit sa lahat ng purchases na ginawa through sa inyong assessments.',
      label: 'Intro'
    },
    {
      id: 'customer-links',
      title: 'Creating Customer Links',
      image: '/dashboard/assets/onboarding/link-generation/images/send-link.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/send-link-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/send-link-tl.mp3',
      transcriptEn: 'The Customer tab is perfect for one-on-one client interactions. Simply enter your client\'s name and contact details, then generate a personalized assessment link. This creates a unique tracking code that connects all their activity back to you.',
      transcriptTl: 'Ang Customer tab ay perfect para sa one-on-one client interactions. I-enter lang ang name at contact details ng inyong kliyente, tapos mag-generate ng personalized assessment link. Ito ay gumagawa ng unique tracking code na nag-connect ng lahat ng kanilang activity pabalik sa inyo.',
      label: 'Step 1'
    },
    {
      id: 'campaign-links',
      title: 'Campaign Link Strategy',
      image: '/dashboard/assets/onboarding/link-generation/images/engage-prospect.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/engage-prospect-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/engage-prospect-tl.mp3',
      transcriptEn: 'Campaign links are designed for broader marketing efforts. Use these for social media posts, email campaigns, or group presentations. You can customize the focus area - health, wealth, or both - to match your audience\'s interests.',
      transcriptTl: 'Ang Campaign links ay designed para sa mas malawakang marketing efforts. Gamitin ito para sa social media posts, email campaigns, o group presentations. Pwede ninyong i-customize ang focus area - health, wealth, o both - para tumugma sa interests ng inyong audience.',
      label: 'Step 2'
    },
    {
      id: 'sharing-options',
      title: 'Sharing Your Links',
      image: '/dashboard/assets/onboarding/link-generation/images/ai-role.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/ai-role-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/ai-role-tl.mp3',
      transcriptEn: 'Once your link is generated, you have multiple sharing options. Copy the link directly, download a QR code for print materials, or use the share button for social media. Each method maintains your unique tracking code for commission purposes.',
      transcriptTl: 'Kapag na-generate na ang inyong link, may multiple sharing options kayo. I-copy ang link directly, mag-download ng QR code para sa print materials, o gamitin ang share button para sa social media. Bawat method ay nag-maintain ng inyong unique tracking code para sa commission purposes.',
      label: 'Step 3'
    },
    {
      id: 'tracking-success',
      title: 'Tracking Your Success',
      image: '/dashboard/assets/onboarding/link-generation/images/follow-up.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/follow-up-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/follow-up-tl.mp3',
      transcriptEn: 'Monitor your link performance in the Client Hub and Finance sections. You\'ll see real-time updates when clients start assessments, complete them, and make purchases. All commissions are automatically calculated and added to your earnings.',
      transcriptTl: 'I-monitor ang performance ng inyong link sa Client Hub at Finance sections. Makikita ninyo ang real-time updates kapag nag-start ang mga kliyente ng assessments, nag-complete, at nag-make ng purchases. Lahat ng commissions ay automatically na-calculate at na-add sa inyong earnings.',
      label: 'Step 4'
    },
    {
      id: 'best-practices',
      title: 'Pro Tips for Success',
      image: '/dashboard/assets/onboarding/link-generation/images/open-mind.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/open-mind-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/open-mind-tl.mp3',
      transcriptEn: 'For maximum success: Always personalize your approach, follow up with clients after they complete assessments, use campaign links for group marketing, and customer links for individual outreach. Remember, the assessment is free for clients - emphasize the value they\'ll receive!',
      transcriptTl: 'Para sa maximum success: Laging i-personalize ang inyong approach, mag-follow up sa mga kliyente after nila ma-complete ang assessments, gamitin ang campaign links para sa group marketing, at customer links para sa individual outreach. Remember, ang assessment ay free para sa mga kliyente - i-emphasize ang value na makakakuha nila!',
      label: 'Pro Tips'
    }
  ]
};
