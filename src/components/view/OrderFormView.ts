import { IEvents } from '../base/Events';
import { IBuyer, TPayment } from '../../types/index';
import { ensureAllElements } from '../../utils/utils';
import { FormView, IFormViewState } from './FormView';

export interface IOrderFormViewState extends IFormViewState {
    payment: IBuyer['payment'];
    address: string;
}

export class OrderFormView extends FormView<IOrderFormViewState> {
    private readonly paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>('button[name]', this.container);

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                if (button.name === 'card' || button.name === 'cash') {
                    this.events.emit('order:payment:select', { payment: button.name as TPayment });
                }
            });
        });
    }

    set payment(value: IBuyer['payment']) {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    protected getSubmitEventName(): string {
        return 'order:submit';
    }
}