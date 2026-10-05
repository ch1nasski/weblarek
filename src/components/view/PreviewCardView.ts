import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { CardView, ICardViewState } from './CardView';

export interface IPreviewCardState extends ICardViewState {
    category: string;
    image: string;
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class PreviewCardView extends CardView<IPreviewCardState> {
    protected readonly events: IEvents;
    private readonly imageElement: HTMLImageElement;
    private readonly textElement: HTMLElement;
    private readonly categoryElement: HTMLElement;
    private readonly button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('card:action');
        });
    }

    set category(value: string) {
        const categoryClass = (categoryMap as Record<string, string>)[value] ?? 'card__category_other';
        this.categoryElement.className = `card__category ${categoryClass}`;
        this.categoryElement.textContent = value;
    }

    set image(value: string) {
        this.imageElement.src = value;
        this.imageElement.alt = this.titleElement.textContent ?? '';
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }
}