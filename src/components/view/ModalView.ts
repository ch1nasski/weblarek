import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { BaseView } from './BaseView';

export interface IModalViewState {
    content: HTMLElement | null;
}

export class ModalView extends BaseView<IModalViewState> {
    private readonly contentElement: HTMLElement;
    private readonly closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) this.events.emit('modal:close');
        });
    }

    set content(content: HTMLElement | null) {
        this.contentElement.replaceChildren();
        if (content) this.contentElement.append(content);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}