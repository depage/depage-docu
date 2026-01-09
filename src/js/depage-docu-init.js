function adjustInlineImages(img) {
    img.onload = null;

    var alt = img.getAttribute('alt');
    if (alt) {
        var caption = document.createElement('div');
        caption.textContent = alt;
        caption.className = 'caption';
        img.insertAdjacentElement('afterend', caption);
    }
    // only scale if imaage is not an svg
    if (img.src.slice(-4).toLowerCase() === '.svg') {
        return;
    }
    img.width = img.naturalWidth * 0.5;
}

document.querySelectorAll('img.inline').forEach(function(img) {
    img.onload = function() {
        adjustInlineImages(img);
    };
    if (img.complete) {
        adjustInlineImages(img);
    }
});

DoxygenAwesomeDarkModeToggle.init()
