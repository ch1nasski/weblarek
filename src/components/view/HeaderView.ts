import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

export interface IHeaderViewState {
    counter: number;
}

export class HeaderView extends BaseView<IHeaderViewState> {
    private readonly basketButton: HTMLButtonElement;
    private readonly basketCounter: HTMLSpanElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.basketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.basketCounter.textContent = String(value);
    }
}