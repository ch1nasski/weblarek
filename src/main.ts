import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ApiService } from './components/services/ApiService';
import { BasketCardView } from './components/view/BasketCardView';
import { BasketView } from './components/view/BasketView';
import { CatalogCardView } from './components/view/CatalogCardView';
import { ContactsFormView } from './components/view/ContactsFormView';
import { GalleryView } from './components/view/GalleryView';
import { HeaderView } from './components/view/HeaderView';
import { ModalView } from './components/view/ModalView';
import { OrderFormView } from './components/view/OrderFormView';
import { PreviewCardView } from './components/view/PreviewCardView';
import { SuccessView } from './components/view/SuccessView';
import { API_URL } from './utils/constants';
import { IBuyer, IProduct, TPayment } from './types/index';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const headerContainer = ensureElement<HTMLElement>('.header__container');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

const api = new Api(API_URL);
const apiService = new ApiService(api);

const headerView = new HeaderView(headerContainer, events);
const galleryView = new GalleryView(galleryContainer, events);
const modalView = new ModalView(modalContainer, events);
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const previewCardView = new PreviewCardView(cloneTemplate<HTMLElement>('#card-preview'), events);
const orderFormView = new OrderFormView(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsFormView = new ContactsFormView(cloneTemplate<HTMLFormElement>('#contacts'), events);
const successView = new SuccessView(cloneTemplate<HTMLElement>('#success'), events);

const createCatalogCards = (products: IProduct[]): HTMLElement[] => products.map((product) => {
    const productId = product.id;
    const cardRoot = cloneTemplate<HTMLElement>('#card-catalog');
    const cardView = new CatalogCardView(cardRoot, () => {
        events.emit('card:select', { id: productId });
    });

    return cardView.render({ product });
});

const createBasketCards = (products: IProduct[]): HTMLElement[] => products.map((product, index) => {
    const productId = product.id;
    const cardRoot = cloneTemplate<HTMLElement>('#card-basket');
    const cardView = new BasketCardView(cardRoot, () => {
        events.emit('basket:item:click', { id: productId });
    });

    return cardView.render({ product, index: index + 1 });
});

basketView.render({
    items: createBasketCards(basketModel.getItems()),
    total: basketModel.getTotal(),
    buttonDisabled: basketModel.getCount() === 0
});

const getOrderFormState = () => {
    const buyer = buyerModel.getBuyerData();
    const errors = buyerModel.validateBuyerData();

    return {
        payment: buyer.payment,
        address: buyer.address,
        valid: !errors.payment && !errors.address,
        errors: errors.payment || errors.address || ''
    };
};

const getContactsFormState = () => {
    const buyer = buyerModel.getBuyerData();
    const errors = buyerModel.validateBuyerData();

    return {
        email: buyer.email,
        phone: buyer.phone,
        valid: !errors.email && !errors.phone,
        errors: errors.email || errors.phone || ''
    };
};

const renderBuyerForms = () => {
    orderFormView.render(getOrderFormState());
    contactsFormView.render(getContactsFormState());
};

const renderBasket = () => {
    modalView.render({ content: basketView.render() });
    modalView.open();
};

const updateSelectedProductView = () => {
    const product = catalogModel.getSelectedProduct();
    if (!product) return null;

    return previewCardView.render({
        product,
        buttonText: product.price === null
            ? 'Недоступно'
            : basketModel.hasItem(product.id) ? 'Удалить из корзины' : 'Купить',
        buttonDisabled: product.price === null
    });
};

const renderSelectedProduct = () => {
    const content = updateSelectedProductView();
    if (!content) return;

    modalView.render({ content });
    modalView.open();
};

const renderSuccess = (total: number) => {
    modalView.render({ content: successView.render({ total }) });
    modalView.open();
};

headerView.render({ counter: basketModel.getCount() });
renderBuyerForms();

events.on('basket:open', renderBasket);

events.on<{ id: string }>('card:select', ({ id }) => {
    const product = catalogModel.getProduct(id);
    if (product) catalogModel.setSelectedProduct(product);
});

events.on<{ id: string }>('basket:item:click', ({ id }) => {
    const item = basketModel.getItems().find((basketItem) => basketItem.id === id);
    if (item) basketModel.removeItem(item);
});

events.on('card:action', () => {
    const product = catalogModel.getSelectedProduct();
    if (!product) return;

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product);
    } else {
        basketModel.addItem(product);
    }
    modalView.close();
});

events.on('basket:checkout', () => {
    modalView.render({ content: orderFormView.render(getOrderFormState()) });
    modalView.open();
});

events.on<{ payment: TPayment }>('order:payment:select', (data) => {
    buyerModel.setBuyerData({ payment: data.payment });
});

events.on('order:submit', () => {
    modalView.render({ content: contactsFormView.render(getContactsFormState()) });
    modalView.open();
});

events.on<Partial<IBuyer>>('form:change', (data) => {
    buyerModel.setBuyerData(data);
});

events.on('contacts:submit', () => {
    const buyer = buyerModel.getBuyerData();

    const orderData = {
        payment: buyer.payment as TPayment,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        items: basketModel.getItems().map((item) => item.id),
        total: basketModel.getTotal()
    };

    apiService.submitOrder(orderData)
        .then((response) => {
            renderSuccess(response.total);
            basketModel.clear();
            buyerModel.clearBuyerData();
        })
        .catch((error) => {
            console.error('Ошибка оформления заказа:', error);
            modalView.render({ content: contactsFormView.render({
                email: buyerModel.getBuyerData().email,
                phone: buyerModel.getBuyerData().phone,
                valid: false,
                errors: 'Не удалось отправить заказ'
            }) });
            modalView.open();
        });
});

events.on('modal:close', () => modalView.close());
events.on('success:close', () => modalView.close());

events.on('catalog:products:changed', () => {
    galleryView.render({ items: createCatalogCards(catalogModel.getProducts()) });
});

events.on('catalog:selected:changed', renderSelectedProduct);

events.on('basket:items:changed', () => {
    headerView.render({ counter: basketModel.getCount() });
    updateSelectedProductView();
    basketView.render({
        items: createBasketCards(basketModel.getItems()),
        total: basketModel.getTotal(),
        buttonDisabled: basketModel.getCount() === 0
    });
});

events.on('buyer:data:changed', renderBuyerForms);

basketModel.clear();
buyerModel.clearBuyerData();

apiService.getProducts()
    .then((response) => catalogModel.setProducts(response.items))
    .catch((error) => console.error('Ошибка при загрузке каталога:', error));