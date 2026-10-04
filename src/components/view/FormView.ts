import { IEvents } from '../base/Events';
import { IBuyer } from '../../types/index';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';
import { readFormData } from './viewUtils';

export interface IFormViewState extends Partial<IBuyer> {
    valid: boolean;
    errors: string;
}

export abstract class FormView<T extends IFormViewState> extends BaseView<T> {
    protected readonly form: HTMLFormElement;
    protected readonly errorNode: HTMLElement;
    protected readonly submitButton: HTMLButtonElement;
    protected readonly inputFields: HTMLInputElement[];

    protected constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.form = ensureElement<HTMLFormElement>(container);
        this.errorNode = ensureElement<HTMLElement>('.form__errors', this.form);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
        this.inputFields = ensureAllElements<HTMLInputElement>('input[name]', this.form);

        this.form.addEventListener('input', () => {
            this.events.emit('form:change', readFormData(this.form));
        });

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(this.getSubmitEventName());
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(message: string) {
        this.errorNode.textContent = message;
    }

    protected setField(name: keyof IBuyer, value?: string): void {
        const input = this.inputFields.find((field) => field.name === name);
        if (input && value !== undefined && input.value !== value) input.value = value;
    }

    set address(value: string) {
        this.setField('address', value);
    }

    set email(value: string) {
        this.setField('email', value);
    }

    set phone(value: string) {
        this.setField('phone', value);
    }

    protected abstract getSubmitEventName(): string;
}