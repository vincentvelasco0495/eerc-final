const ADDRESS = `MANILA BRANCH — Room 202 2nd Floor, Espana Place Bldg., 1139 Adelina St. Sampaloc Manila

BAGUIO BRANCH — BSUCMPC Building Baguio 95 Lower Bonifacio St, Baguio, 2600 Benguet

LEGAZPI BRANCH — 3rd Floor CCJ Bldg. Tahao Road Legazpi City (near BDO and SM Legazpi)`;

export const CONTACT_PAGE_DEFAULTS = {
  sections: {
    details: {
      visible: true,
      contactInfoTitle: 'Contact Info:',
      locationTitle: 'Location Info:',
      address: ADDRESS,
      phone: '09364999263',
      email: 'eercinstructor@gmail.com',
      facebookDisplay: 'facebook.com/eerclearning',
      facebookUrl: 'https://www.facebook.com/eerclearning/',
      mapEmbedUrl:
        'https://www.google.com/maps?q=Espana+Place+1139+Adelina+St+Sampaloc+Manila&z=16&output=embed',
      mapIframeTitle: 'EERC office location',
    },
    feedback: {
      visible: true,
      feedbackTitle: 'Feedback:',
      placeholderName: 'Your Name',
      placeholderEmail: 'Your Email',
      placeholderPhone: 'Your phone number',
      placeholderMessage:
        'Tell us how we can help with EERC LMS, your program setup, learner support, or course delivery needs.',
      submitButtonLabel: 'Submit',
    },
    representative: {
      visible: true,
      sidebarTitle: 'Your Contact',
      name: 'EERC Learning',
      role: 'Inquiries & learner support',
      phone: '09364999263',
      email: 'eercinstructor@gmail.com',
      extra: 'Message us on Facebook for updates and announcements.',
      avatar: {
        alt: 'EERC Learning',
        url: null,
        mediaId: null,
      },
    },
  },
  meta: {
    updatedAt: null,
  },
};

/**
 * @param {{ sections?: Record<string, unknown> } | undefined} data
 */
export function mergeContactPageContent(data) {
  const base = CONTACT_PAGE_DEFAULTS.sections;

  if (!data?.sections || typeof data.sections !== 'object') {
    return {
      details: { ...base.details },
      feedback: { ...base.feedback },
      representative: { ...base.representative },
    };
  }

  const remote = data.sections;
  const keys = ['details', 'feedback', 'representative'];
  const out = {};

  keys.forEach((key) => {
    if (remote[key] !== undefined && typeof remote[key] === 'object' && remote[key] !== null) {
      out[key] = { ...base[key], ...remote[key] };
      if (key === 'representative' && base.representative.avatar && remote[key].avatar) {
        out[key].avatar = { ...base.representative.avatar, ...remote[key].avatar };
      }
    } else {
      out[key] = { ...base[key], visible: false };
    }
  });

  return out;
}

export function telHrefFromPhilippineMobile(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  const rest = digits.startsWith('0') ? digits.slice(1) : digits;
  return `tel:+63${rest}`;
}
