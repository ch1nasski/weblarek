import { Component } from '../base/Component';
import { IBuyer, IProduct, TPayment } from '../../types/index';
import { categoryMap, CDN_URL } from '../../utils/constants';

export type NotifyHandler = (type: string, data?: unknown) => void;

export abstract class BaseView<T> extends Component<T> {
    protected readonly notify: NotifyHandler;

    protected constructor(container: HTMLElement, notify: NotifyHandler = () => undefined) {
        super(container);
        this.notify = notify;
    }

    protected emit(type: string, data?: unknown): void {
        this.notify(type, data);
    }

    render(): HTMLElement {
        return this.container;
    }
}

export abstract class CardView<T> extends BaseView<T> {
    protected constructor(container: HTMLElement, notify: NotifyHandler = () => undefined) {
        super(container, notify);
    }
}

function getImageUrl(image: string): string {
    if (/^https?:\/\//.test(image)) {
        return image;
    }

    return `${CDN_URL}/${image.replace(/^\/+/, '')}`;
}

function readFormData(form: HTMLFormElement): Record<string, string> {
    const data: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
        data[key] = String(value);
    });
    return data;
}

export class HeaderView extends BaseView<null> {
    private readonly basketButton: HTMLButtonElement;
    private readonly basketCounter: HTMLSpanElement;

    constructor(container: HTMLElement, notify: NotifyHandler = () => undefined) {
        super(container, notify);

        this.basketButton = this.container.querySelector('.header__basket') as HTMLButtonElement;
        this.basketCounter = this.container.querySelector('.header__basket-counter') as HTMLSpanElement;

        this.basketButton.addEventListener('click', () => {
            this.emit('basket:open');
        });
    }

    setCounter(value: number): void {
        this.basketCounter.textContent = String(value);
    }

    render(): HTMLElement {
        return this.container;
    }
}

export class CatalogCardView extends CardView<IProduct> {
    private readonly title: HTMLElement;
    private readonly price: HTMLElement;
    private readonly image: HTMLImageElement;
    private readonly category: HTMLElement;

    constructor(product: IProduct, notify: NotifyHandler = () => undefined) {
        const element = document.createElement('button');
        element.type = 'button';
        element.className = 'gallery__item card';

        super(element, notify);

        this.category = document.createElement('span');
        this.title = document.createElement('h2');
        this.image = document.createElement('img');
        this.price = document.createElement('span');

        const categoryClass = (categoryMap as Record<string, string>)[product.category] ?? 'card__category_other';
        this.category.className = `card__category ${categoryClass}`;
        this.title.className = 'card__title';
        this.image.className = 'card__image';
        this.price.className = 'card__price';

        this.container.addEventListener('click', () => {
            this.emit('card:select', { id: product.id });
        });

        this.render(product);
    }

    render(product?: Partial<IProduct>): HTMLElement {
        if (!product?.id) {
            return this.container;
        }

        this.category.textContent = product.category ?? '';
        this.title.textContent = product.title ?? '';
        this.image.src = getImageUrl(product.image ?? '');
        this.image.alt = product.title ?? '';
        this.price.textContent = product.price == null ? 'Недоступно' : `${product.price} синапсов`;

        this.container.innerHTML = '';
        this.container.append(this.category, this.title, this.image, this.price);

        return this.container;
    }
}

export class PreviewCardView extends CardView<IProduct> {
    private readonly image: HTMLImageElement;
    private readonly title: HTMLElement;
    private readonly text: HTMLElement;
    private readonly price: HTMLElement;
    private readonly category: HTMLElement;
    private readonly button: HTMLButtonElement;

