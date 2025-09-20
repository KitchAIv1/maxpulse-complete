/**
 * Link Generation Onboarding Content Configuration
 * Follows .cursorrules: Single responsibility, content configuration
 */

import { OnboardingContent } from '../services/OnboardingManager';

export const linkGenerationOnboardingContent: OnboardingContent = {
  id: 'link-generation',
  title: 'Link Generator Tutorial - How to Use the Interface',
  slides: [
    {
      id: 'interface-overview',
      title: 'Link Generator Overview',
      image: '/dashboard/assets/onboarding/link-generation/images/sales-intro.png',
      audioEn: '',
      audioTl: '',
      transcriptEn: 'Welcome to the Link Generator interface tutorial. This tool creates personalized assessment links that are automatically tagged to you. You\'ll learn the two main types: Customer Links for individuals and Campaign Links for groups.',
      transcriptTl: 'Welcome sa Link Generator interface tutorial. Ang tool na ito ay gumagawa ng personalized assessment links na automatically na-tag sa inyo. Matututunan ninyo ang dalawang main types: Customer Links para sa individuals at Campaign Links para sa groups.',
      label: 'Interface'
    },
    {
      id: 'customer-links-how',
      title: 'How to Create Customer Links',
      image: '/dashboard/assets/onboarding/link-generation/images/sales-intro.png',
      audioEn: '',
      audioTl: '',
      transcriptEn: 'Customer Links are for one-on-one interactions. Fill in the customer\'s name and contact information, then click Generate Link. The system creates a unique tracking code for that person.',
      transcriptTl: 'Ang Customer Links ay para sa one-on-one interactions. I-fill in ang name at contact information ng customer, tapos i-click ang Generate Link. Ang system ay gumagawa ng unique tracking code para sa person na iyon.',
      label: 'Customer Links'
    },
    {
      id: 'campaign-links-how',
      title: 'How to Create Campaign Links',
      image: '/dashboard/assets/onboarding/link-generation/images/sales-intro.png',
      audioEn: '',
      audioTl: '',
      transcriptEn: 'Campaign Links are for broader outreach. Name your campaign, describe your target audience, and select focus areas. These links work great for social media, email campaigns, and group presentations.',
      transcriptTl: 'Ang Campaign Links ay para sa broader outreach. I-name ang campaign ninyo, i-describe ang target audience, at piliin ang focus areas. Ang mga links na ito ay maganda para sa social media, email campaigns, at group presentations.',
      label: 'Campaign Links'
    }
  ]
};
