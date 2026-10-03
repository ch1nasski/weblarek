import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

export interface IBasketViewState {
    items: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
}

export class BasketView extends BaseView<IBasketViewState> {
    private readonly list: HTMLUListElement;
    private readonly totalElement: HTMLElement;
    private readonly button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.list = ensureElement<HTMLUListElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('basket:checkout');
        });
    }

    set items(items: HTMLElement[]) {
        this.list.replaceChildren(...items);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }
}