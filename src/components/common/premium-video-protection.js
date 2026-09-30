import { useEffect } from 'react';

export function blockMediaContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
}

const PREMIUM_CONTROLS_LIST = 'nodownload nofullscreen noremoteplayback';

export const premiumVideoProtectionProps = {
  controlsList: PREMIUM_CONTROLS_LIST,
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  draggable: false,
  controls: false,
  onContextMenu: blockMediaContextMenu,
  onDragStart: blockMediaContextMenu,
};

export const premiumVideoSx = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitUserDrag: 'none',
  '&::-webkit-media-controls': { display: 'none !important' },
  '&::-webkit-media-controls-enclosure': { display: 'none !important' },
  '&::-webkit-media-controls-panel': { display: 'none !important' },
  '&::-webkit-media-controls-download-button': { display: 'none !important' },
  '&::-webkit-media-controls-overflow-button': { display: 'none !important' },
  '&::-webkit-media-controls-overlay-enclosure': { display: 'none !important' },
  '&::-webkit-media-controls-overlay-play-button': { display: 'none !important' },
};

/** Capture-phase so Chrome's video menu cannot open Save / Copy address. */
export function useBlockContextMenu(nodeRef, observeKey) {
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) {
      return undefined;
    }
    node.addEventListener('contextmenu', blockMediaContextMenu, true);
    return () => node.removeEventListener('contextmenu', blockMediaContextMenu, true);
  }, [nodeRef, observeKey]);
}

/** Re-apply lock if DevTools adds `controls` or strips controlsList. */
export function useLockPremiumVideoElement(videoRef, observeKey) {
  useEffect(() => {
    const node = videoRef.current;
    if (!node) {
      return undefined;
    }

    const originalSetAttribute = node.setAttribute.bind(node);
    const originalRemoveAttribute = node.removeAttribute.bind(node);

    const lock = () => {
      originalRemoveAttribute('controls');
      if (node.getAttribute('controlsList') !== PREMIUM_CONTROLS_LIST) {
        originalSetAttribute('controlsList', PREMIUM_CONTROLS_LIST);
      }
      node.disablePictureInPicture = true;
      if ('disableRemotePlayback' in node) {
        node.disableRemotePlayback = true;
      }
    };

    node.setAttribute = (name, value) => {
      const key = String(name).toLowerCase();
      if (key === 'controls') {
        return;
      }
      if (key === 'controlslist') {
        originalSetAttribute('controlsList', PREMIUM_CONTROLS_LIST);
        return;
      }
      originalSetAttribute(name, value);
    };

    node.removeAttribute = (name) => {
      if (String(name).toLowerCase() === 'controlslist') {
        originalSetAttribute('controlsList', PREMIUM_CONTROLS_LIST);
        return;
      }
      originalRemoveAttribute(name);
    };

    try {
      Object.defineProperty(node, 'controls', {
        configurable: true,
        enumerable: true,
        get: () => false,
        set: () => {},
      });
    } catch {
      /* some engines reject redefining HTMLVideoElement.controls */
    }

    lock();
    const observer = new MutationObserver(lock);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['controls', 'controlslist'],
    });
    const intervalId = window.setInterval(lock, 400);

    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      node.setAttribute = originalSetAttribute;
      node.removeAttribute = originalRemoveAttribute;
    };
  }, [observeKey, videoRef]);
}
