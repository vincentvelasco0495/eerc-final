import { useMemo, useContext, createContext } from 'react';

import { HOMEPAGE_V2_DEFAULTS } from 'src/features/homepage-v2/data/homepage-v2-defaults';

const HomepageV2ContentContext = createContext(HOMEPAGE_V2_DEFAULTS.sections);

export function HomepageV2ContentProvider({ sections, children }) {
  const value = useMemo(() => sections ?? HOMEPAGE_V2_DEFAULTS.sections, [sections]);

  return (
    <HomepageV2ContentContext.Provider value={value}>{children}</HomepageV2ContentContext.Provider>
  );
}

export function useHomepageV2Sections() {
  return useContext(HomepageV2ContentContext);
}

export function useHomepageV2SectionContent(sectionKey) {
  const sections = useHomepageV2Sections();
  return sections?.[sectionKey] ?? null;
}
