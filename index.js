let seconds;
let intervalTimer;
;
const Book = {
    name: 'book',
    src: 'book.png'
};
const Bug = {
    name: 'bug',
    src: 'bug.png'
};
const Gear = {
    name: 'gear',
    src: 'gear.png'
};
const Head = {
    name: 'head',
    src: 'head.png'
};
const Laptop = {
    name: 'laptop',
    src: 'laptop.png'
};
const TypeOfCard = [Book, Bug, Gear, Head, Laptop];
function start() {
    const cards = document.querySelector('#cards');
    const buttons = document.querySelector('#buttons');
    const begin = document.querySelector('#begin');
    cards.hidden = false;
    buttons.hidden = false;
    begin.hidden = true;
    seconds = 120;
    createCards(10);
    timer();
}
function createCards(count) {
    const cards = document.querySelector('#cards');
    const arrayTypeOfCards = createArrayCard(count);
    for (let i = 0; i < count; i++) {
        let divScene = document.createElement('div');
        divScene.className = 'scene col p-0 m-1';
        let divCard = document.createElement('div');
        divCard.className = 'card';
        divCard.style.border = '0px';
        divCard.id = `${i}`;
        divCard.addEventListener('click', function () {
            if (!divCard.classList.contains('is-flipped')) {
                divCard.classList.toggle('is-flipped');
            }
            if (!divCard.classList.contains('checked'))
                check(arrayTypeOfCards, count, divCard.id);
        });
        const divFront = createDivBlock('rounded card__face card__face--front border border-dark', '<img src="picture/back.png" style="height: auto; width: 100%;">');
        const divBack = createDivBlock('rounded card__face card__face--back border border-dark', `<img src="picture/${arrayTypeOfCards[i].src}" style="height: auto; width: 100%;">`);
        cards.append(divScene);
        divScene.append(divCard);
        divCard.append(divFront);
        divCard.append(divBack);
    }
}
function createDivBlock(className, html) {
    const divBlock = document.createElement('div');
    divBlock.className = className;
    divBlock.innerHTML = html;
    return divBlock;
}
function createArrayCard(count) {
    let array = [];
    for (let i = 0; i < count / 2; i++) {
        array[i] = TypeOfCard[i];
        array[(count / 2) + i] = TypeOfCard[i];
    }
    shuffle(array, 3);
    return array;
}
function shuffle(array, count = 1) {
    for (let i = 0; i < count; i++)
        array.sort(() => Math.random() - 0.5);
}
function check(types, countCards, lastCardId) {
    let cardsIsFlipped = document.querySelectorAll('.is-flipped');
    let cardsWithoutChecked = [];
    for (let crd of cardsIsFlipped) {
        if (!crd.classList.contains('checked') && crd.id != lastCardId) {
            cardsWithoutChecked.push(crd);
        }
    }
    let lastCard = document.getElementById(`${lastCardId}`);
    cardsWithoutChecked.push(lastCard);
    if (cardsWithoutChecked.length > 1) {
        if (types[cardsWithoutChecked[0].id].name === types[cardsWithoutChecked[1].id].name) {
            cardsWithoutChecked[0].classList.add('checked');
            cardsWithoutChecked[1].classList.add('checked');
            setPoint(20);
            setTimeout(() => {
                const cardsIsChecked = document.querySelectorAll('.checked');
                if (cardsIsChecked.length === countCards) {
                    setPoint(seconds);
                    const result = confirm(`Вы прошли уровень.\nТекущее количество очков: ${getPoint()}\nИграем дальше?`);
                    if (result)
                        restart();
                    else
                        finish();
                }
            }, 1700);
            let visible = 1;
            setTimeout(() => {
                const intervalOpacity = setInterval(() => {
                    cardsWithoutChecked[0].parentNode.style.opacity = visible;
                    cardsWithoutChecked[1].parentNode.style.opacity = visible;
                    visible -= 0.01;
                    if (visible < -0.05)
                        clearInterval(intervalOpacity);
                }, 10);
            }, 500);
        }
        else {
            let timer = document.querySelector('#timer');
            timer.style.color = 'red';
            seconds -= 5;
            setTimeout(() => {
                cardsWithoutChecked[0].classList.remove('is-flipped');
                cardsWithoutChecked[1].classList.remove('is-flipped');
                timer.style.color = 'black';
            }, 500);
        }
    }
}
function timer() {
    let timer = document.querySelector('#timer');
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
    intervalTimer = setInterval(() => {
        seconds--;
        min = Math.floor(seconds / 60);
        sec = seconds % 60;
        timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
        if (seconds < 1) {
            clearInterval(intervalTimer);
            finish('Время закончилось');
        }
    }, 1000);
}
function clearField() {
    const field = document.querySelector('#cards');
    field.innerHTML = '';
}
function restart() {
    clearField();
    createCards(10);
    seconds = 120;
}
function finish(str = `Вы закончили! \nИтоговое количество очков: ${getPoint()}`) {
    if (str)
        alert(str);
    clearField();
    const cards = document.querySelector('#cards');
    const buttons = document.querySelector('#buttons');
    const begin = document.querySelector('#begin');
    cards.hidden = true;
    buttons.hidden = true;
    begin.hidden = false;
    clearInterval(intervalTimer);
    let timer = document.querySelector('#timer');
    timer.textContent = '00:00';
    const points = document.querySelector('#point');
    points.textContent = '0';
}
function setPoint(point) {
    const points = document.querySelector('#point');
    points.textContent = (parseInt(points.textContent) + point).toString();
}
function getPoint() {
    const points = document.querySelector('#point');
    return parseInt(points.textContent);
}
