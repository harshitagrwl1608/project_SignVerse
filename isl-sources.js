/* =====================================================================
   SignVerse — ISL SOURCE REGISTRY
   ---------------------------------------------------------------------
   Every piece of ISL reference material used by SignVerse is registered
   here, together with its publisher, canonical URL and the usage terms
   that apply to it.

   IMPORTANT LICENSING DECISION
   ----------------------------
   The official ISL dictionary videos are published by ISLRTC / DEPwD.
   DEPwD's copyright policy states that its contents "may not be
   reproduced partially or fully, without due permission". We therefore
   NEVER download, mirror or bundle ISLRTC videos, images or datasets
   inside this application. We only deep-link to the official pages and
   always display the attribution next to the link.

   What IS bundled locally is our own material: the handshape / motion
   descriptions written for this project (CC BY 4.0) and the procedural
   3D avatar built from code (MIT, same as the repository).
   ===================================================================== */

const ISL_SOURCE_REGISTRY = {
  'islrtc-dictionary': {
    id: 'islrtc-dictionary',
    title: 'ISLRTC Online Dictionary of Indian Sign Language',
    publisher: 'Indian Sign Language Research and Training Centre (ISLRTC), Dept. of Empowerment of Persons with Disabilities, Govt. of India',
    url: 'https://divyangjan.depwd.gov.in/islrtc/',
    kind: 'dictionary',
    access: 'online',
    embedAllowed: false,
    license: 'Government of India content. DEPwD copyright policy: contents may not be reproduced partially or fully without due permission; when referred to, the source must be appropriately acknowledged.',
    licenseUrl: 'https://islrtc.nic.in/copyright-policy/',
    attribution: 'ISLRTC, DEPwD (Govt. of India)',
    notes: 'The authoritative ISL dictionary. Distinguishes word senses, synonyms, alternate signs and regional variants, and publishes entries in several languages including Hindi. Media is streamed from the site — we link to it rather than mirroring it.'
  },
  'islrtc-site': {
    id: 'islrtc-site',
    title: 'ISLRTC institutional site',
    publisher: 'Indian Sign Language Research and Training Centre (ISLRTC)',
    url: 'https://islrtc.nic.in/',
    kind: 'reference',
    access: 'online',
    embedAllowed: false,
    license: 'Content owned by ISLRTC, DEPwD; hosted by NIC, MeitY. Reuse requires attribution and permission for reproduction.',
    licenseUrl: 'https://islrtc.nic.in/copyright-policy/',
    attribution: 'ISLRTC, DEPwD / NIC, MeitY',
    notes: 'Links to the dictionary website, the dictionary dataset (Google Drive), the dictionary video series and the "Sign Learn" app.'
  },
  'islrtc-dataset': {
    id: 'islrtc-dataset',
    title: 'ISL Dictionary dataset (Google Drive, published by ISLRTC)',
    publisher: 'ISLRTC, DEPwD',
    url: 'https://drive.google.com/drive/folders/1U-Pr4r1-cupgNOOq9NH_uTsQnPSVEKco',
    kind: 'dataset',
    access: 'external',
    embedAllowed: false,
    license: 'Published by ISLRTC for reference and reuse in ISL research. Redistribution inside an application is not assumed — we link to the folder instead of mirroring it.',
    licenseUrl: 'https://islrtc.nic.in/copyright-policy/',
    attribution: 'ISLRTC, DEPwD',
    notes: 'Official ISL dictionary media + metadata folder. Requires a network connection and an internet-enabled viewer.'
  },
  'islrtc-youtube': {
    id: 'islrtc-youtube',
    title: 'ISLRTC dictionary videos (YouTube)',
    publisher: 'ISLRTC, DEPwD',
    url: 'https://www.youtube.com/@ISLRTC',
    kind: 'video',
    access: 'online',
    embedAllowed: false,
    license: 'Streamed from YouTube by ISLRTC. We do not re-host or download the clips.',
    licenseUrl: 'https://islrtc.nic.in/copyright-policy/',
    attribution: 'ISLRTC, DEPwD (YouTube)',
    notes: 'Public dictionary demonstrations, useful when the dictionary site is unreachable.'
  },
  'datagov-isl-dictionary': {
    id: 'datagov-isl-dictionary',
    title: 'Indian Sign Language Dictionary — Open Government Data catalogue entry',
    publisher: 'Data.gov.in / Government of India',
    url: 'https://data.gov.in/catalog/indian-sign-language-dictionary',
    kind: 'catalogue',
    access: 'online',
    embedAllowed: false,
    license: 'Open Government Data licence (GoD) as published on the catalogue page; verify the licence shown on the catalogue entry before reuse.',
    licenseUrl: 'https://data.gov.in/catalog/indian-sign-language-dictionary',
    attribution: 'Data.gov.in / Govt. of India',
    notes: 'Catalogue metadata for the national ISL dictionary resources, including the ISLRTC dictionary and concept-video resources.'
  },
  'rkmvu-argisl': {
    id: 'rkmvu-argisl',
    title: 'ARGISL — Indian Sign Language generation research (RKMVERI)',
    publisher: 'Department of Computer Science, Ramakrishna Mission Vivekananda Educational and Research Institute (RKMVERI)',
    url: 'https://cs.rkmvu.ac.in/~isl/',
    kind: 'research',
    access: 'online',
    embedAllowed: false,
    license: '© 2024-26 CS, RKMVERI, Belur. All rights reserved — linked for reference only, not mirrored.',
    licenseUrl: 'https://cs.rkmvu.ac.in/~isl/',
    attribution: 'S. Patra, A. Maitra, S. Samanta — CS, RKMVERI',
    notes: 'Research prototypes and datasets for ISL production (ARGISL project). Used as a supplementary reference for sign motion conventions.'
  },
  'signverse-local': {
    id: 'signverse-local',
    title: 'SignVerse local ISL lexicon',
    publisher: 'SignVerse (this project)',
    url: null,
    kind: 'local',
    access: 'offline',
    embedAllowed: true,
    license: 'Handshape/motion descriptions and procedural animations authored for SignVerse — CC BY 4.0. Repository code — MIT.',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    attribution: 'SignVerse contributors',
    notes: 'Offline fallback. Every locally stored entry is explicitly marked as an approximation that has NOT been validated against an ISLRTC demonstration video.'
  }
};

