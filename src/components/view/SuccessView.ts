import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

export interface ISuccessViewState {
    total: number;
}

export class SuccessView extends BaseView<ISuccessViewState> {
    private readonly description: HTMLElement;
    private readonly button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.description.textContent = `Списано ${value} синапсов`;
    }
}