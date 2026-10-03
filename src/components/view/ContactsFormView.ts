import { IEvents } from '../base/Events';
import { FormView, IFormViewState } from './FormView';

export interface IContactsFormViewState extends IFormViewState {
    email: string;
    phone: string;
}

export class ContactsFormView extends FormView<IContactsFormViewState> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    protected getSubmitEventName(): string {
        return 'contacts:submit';
    }
}