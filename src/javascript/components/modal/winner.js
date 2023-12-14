import showModal from './modal';

export default function showWinnerModal(fighter) {
    showModal({
        title: `${fighter.name} Won!`,
        bodyElement: `${fighter.name} won the battle!`
    });
}
