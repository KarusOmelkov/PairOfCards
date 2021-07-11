import {Card} from "./game.js"

export class level {
    protected _isStarted: boolean = false;
    protected _timer: HTMLElement;
    protected _cards: Array<Card>;
    protected _field: HTMLElement;
    protected _seconds: number;
    public intervalTimer: number; 
    protected _game;
    protected _firstClickedElement: HTMLElement | undefined;
    protected _countFindedPairs: number = 0;

    constructor(countPairs: number, typeOfCard: Array<Card>, seconds: number, game){
        this._game = game;
        this._seconds = seconds;
        this._timer = document.getElementById('timer');
        this._timer.textContent = this._exchangeOfSeconds(this._seconds);
        this._field = document.getElementById('cards');
        this._field.style.width = `${140*countPairs}px`;
        this._cards = this._createArrayCards(countPairs, this._shuffle(typeOfCard, 3));

        this._createElementCards();
    }

    protected _createElementCards(): void{
        for(let i = 0; i < this._cards.length; i++){
            const divScene: HTMLElement = this._createDivBlock('scene col p-0 m-1');
            
            const divCard: HTMLElement = this._createDivBlock('card');
            divCard.style.border = '0px';
            divCard.id = `${i}`;
            divCard.addEventListener('click', this._onClickCard.bind(this));
    
            const divFront: HTMLElement = this._createDivBlock(
                'rounded card__face card__face--front border border-dark',
                '<img src="picture/back.png" style="height: auto; width: 100%;">');
    
            const divBack: HTMLElement = this._createDivBlock(
                'rounded card__face card__face--back border border-dark',
                `<img src="picture/${this._cards[i].src}" style="height: auto; width: 100%;">`);
    
            this._field.append(divScene);
            divScene.append(divCard);
            divCard.append(divFront);
            divCard.append(divBack);
        }
    }

    protected _createDivBlock(className: string, html?: string): HTMLElement {
        const divBlock: HTMLElement = document.createElement('div');
        divBlock.className = className;
        divBlock.innerHTML = html ? html : '';
        return divBlock;
    }

    protected _createArrayCards(countPairs: number, typeOfCard: Array<Card>): Array<Card>{
        let array: Array<Card> = [];
        for(let i: number = 0; i < countPairs; i++){
            array[i] = typeOfCard[i];
            array[countPairs + i] = typeOfCard[i];
        }
        return this._shuffle(array, 3);
    }

    protected _shuffle(array: Card[], count: number = 1): Array<Card>{
        for (let i: number = 0; i < count; i++)
            array.sort(() => Math.random() - 0.5);
        return array;
    }

    protected _onClickCard(e: any): void{
        if(!this._isStarted){
            this._timerInterval();
            this._isStarted = true;
        }

        if (e.currentTarget.classList.contains('finded') || this._firstClickedElement == e.currentTarget) {
            return;		
        }

        e.currentTarget.classList.toggle('is-flipped');
        if (!this._firstClickedElement) {
            this._firstClickedElement = e.currentTarget;
            return;
        }

        const firstClickedElement: HTMLElement = this._firstClickedElement;
        const secondClickedElement: HTMLElement = e.currentTarget;
        if(this._cards[firstClickedElement.id].name == this._cards[secondClickedElement.id].name){
            firstClickedElement.classList.add('finded');
            secondClickedElement.classList.add('finded');
            this._countFindedPairs++;
            this._game._setPoint(20);

            let visible: number = 1;
            setTimeout(() => {
                const intervalOpacity = setInterval(() => {
                    (<any>firstClickedElement).parentNode.style.opacity = visible;
                    (<any>secondClickedElement).parentNode.style.opacity = visible;
                    visible -= 0.02;

                    if (visible < -0.01)
                        clearInterval(intervalOpacity);
                }, 10);
                firstClickedElement.style.cursor = 'default';
                secondClickedElement.style.cursor = 'default';
            }, 500);
            
            if(this._countFindedPairs == this._cards.length / 2){
                if (this._cards.length == 20){
                    this.endLevelGame(true);
                    return;
                }
                setTimeout(() => {
                    this._game._setPoint(this._seconds);
                    const result: boolean = confirm(`Вы прошли уровень.\nТекущее количество очков: ${this._game._getPoint()}\nИграем дальше?`);
                    result ? this.endLevelGame(true) : this._game._onClickEndGame('finish');
                }, 1100);
            }
        } else {
            this._timer.style.color = 'red';
            this._seconds -= 5;
            setTimeout(() => {
                firstClickedElement.classList.remove('is-flipped');
                secondClickedElement.classList.remove('is-flipped');
                this._timer.style.color = 'black';
            }, 500);                
        }
        this._firstClickedElement = undefined;
    }

    protected _timerInterval(): void{
        this.intervalTimer = setInterval(() => {
            this._seconds--;
            this._timer.textContent = this._exchangeOfSeconds(this._seconds);
            if (this._seconds < 1) {
                this.endLevelGame(false)
                this._game._onClickEndGame('time');
            }
        }, 1000);
    }

    protected _exchangeOfSeconds(seconds: number): string{
        const min: number = Math.floor(seconds/60);
        const sec: number = seconds % 60;
        return sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`; // 01:25
    }

    public endLevelGame(next: boolean): void{
        clearInterval(this.intervalTimer);
        this._timer.textContent = '00:00';
        if (next)
            this._game._nextLevel();
    }
}
