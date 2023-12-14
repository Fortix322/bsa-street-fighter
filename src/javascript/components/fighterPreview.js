import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const flippedImage = position === 'right' ? 'fighter-preview__fighter-img-flipped' : '';
        const alignedText = position === 'right' ? 'fighter-preview__fighter-info-right' : '';

        const imageElement = createElement({
            tagName: 'img',
            className: `fighter-preview__fighter-img ${flippedImage}`
        });

        const infoElement = createElement({
            tagName: 'h1',
            className: `fighter-preview__fighter-info ${alignedText}`
        });

        imageElement.setAttribute('src', fighter.source);

        let info = { ...fighter };

        delete info._id;
        delete info.source;

        info = JSON.stringify(info);
        info = info.slice(1, -1);
        info = info.replace(/"/g, '');
        info = info.replace(/,/g, '\n');
        infoElement.innerHTML = info;

        fighterElement.appendChild(imageElement);
        fighterElement.appendChild(infoElement);
    }

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
