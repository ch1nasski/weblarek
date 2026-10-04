import { IProduct } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { CardView, ICardViewState } from './CardView';

export interface IBasketCardState extends ICardViewState {
    product: IProduct;
    index: number;
}

export class BasketCardView extends CardView<IBasketCardState> {
    private readonly indexElement: HTMLSpanElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);

        this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', onRemove);
    }

    set product(product: IProduct) {
        this.title = product.title;
        this.price = product.price;
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}