/* ---------------------------------------------------------------------
   SOURCE ADAPTERS
   A source adapter turns a search term into a set of *external references*
   that can be opened in a browser. It never embeds or downloads media.
   --------------------------------------------------------------------- */
const ISL_SOURCE_ADAPTERS = [
  {
    id: 'islrtc-dictionary',
    sourceId: 'islrtc-dictionary',
    supportsOffline: false,
    requiresNetwork: true,
    /* Deep link into the official dictionary for a given term. The official
       site exposes a search-driven UI, so we hand the term to the search
       and keep the human-readable instruction next to the link. */
    reference(term) {
      const q = encodeURIComponent((term || '').trim());
      return {
        label: 'Open in the official ISLRTC dictionary',
        url: 'https://divyangjan.depwd.gov.in/islrtc/',
        query: q,
        hint: 'Search for “' + (term || '').trim() + '” in the official dictionary to watch the ISLRTC demonstration video.',
        media: 'video',
        offline: false
      };
    }
  },
  {
    id: 'islrtc-youtube',
    sourceId: 'islrtc-youtube',
    supportsOffline: false,
    requiresNetwork: true,
    reference(term) {
      return {
        label: 'ISLRTC dictionary videos on YouTube',
        url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent('ISLRTC ISL dictionary ' + (term || '').trim()),
        query: '',
        hint: 'The ISLRTC dictionary series on YouTube covers the same glossary.',
        media: 'video',
        offline: false
      };
    }
  },
  {
    id: 'islrtc-dataset',
    sourceId: 'islrtc-dataset',
    supportsOffline: false,
    requiresNetwork: true,
    reference() {
      return {
        label: 'ISL dictionary dataset (ISLRTC, Google Drive)',
        url: 'https://drive.google.com/drive/folders/1U-Pr4r1-cupgNOOq9NH_uTsQnPSVEKco',
        query: '',
        hint: 'Official dictionary media and metadata folder published by ISLRTC.',
        media: 'dataset',
        offline: false
      };
    }
  },
  {
    id: 'signverse-local',
    sourceId: 'signverse-local',
    supportsOffline: true,
    requiresNetwork: false,
    reference(term) {
      return {
        label: 'SignVerse offline lexicon entry',
        url: null,
        query: '',
        hint: 'Handshape and motion description stored in this browser — an approximation, not a validated ISLRTC demonstration.',
        media: 'local',
        offline: true
      };
    }
  }
];

/* ---------------------------------------------------------------------
   PUBLIC HELPERS
   --------------------------------------------------------------------- */
const ISLSources = {
  registry: ISL_SOURCE_REGISTRY,

  get(id) {
    return ISL_SOURCE_REGISTRY[id] || null;
  },

  /** Attribution string for a source id (never empty). */
  attribution(id) {
    const s = ISL_SOURCE_REGISTRY[id];
    return s ? s.attribution : 'SignVerse';
  },

  /** Short label used in badges. */
  shortLabel(id) {
    const s = ISL_SOURCE_REGISTRY[id];
    if (!s) return 'Unknown source';
    if (s.kind === 'local') return 'Offline lexicon';
    return s.title.replace(/ \(.*\)$/, '');
  },

  /**
   * Build the list of external references for a term.
   * `offlineOnly` collapses the list to locally available material.
   */
  references(term, opts) {
    const options = opts || {};
    const out = [];
    for (const adapter of ISL_SOURCE_ADAPTERS) {
      if (options.offlineOnly && !adapter.supportsOffline) continue;
      const ref = adapter.reference(term);
      const src = ISL_SOURCE_REGISTRY[adapter.sourceId];
      out.push({
        adapterId: adapter.id,
        sourceId: adapter.sourceId,
        title: src.title,
        publisher: src.publisher,
        url: ref.url,
        label: ref.label,
        hint: ref.hint,
        media: ref.media,
        offline: !!ref.offline,
        requiresNetwork: !!adapter.requiresNetwork,
        license: src.license,
        licenseUrl: src.licenseUrl,
        attribution: src.attribution
      });
    }
    return out;
  },

  /**
   * Short human readable citation for a lexicon entry.
   */
  citation(entry) {
    if (!entry) return '';
    const ids = entry.sources && entry.sources.length ? entry.sources : ['signverse-local'];
    return ids.map((id) => {
      const s = ISL_SOURCE_REGISTRY[id];
      return s ? s.attribution + ' — ' + s.title : id;
    }).join('; ');
  }
};

if (typeof window !== 'undefined') window.ISLSources = ISLSources;