    constructor(product: IProduct, isInBasket: boolean, notify: NotifyHandler = () => undefined) {
        const element = document.createElement('div');
        element.className = 'card card_full';

        super(element, notify);

        this.category = document.createElement('span');
        this.title = document.createElement('h2');
        this.text = document.createElement('p');
        this.image = document.createElement('img');
        this.price = document.createElement('span');
        this.button = document.createElement('button');

        const categoryClass = (categoryMap as Record<string, string>)[product.category] ?? 'card__category_other';
        this.category.className = `card__category ${categoryClass}`;
        this.title.className = 'card__title';
        this.text.className = 'card__text';
        this.image.className = 'card__image';
        this.price.className = 'card__price';
        this.button.className = 'button card__button';
        this.button.type = 'button';
        this.button.disabled = product.price === null;

        this.button.addEventListener('click', () => {
            this.emit('basket:toggle', { id: product.id });
        });

        this.render(product, isInBasket);
    }

    render(product?: Partial<IProduct>, isInBasket = false): HTMLElement {
        if (!product?.id) {
            return this.container;
        }

        const column = document.createElement('div');
        column.className = 'card__column';

        const row = document.createElement('div');
        row.className = 'card__row';

        this.category.textContent = product.category ?? '';
        this.title.textContent = product.title ?? '';
        this.text.textContent = product.description ?? '';
        this.image.src = getImageUrl(product.image ?? '');
        this.image.alt = product.title ?? '';
        this.price.textContent = product.price == null ? 'Недоступно' : `${product.price} синапсов`;
        this.button.textContent = product.price == null ? 'Недоступно' : isInBasket ? 'Удалить из корзины' : 'Купить';
        this.button.disabled = product.price == null;

        row.append(this.button, this.price);
        column.append(this.category, this.title, this.text, row);

        this.container.innerHTML = '';
        this.container.append(this.image, column);

        return this.container;
    }
}

export class BasketCardView extends CardView<IProduct> {
    private readonly index: HTMLSpanElement;
    private readonly title: HTMLElement;
    private readonly price: HTMLElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(product: IProduct, index: number, notify: NotifyHandler = () => undefined) {
        const element = document.createElement('li');
        element.className = 'basket__item card card_compact';

        super(element, notify);

        this.index = document.createElement('span');
        this.title = document.createElement('span');
        this.price = document.createElement('span');
        this.deleteButton = document.createElement('button');

        this.index.className = 'basket__item-index';
        this.title.className = 'card__title';
        this.price.className = 'card__price';
        this.deleteButton.className = 'basket__item-delete card__button';
        this.deleteButton.type = 'button';
        this.deleteButton.setAttribute('aria-label', 'удалить');

        this.deleteButton.addEventListener('click', () => {
            this.emit('basket:remove', { id: product.id });
        });

        this.render(product, index);
    }

    render(product?: Partial<IProduct>, itemIndex = 1): HTMLElement {
        if (!product?.id) {
            return this.container;
        }

        this.index.textContent = String(itemIndex);
        this.title.textContent = product.title ?? '';
        this.price.textContent = product.price == null ? 'Недоступно' : `${product.price} синапсов`;

        this.container.innerHTML = '';
        this.container.append(this.index, this.title, this.price, this.deleteButton);

        return this.container;
    }
}

export class BasketView extends BaseView<IProduct[]> {
    private readonly list: HTMLUListElement;
    private readonly total: HTMLElement;
    private readonly button: HTMLButtonElement;

    constructor(container: HTMLElement, notify: NotifyHandler = () => undefined) {
        super(container, notify);

        this.list = this.container.querySelector('.basket__list') as HTMLUListElement;
        this.total = this.container.querySelector('.basket__price') as HTMLElement;
        this.button = this.container.querySelector('.basket__button') as HTMLButtonElement;

        this.button.addEventListener('click', () => {
            this.emit('basket:checkout');
        });
    }

    render(items: IProduct[] = [], totalPrice = 0): HTMLElement {
        this.list.innerHTML = '';

        items.forEach((item, index) => {
            const basketItem = new BasketCardView(item, index + 1, this.notify);
            this.list.appendChild(basketItem.render());
        });

        this.total.textContent = `${totalPrice} синапсов`;
        this.button.disabled = items.length === 0;

        return this.container;
    }
}

