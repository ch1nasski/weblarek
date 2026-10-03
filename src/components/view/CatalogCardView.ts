import { IProduct } from '../../types/index';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { CardView } from './CardView';
import { getImageUrl } from './viewUtils';

export interface IProductCardState {
    product: IProduct;
}

export class CatalogCardView extends CardView<IProductCardState> {
    private readonly title: HTMLElement;
    private readonly price: HTMLElement;
    private readonly image: HTMLImageElement;
    private readonly category: HTMLElement;

    constructor(container: HTMLElement, onSelect: () => void) {
        super(container);

        this.category = ensureElement<HTMLElement>('.card__category', this.container);
        this.title = ensureElement<HTMLElement>('.card__title', this.container);
        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.price = ensureElement<HTMLElement>('.card__price', this.container);

        this.container.addEventListener('click', onSelect);
    }

    set product(product: IProduct) {
        const categoryClass = (categoryMap as Record<string, string>)[product.category] ?? 'card__category_other';
        this.category.className = `card__category ${categoryClass}`;
        this.category.textContent = product.category;
        this.title.textContent = product.title;
        this.image.src = getImageUrl(product.image);
        this.image.alt = product.title;
        this.price.textContent = product.price == null ? 'Недоступно' : `${product.price} синапсов`;
    }
}