import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { CardView, ICardViewState } from './CardView';

export interface IProductCardState extends ICardViewState {
    category: string;
    image: string;
}

export class CatalogCardView extends CardView<IProductCardState> {
    private readonly imageElement: HTMLImageElement;
    private readonly categoryElement: HTMLElement;

    constructor(container: HTMLElement, onSelect: () => void) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', onSelect);
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
}