export abstract class FormView extends BaseView<HTMLFormElement> {
    protected readonly form: HTMLFormElement;
    protected readonly errorNode: HTMLElement | null;
    protected readonly submitButton: HTMLButtonElement | null;

    protected constructor(container: HTMLElement, notify: NotifyHandler = () => undefined) {
        super(container, notify);

        this.form = this.container as HTMLFormElement;
        this.errorNode = this.form.querySelector('.form__errors');
        this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

        this.form.addEventListener('input', () => {
            this.emit('form:change', readFormData(this.form));
        });

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.emit(this.getSubmitEventName(), readFormData(this.form));
        });
    }

    setValidation(isValid: boolean, message = ''): void {
        if (this.errorNode) {
            this.errorNode.textContent = message;
        }
        if (this.submitButton) {
            this.submitButton.disabled = !isValid;
        }
    }
    protected abstract getSubmitEventName(): string;
}

export class OrderFormView extends FormView {
    private readonly paymentButtons: HTMLButtonElement[];
    private readonly addressInput: HTMLInputElement;

    constructor(container: HTMLElement, notify: NotifyHandler = () => undefined, buyer?: Partial<IBuyer>) {
        super(container, notify);

        this.paymentButtons = Array.from(this.form.querySelectorAll<HTMLButtonElement>('button[name]'));
        this.addressInput = this.form.querySelector('input[name="address"]') as HTMLInputElement;
        this.addressInput.value = buyer?.address ?? '';
        this.setPayment(buyer?.payment ?? '');

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.emit('order:payment:select', { payment });
            });
        });
    }

    setPayment(payment: TPayment | ''): void {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === payment);
        });
    }

    protected getSubmitEventName(): string {
        return 'order:next';
    }

    render(): HTMLElement {
        return this.container;
    }
}

export class ContactsFormView extends FormView {
    private readonly emailInput: HTMLInputElement;
    private readonly phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, notify: NotifyHandler = () => undefined, buyer?: Partial<IBuyer>) {
        super(container, notify);

        this.emailInput = this.form.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.form.querySelector('input[name="phone"]') as HTMLInputElement;
        this.emailInput.value = buyer?.email ?? '';
        this.phoneInput.value = buyer?.phone ?? '';
    }

    protected getSubmitEventName(): string {
        return 'contacts:submit';
    }

    render(): HTMLElement {
        return this.container;
    }
}

export class ModalView extends BaseView<HTMLElement> {
    private readonly content: HTMLElement;
    private readonly closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, notify: NotifyHandler = () => undefined) {
        super(container, notify);

        this.content = this.container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.container.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target === this.container) {
                this.close();
            }
        });
    }

    open(content: HTMLElement): void {
        this.content.innerHTML = '';
        this.content.append(content);
        this.container.classList.add('modal_active');
        this.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.content.innerHTML = '';
        this.emit('modal:close');
    }

    render(): HTMLElement {
        return this.container;
    }
}

export class SuccessView extends BaseView<number> {
    private readonly description: HTMLElement;
    private readonly button: HTMLButtonElement;

    constructor(container: HTMLElement, notify: NotifyHandler = () => undefined) {
        super(container, notify);

        this.description = this.container.querySelector('.order-success__description') as HTMLElement;
        this.button = this.container.querySelector('.order-success__close') as HTMLButtonElement;

        this.button.addEventListener('click', () => {
            this.emit('success:close');
        });
    }

    render(data?: number): HTMLElement {
        const total = data ?? 0;
        this.description.textContent = `Списано ${total} синапсов`;
        return this.container;
    }
}

export class GalleryView extends BaseView<IProduct[]> {
    constructor(container: HTMLElement, notify: NotifyHandler = () => undefined) {
        super(container, notify);
    }

    render(products: IProduct[] = []): HTMLElement {
        this.container.innerHTML = '';

        products.forEach((product) => {
            const card = new CatalogCardView(product, this.notify);
            this.container.appendChild(card.render(product));
        });

        return this.container;
    }
}
