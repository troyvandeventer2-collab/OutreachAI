function generateEmails({ user_name, prospect_name, prospect_company, prospect_title, what_they_sell }) {
  // Clean up any double spaces or leading/trailing whitespace
  const uName = user_name.trim();
  const pName = prospect_name.trim();
  const pComp = prospect_company.trim();
  const pTitle = prospect_title.trim();
  const wSell = what_they_sell.trim();

  // Opener
  const opener = `Subject: Quick question regarding growth at ${pComp}

Hi ${pName},

I was researching ${pComp} and noticed your role as ${pTitle}. Given your focus, I wanted to reach out because many teams struggle to streamline how they manage and scale ${wSell}.

At our company, we help organizations do exactly that—helping you increase efficiency without the usual headache. 

Have you thought about how you can optimize your current approach to this next quarter? I'd love to share a couple of quick ideas if you're open to a brief 5-minute chat.

Best,

${uName}`;

  // Follow-up
  const followup = `Subject: Re: Quick question regarding growth at ${pComp}

Hi ${pName},

I know how busy things can get for a ${pTitle} at a growing company like ${pComp}. 

Just wanted to see if you had a moment to read my previous email? We've recently helped other teams solve issues around ${wSell}, and I thought it could be highly relevant to what you're working on.

Would next Tuesday at 10 AM work for a quick call?

Cheers,

${uName}`;

  // Breakup
  const breakup = `Subject: Moving on / One last check

Hi ${pName},

I haven't heard back, so I'm assuming that optimizing how you handle ${wSell} isn't a priority for ${pComp} right now—and that is completely fine!

I'll stop reaching out. If things change down the road and you want to revisit how to scale this, feel free to drop me a line.

Wishing you and ${pComp} the absolute best.

Sincerely,

${uName}`;

  return [opener, followup, breakup];
}

module.exports = { generateEmails };
