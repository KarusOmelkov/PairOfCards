let seconds: number;
let intervalTimer: any;

// TODO:
// Победа на уровне
// Модальные окна
// Уровни сложности
// Класс таймер

type card = {
    name: string;
    src: string;
};

const book: card = {
    name: 'book',
    src: 'book.png'
};

const bug: card = {
    name: 'bug',
    src: 'bug.png'
};

const gear: card = {
    name: 'gear',
    src: 'gear.png'
};

const head: card = {
    name: 'head',
    src: 'head.png'
};

const laptop: card = {
    name: 'laptop',
    src: 'laptop.png'
};

const typeOfCard: Array<card> = [book, bug, gear, head, laptop];

function start(): void{
    const cards: any = document.querySelector('#cards');
    const buttons: any = document.querySelector('#buttons');
    const begin: any = document.querySelector('#begin');

    cards.hidden = false;
    buttons.hidden = false;
    begin.hidden = true;

    seconds = 120;

    createCards(10);
    timer();    
}

function createCards(count: number): void {
    const cards: any = document.querySelector('#cards');
    // cards.classList.toggle('row-cols-5');
    // cards.classList.toggle('row-cols-3')

    const arrayTypeOfCards: card[] = createArrayCard(count);

    for(let i = 0; i < count; i++){
        let divScene: any = document.createElement('div');
        divScene.className = 'scene col p-0 m-1';
        
        let divCard: any = document.createElement('div');
        divCard.className = 'card';
        divCard.style.border = '0px';
        divCard.id = `${i}`;
        
        divCard.addEventListener( 'click', function(): void {
            if (!divCard.classList.contains('is-flipped')){
                divCard.classList.toggle('is-flipped');
            }
            if (!divCard.classList.contains('checked'))
                check(arrayTypeOfCards, count);
        });

        let divFront: any = document.createElement('div');
        divFront.className = 'rounded card__face card__face--front border border-dark';
        divFront.innerHTML = '<img src="picture/back.png" style="height: auto; width: 100%;">';

        let divBack: any = document.createElement('div');
        divBack.className = 'rounded card__face card__face--back border border-dark';
        divBack.innerHTML = `<img src="picture/${arrayTypeOfCards[i].src}" style="height: auto; width: 100%;">`;

        cards.append(divScene);
        divScene.append(divCard);
        divCard.append(divFront);
        divCard.append(divBack);
    }
}

function createArrayCard(count: number): Array<card>{
    let array: card[] = [];
    for(let i: number = 0; i < count / 2; i++){
        array[i] = typeOfCard[i];
        array[(count / 2) + i] = typeOfCard[i];
    }
    shuffle(array);
    shuffle(array);
    shuffle(array);

    return array;
}

function shuffle(array: card[]): void{
    array.sort(() => Math.random() - 0.5);
}

function check(types: card[], countCards: number): void {
    let cardsIsFlipped: any = document.querySelectorAll('.is-flipped');
    let cardsWithoutChecked: any[] = [];
    for (let crd of cardsIsFlipped){
        if (!crd.classList.contains('checked')){
            cardsWithoutChecked.push(crd);
        }
    }
    
    if (cardsWithoutChecked.length > 1){
        if (types[cardsWithoutChecked[0].id].name === types[cardsWithoutChecked[1].id].name){
            cardsWithoutChecked[0].classList.add('checked');
            cardsWithoutChecked[1].classList.add('checked');
            setPoint(20);

            setTimeout(() => {
                const cardsIsChecked: any = document.querySelectorAll('.checked');
                if(cardsIsChecked.length === countCards){
                    setPoint(seconds);
                    const result: boolean = confirm(`Вы прошли уровень.\nТекущее количество очков: ${getPoint()}\nИграем дальше?`);
                    if(result) 
                        restart();
                    else finish();
                }
            }, 1700);

            let visible: number = 1;
            setTimeout(() => {
                const intervalOpacity = setInterval(() => {
                    cardsWithoutChecked[0].parentNode.style.opacity = visible;
                    cardsWithoutChecked[1].parentNode.style.opacity = visible;
                    visible -= 0.01;
    
                    if (visible < -0.05)
                        clearInterval(intervalOpacity);
                }, 10);
            }, 500);
        } else {
            let timer: any = document.querySelector('#timer');
            timer.style.color = 'red';
            seconds -= 5;

            setTimeout(() => {
                cardsWithoutChecked[0].classList.toggle('is-flipped');
                cardsWithoutChecked[1].classList.toggle('is-flipped');
                timer.style.color = 'black';
            }, 500);
        }
    }
    
}

function timer(): void{
    let timer: any = document.querySelector('#timer');
    let min: number = Math.floor(seconds/60);
    let sec: number = seconds % 60;
    timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
    intervalTimer = setInterval(() => {
        seconds--;
        min = Math.floor(seconds/60);
        sec = seconds % 60;
        timer.textContent = sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`;
        if (seconds < 1) {
            clearInterval(intervalTimer);
            finish('Время закончилось');
        }
    }, 1000);
}

function clearField(): void{
    const field: any = document.querySelector('#cards');
    field.innerHTML = ''
}

function restart(): void{
    clearField();
    createCards(10);
    seconds = 120;
}

function finish(str: string  = `Вы закончили! \nИтоговое количество очков: ${getPoint()}`): void{
    if (str)
        alert(str);

    clearField();
    const cards: any = document.querySelector('#cards');
    const buttons: any = document.querySelector('#buttons');
    const begin: any = document.querySelector('#begin');

    cards.hidden = true;
    buttons.hidden = true;
    begin.hidden = false;

    clearInterval(intervalTimer);
    let timer: any = document.querySelector('#timer');
    timer.textContent = '00:00';

    const points = document.querySelector('#point');
    points.textContent = '0';
}

function setPoint(point: number): void{
    const points = document.querySelector('#point');
    points.textContent = (parseInt(points.textContent) + point).toString();
}

function getPoint(): number{
    const points = document.querySelector('#point');
    return parseInt(points.textContent);
}