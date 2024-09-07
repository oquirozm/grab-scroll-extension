let isScrollModeActive = false;
let isDragging = false;
let startX, startY, lastX, lastY;
let currentScrollElement = null;

// Helper function to find the nearest scrollable parent
function getNearestScrollableElement(element) {
    while (element && element !== document.body) {
        const style = window.getComputedStyle(element);
        const overflow = style.getPropertyValue('overflow') + style.getPropertyValue('overflow-y') + style.getPropertyValue('overflow-x');
        if (overflow.includes('auto') || overflow.includes('scroll')) {
            return element;
        }
        element = element.parentElement;
    }
    return document.scrollingElement || document.documentElement;
}

// Prevent default space bar behavior
window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.shiftKey) {
        e.preventDefault();
    }
}, true);

// Prevent text selection when in scroll mode
document.addEventListener('selectstart', function (e) {
    if (isScrollModeActive) {
        e.preventDefault();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.shiftKey && !isScrollModeActive) {
        isScrollModeActive = true;
        document.body.style.cursor = 'grab';
        e.preventDefault();
    }
});

document.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
        isScrollModeActive = false;
        isDragging = false;
        currentScrollElement = null;
        document.body.style.cursor = 'default';
    }
});

document.addEventListener('mousedown', function (e) {
    if (isScrollModeActive) {
        isDragging = true;
        startX = lastX = e.clientX;
        startY = lastY = e.clientY;
        currentScrollElement = getNearestScrollableElement(e.target);
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
    }
});

document.addEventListener('mousemove', function (e) {
    if (isDragging && currentScrollElement) {
        e.preventDefault();

        const currentX = e.clientX;
        const currentY = e.clientY;

        // Calculate the distance from the start point
        const dx = currentX - startX;
        const dy = currentY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate the speed factor
        const baseSensitivity = 2; // Double the scroll amount
        const maxSpeedFactor = 4;
        const speedFactor = Math.min(baseSensitivity + distance / 500, maxSpeedFactor);

        // Calculate the amount to scroll
        const scrollX = (lastX - currentX) * speedFactor;
        const scrollY = (lastY - currentY) * speedFactor;

        // Scroll the element
        currentScrollElement.scrollLeft += scrollX;
        currentScrollElement.scrollTop += scrollY;

        // Update the last position
        lastX = currentX;
        lastY = currentY;
    }
});

document.addEventListener('mouseup', function () {
    isDragging = false;
    if (isScrollModeActive) {
        document.body.style.cursor = 'grab';
    } else {
        document.body.style.cursor = 'default';
    }
});