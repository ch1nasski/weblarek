import { IEvents } from '../base/Events';
import { IProduct } from '../../types/index';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { CardView, ICardViewState } from './CardView';
import { getImageUrl } from './viewUtils';

export interface IPreviewCardState extends ICardViewState {
    product: IProduct;
    buttonText: string;
    buttonDisabled: boolean;
}

export class PreviewCardView extends CardView<IPreviewCardState> {
    protected readonly events: IEvents;
    private readonly image: HTMLImageElement;
    private readonly text: HTMLElement;
    private readonly category: HTMLElement;
    private readonly button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.category = ensureElement<HTMLElement>('.card__category', this.container);
        this.text = ensureElement<HTMLElement>('.card__text', this.container);
        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('card:action');
        });
    }

    set product(product: IProduct) {
        const categoryClass = (categoryMap as Record<string, string>)[product.category] ?? 'card__category_other';
        this.category.className = `card__category ${categoryClass}`;
        this.category.textContent = product.category;
        this.title = product.title;
        this.text.textContent = product.description;
        this.image.src = getImageUrl(product.image);
        this.image.alt = product.title;
        this.price = product.price;
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }
}