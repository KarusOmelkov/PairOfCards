import {level} from "./level.js";

/*
TODO:
1) Сделать модальные окна
*/

class Game {
    protected _pointsCount: number;
    protected _points: HTMLElement;
    protected _field: HTMLElement;
    protected _restartButton: HTMLElement;
    protected _endGameButton: HTMLElement;
    protected _startGameButton: HTMLElement;
    protected _typeOfCard: Array<Card>;
    protected _currentLevel: level;
    protected _numberLevel: number;
    protected _divTimer: HTMLElement;
    protected _divPoint: HTMLElement;

    constructor() {
        this._divTimer = document.getElementById('divTimer');
        this._divPoint = document.getElementById('divPoint');
        this._points = document.getElementById('point');
        this._field = document.getElementById('cards');
        this._restartButton = document.getElementById('restart');
        this._endGameButton = document.getElementById('endGame');
        this._startGameButton = document.getElementById('startGame');
        this._restartButton.addEventListener('click', this._onClickRestart.bind(this));
        this._endGameButton.addEventListener('click', this._onClickEndGame.bind(this));
        this._startGameButton.addEventListener('click', this._onClickStartGame.bind(this));
        this._typeOfCard = this._createTypeOfCard();
    }

    protected _onClickRestart(): void {
        this._currentLevel.endLevelGame(false);
        delete this._currentLevel;
        this._clearField();
        this._onClickStartGame();
    }

    protected _onClickEndGame(str: string = 'finish'): void{
        switch(str){
            case 'time': alert(`Вы проиграли! \nВремя закончилось. \nВы набрали ${this._getPoint()} очков`); break;
            case 'congratulation': alert(`Поздравляем! \nВы прошли игру. \nИтоговое количество очков: ${this._getPoint()}`); break;
            default: alert(`Вы завершили игру! \nИтоговое количество очков: ${this._getPoint()}`); break;
        }
        this._clearField();
        this._field.hidden = true;
        this._divTimer.hidden = true;
        this._divPoint.hidden = true;
        this._restartButton.hidden = true;
        this._endGameButton.hidden = true;
        this._startGameButton.hidden = false;     
        this._points.textContent = '0';
        this._currentLevel.endLevelGame(false);
        delete this._currentLevel;
    }

    protected _onClickStartGame(): void{ 
        this._field.hidden = false;
        this._divTimer.hidden = false;
        this._divPoint.hidden = false;
        this._restartButton.hidden = false;
        this._endGameButton.hidden = false;
        this._startGameButton.hidden = true;
        this._points.textContent = '0';
        this._pointsCount = 0;
        this._numberLevel = 1;
        this._createLevel(this._numberLevel); 
    }

    protected _clearField(): void{
        this._field.innerHTML = ''
    }

    protected _createTypeOfCard(): Array<Card>{
        const Book: Card = {name: 'book', src: 'book.png'};
        const Bug: Card = {name: 'bug', src: 'bug.png'};
        const Gear: Card = {name: 'gear', src: 'gear.png'};
        const Head: Card = {name: 'head', src: 'head.png'}; 
        const Laptop: Card = {name: 'laptop', src: 'laptop.png'};
        const Algorithm: Card = {name: 'algorithm', src: 'algorithm.png'};
        const Loupe: Card = {name: 'loupe', src: 'loupe.png'};
        const Men: Card = {name: 'men', src: 'men.png'};
        const Phone: Card = {name: 'phone', src: 'phone.png'};
        const Tablet: Card = {name: 'tablet', src: 'tablet.png'};
        return [Book, Bug, Gear, Head, Laptop, Algorithm, Loupe, Men, Phone, Tablet];
    }

    protected _setPoint(point: number): void{
        this._pointsCount += point;
        this._points.textContent = this._pointsCount.toString();
    }
    
    protected _getPoint(): number{
        return this._pointsCount;
    }

    protected _createLevel(numberLevel: number): void{
        this._currentLevel = new level(numberLevel+1, this._typeOfCard, numberLevel*20, this);
    }

    protected _nextLevel(): void{
        this._numberLevel++;
        if (this._numberLevel == 10){
            this._onClickEndGame('congratulation');
            return;
        }
        this._clearField();
        delete this._currentLevel;
        this._createLevel(this._numberLevel);
    }
}

export interface Card {
    name: string;
    src: string;
};

const game = new Game();

