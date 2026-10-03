import { IProduct } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { CardView } from './CardView';

export interface IBasketCardState {
    product: IProduct;
    index: number;
}

export class BasketCardView extends CardView<IBasketCardState> {
    private readonly indexElement: HTMLSpanElement;
    private readonly title: HTMLElement;
    private readonly price: HTMLElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);

        this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
        this.title = ensureElement<HTMLElement>('.card__title', this.container);
        this.price = ensureElement<HTMLElement>('.card__price', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', onRemove);
    }

    set product(product: IProduct) {
        this.title.textContent = product.title;
        this.price.textContent = product.price == null ? 'Недоступно' : `${product.price} синапсов`;
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}