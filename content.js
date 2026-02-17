const IMGUR_REGEX = /^https?:\/\/([^\/]+\.)?imgur\.com\//i;

function toDuckDuckGoProxy(url) {
  const encoded = encodeURIComponent(url);
  return `https://external-content.duckduckgo.com/iu/?u=${encoded}`;
}

function isImgurUrl(url) {
  return IMGUR_REGEX.test(url);
}

function replaceLinkElement(link) {
  if (!link.href) return;

  if (isImgurUrl(link.href)) {
    link.href = toDuckDuckGoProxy(link.href);
  }
}

function replaceImageElement(img) {
  if (!img.src) return;

  if (isImgurUrl(img.src)) {
    img.src = toDuckDuckGoProxy(img.src);
  }
}

function replaceSourceElement(source) {
  if (!source.src) return;

  if (isImgurUrl(source.src)) {
    source.src = toDuckDuckGoProxy(source.src);
  }
}

function scanAndReplace(root = document) {
  // Replace anchor links
  root.querySelectorAll("a[href]").forEach(replaceLinkElement);

  // Replace images
  root.querySelectorAll("img[src]").forEach(replaceImageElement);

  // Replace <source> tags (for <picture> or video)
  root.querySelectorAll("source[src]").forEach(replaceSourceElement);
}

// Initial replacement
scanAndReplace();

// Observe dynamically added content
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType !== 1) return;

      // If the node itself is a relevant element
      if (node.matches?.("a[href]")) replaceLinkElement(node);
      if (node.matches?.("img[src]")) replaceImageElement(node);
      if (node.matches?.("source[src]")) replaceSourceElement(node);

      // Also scan inside the subtree
      scanAndReplace(node);
    });
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
