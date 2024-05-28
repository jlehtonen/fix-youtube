const getViewsContainer = (parent) => {
  const candidates = parent.getElementsByClassName(
    "inline-metadata-item style-scope ytd-video-meta-block"
  );
  if (candidates.length === 0) {
    return null;
  }

  for (const candidate of candidates) {
    if (candidate.textContent.includes("views")) {
      return candidate;
    }
  }

  return null;
};

const isBadVideo = (viewsContainer) => {
  const text = viewsContainer.textContent;
  const regex = /(\d+) views/;

  if (regex.test(text)) {
    console.log("BAD VIDEO:", text);
    return true;
  }

  return false;
};

const getVideoElement = (viewsContainer) => {
  return (
    viewsContainer.closest("ytd-rich-item-renderer") ??
    viewsContainer.closest("ytd-compact-video-renderer")
  );
};

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const target = mutation.target;
    if (target instanceof HTMLElement && target.id === "metadata-line") {
      const viewsContainer = getViewsContainer(target);
      if (viewsContainer === null || !isBadVideo(viewsContainer)) {
        return;
      }

      const video = getVideoElement(viewsContainer);
      if (video === null) {
        return;
      }

      video.remove();
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true });
