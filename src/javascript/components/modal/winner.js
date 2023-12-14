import createElement from '../../helpers/domHelper';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    const body = createElement({ tagName: 'div' });

    const image = createElement({
        tagName: 'img',
        attributes: { src: fighter.source }
    });

    const winnerText = createElement({
        tagName: 'p'
    });

    winnerText.innerHTML = `${fighter.name} won the battle!`;

    body.appendChild(image);
    body.appendChild(winnerText);
    showModal({
        title: `${fighter.name} Won!`,
        bodyElement: body
    });
}
