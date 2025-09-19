/**
 * Link Generation Sales Onboarding Content Configuration
 * Follows .cursorrules: Single responsibility, content configuration
 */

import { OnboardingContent } from '../services/OnboardingManager';

export const linkGenerationSalesOnboardingContent: OnboardingContent = {
  id: 'link-generation-sales',
  title: 'MaxPulse Sales Mastery Training',
  slides: [
    {
      id: 'sales-intro',
      title: 'Welcome to Sales Mastery',
      image: '/dashboard/assets/onboarding/link-generation/images/sales-intro.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/sales-intro-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/sales-intro-tl.mp3',
      transcriptEn: 'Welcome to your MaxPulse Distributor Guide. In this short training, you\'ll learn how to use your personal MaxPulse link to engage prospects, open their mind, and let AI do the heavy lifting. Follow these steps, and you\'ll feel more confident, professional, and aligned with today\'s AI trend.',
      transcriptTl: 'Welcome sa MaxPulse Distributor Guide. Dito mo matututunan kung paano gamitin ang personal MaxPulse link mo para mag-engage ng prospects, buksan ang isip nila, at hayaan ang AI ang gumawa ng bigat ng trabaho. Sundan mo lang itong steps, and you\'ll feel more confident, more professional, at naka-align sa AI trend ngayon.',
      label: 'Intro'
    },
    {
      id: 'engage-prospect',
      title: 'Engage the Prospect',
      image: '/dashboard/assets/onboarding/link-generation/images/engage-prospect.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/engage-prospect-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/engage-prospect-tl.mp3',
      transcriptEn: `Start with a natural, friendly conversation. Don't push. Your goal is to spark curiosity.<br><br><br>📝 EXAMPLE QUESTIONS:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Hey, I came across something exciting I'd like you to try. It's quick, personal, and could open up new opportunities for you."</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"I've been using a new tool that's fast and insightful — it shows you something about your health or business potential. Would you like to see it?"</span>`,
      transcriptTl: `Start ka lang sa natural na usapan. Wag agad sales talk. Ang goal mo is mag-create ng curiosity.<br><br><br>📝 EXAMPLE QUESTIONS:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Uy, I found something exciting na gusto kong i-share sayo. Mabilis lang, personal, and baka makatulong sayo."</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Meron akong bagong tool na ginagamit — mabilis lang, and it shows insights about health or business growth. Gusto mo bang makita?"</span>`,
      label: 'Step 1'
    },
    {
      id: 'open-mind',
      title: 'Open the Mind',
      image: '/dashboard/assets/onboarding/link-generation/images/open-mind.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/open-mind-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/open-mind-tl.mp3',
      transcriptEn: `Before sending the link, position MaxPulse as something new and innovative.<br><br><br>📝 EXAMPLE POSITIONING:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"This isn't about me telling you what to do — it's about the AI showing you where opportunities are, based on your own inputs."</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"It's not the usual presentation. It's an AI-driven assessment that gives you personalized results."</span>`,
      transcriptTl: `Bago mo ibigay yung link, i-position mo muna ang MaxPulse as something bago at unique.<br><br><br>📝 EXAMPLE POSITIONING:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Hindi ito about me telling you what to do — AI mismo yung magpapakita ng opportunities base sa inputs mo."</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Hindi ito yung typical na presentation. It's a modern AI-driven assessment na nagbibigay ng personalized results."</span>`,
      label: 'Step 2'
    },
    {
      id: 'ai-role',
      title: 'Build on AI\'s Role',
      image: '/dashboard/assets/onboarding/link-generation/images/ai-role.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/ai-role-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/ai-role-tl.mp3',
      transcriptEn: `Let them know that the tool itself provides credibility and professionalism.<br><br><br>📝 EXAMPLE CREDIBILITY BUILDERS:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"What I love is that even as a beginner, I can rely on MaxPulse AI to give clear insights. It's not about me explaining — it's about what the system shows you."</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"AI is the trend now, and MaxPulse puts us ahead. It gives you an analysis that's easy to understand, and even suggests the next step for you."</span>`,
      transcriptTl: `Emphasize na yung tool mismo yung nagbibigay ng credibility at professionalism.<br><br><br>📝 EXAMPLE CREDIBILITY BUILDERS:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Ang gusto ko sa MaxPulse, kahit beginner ka, you can rely on the AI to give clear insights. Hindi ito about me explaining — it's about what the system shows you."</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"AI ang trend ngayon, and MaxPulse puts us ahead. Bibigyan ka ng analysis na madali mong maintindihan, at may kasama pang suggested next step."</span>`,
      label: 'Step 3'
    },
    {
      id: 'send-link',
      title: 'Send the Personal Link',
      image: '/dashboard/assets/onboarding/link-generation/images/send-link.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/send-link-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/send-link-tl.mp3',
      transcriptEn: `Once curiosity is high, send your MaxPulse personal link.<br><br><br>📝 EXAMPLE LINK SHARING:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Here's the link — try it now. It only takes a few minutes and you'll see whether health, wealth, or both fit you best."</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Click the link, it's quick, and at the end you'll get a clear call to action — whether health products, or a business package for wealth building."</span>`,
      transcriptTl: `Pag mataas na ang curiosity, share mo na yung personal MaxPulse link mo.<br><br><br>📝 EXAMPLE LINK SHARING:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Ito yung link — try mo na. Few minutes lang and you'll see kung health, wealth, or both ang mas bagay sayo."</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Click mo lang, mabilis lang, and at the end makakakuha ka ng clear call to action — kung health products ang fit sayo or business package for wealth building."</span>`,
      label: 'Step 4'
    },
    {
      id: 'follow-up',
      title: 'Follow-Up and Guide',
      image: '/dashboard/assets/onboarding/link-generation/images/follow-up.png',
      audioEn: '/dashboard/assets/onboarding/link-generation/audio/follow-up-en.mp3',
      audioTl: '/dashboard/assets/onboarding/link-generation/audio/follow-up-tl.mp3',
      transcriptEn: `After they complete the assessment, don't just wait — follow up and help them act.<br><br><br>📝 EXAMPLE FOLLOW-UP QUESTIONS:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"How did you find the insights? Interesting, right? Which part spoke to you more — health or wealth?"</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Exciting results, right? Let's talk about the next step the AI recommended so you can get started the right way."</span><br><br><br>🎯 CLOSING MESSAGE:<br><br>Remember, MaxPulse is designed to give you confidence. The AI does the explaining — you just guide the journey. Stay consistent, follow this process, and you'll build a business with professionalism, trust, and momentum.`,
      transcriptTl: `Pagkatapos nilang gawin yung assessment, wag ka maghintay lang — i-follow up mo para matulungan silang mag-act.<br><br><br>📝 EXAMPLE FOLLOW-UP QUESTIONS:<br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Kamusta yung insights? Interesting, diba? Which part ang mas tumama sayo — health or wealth?"</span><br><br><br>💬 <span style="color: #dc2626; font-weight: bold;">"Exciting yung results no? Usap tayo about the next step na ni-recommend ng AI para makapagsimula ka ng tama."</span><br><br><br>🎯 CLOSING MESSAGE:<br><br>Remember, ginawa ang MaxPulse para bigyan ka ng confidence. AI ang nag-eexplain — ikaw ang nagguguide. Sundan mo lang itong process, at makakabuo ka ng business na may professionalism, trust, at momentum.`,
      label: 'Step 5'
    }
  ]
};
