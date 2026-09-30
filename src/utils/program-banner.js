import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

/** Resolve `programs.banner_path` / API `bannerPath` to a browser-loadable URL. */
export function resolveProgramBannerSrc(value) {
  return resolveApiAssetUrl(value);
}
