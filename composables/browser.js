export function isIOSDevice() {
    if (typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent;
    if (/iP(ad|od|hone)/i.test(ua)) return true;

    // iPadOS 13+ reports itself as a desktop Mac, so fall back to touch support.
    return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

export function isSafariBrowser() {
    if (typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent;
    const webkit = /WebKit/i.test(ua);
    const otherEngine = /(chrome|chromium|firefox|opera|opr\/|edg|brave|crios|fxios|edgios)/i.test(ua);

    return webkit && !otherEngine;
}

// dom-to-image rasterises through an SVG foreignObject, which WebKit refuses to
// paint. Every browser on iOS is WebKit underneath, so they all need html2canvas.
export function needsCanvasCapture() {
    return isIOSDevice() || isSafariBrowser();
}
