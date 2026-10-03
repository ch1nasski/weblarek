import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { ApiService } from './components/services/ApiService';
import { HeaderView, GalleryView, ModalView, PreviewCardView, BasketView, OrderFormView, ContactsFormView, SuccessView, FormView } from './components/view/View';
import { API_URL } from './utils/constants';
import { IBuyer, IProduct, TPayment } from './types/index';
import { cloneTemplate } from './utils/utils';

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const headerContainer = document.querySelector('.header__container') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.getElementById('modal-container') as HTMLElement;

let activeModal: 'basket' | 'preview' | 'order' | 'contacts' | 'success' | null = null;
let activeBasketView: BasketView | null = null;
let activeFormView: FormView | null = null;

const api = new Api(API_URL);
const apiService = new ApiService(api);

const validateActiveForm = () => {
    if (!activeFormView) return;

    const buyer = buyerModel.getBuyerData();

    if (activeModal === 'order') {
        const message = !buyer.payment
            ? 'Выберите способ оплаты'
            : !buyer.address.trim()
                ? 'Укажите адрес доставки'
                : '';
        activeFormView.setValidation(!message, message);
    }

    if (activeModal === 'contacts') {
        const message = !buyer.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)
            ? 'Укажите корректный email'
            : !buyer.phone.trim()
                ? 'Укажите телефон'
                : '';
        activeFormView.setValidation(!message, message);
    }
};

const handleViewEvent = (type: string, data?: unknown) => {
    switch (type) {
        case 'basket:open': {
            const basketRoot = cloneTemplate<HTMLElement>('#basket');
            const basketView = new BasketView(basketRoot, handleViewEvent);
            activeBasketView = basketView;
            activeFormView = null;
            activeModal = 'basket';
            modalView.open(basketView.render(basketModel.getItems(), basketModel.getTotal()));
            break;
        }

        case 'card:select': {
            const productId = (data as { id: string }).id;
            const selectedProduct = catalogModel.getProduct(productId);
            if (!selectedProduct) break;
            catalogModel.setSelectedProduct(selectedProduct);
            break;
        }

        case 'basket:toggle': {
            const productId = (data as { id: string }).id;
            const product = catalogModel.getProduct(productId);
            if (product && product.price !== null) {
                if (basketModel.hasItem(productId)) {
                    basketModel.removeItem(product);
                } else {
                    basketModel.addItem(product);
                }
            }
            modalView.close();
            break;
        }

        case 'basket:remove': {
            const productId = (data as { id: string }).id;
            const product = basketModel.getItems().find((item) => item.id === productId);
            if (product) basketModel.removeItem(product);
            if (activeModal === 'preview') modalView.close();
            break;
        }

        case 'basket:checkout': {
            if (basketModel.getCount() === 0) break;
            renderOrderForm();
            break;
        }

        case 'order:payment:select': {
            const payment = (data as { payment: TPayment }).payment;
            buyerModel.setBuyerData({ payment });
            if (activeFormView instanceof OrderFormView) {
                activeFormView.setPayment(payment);
            }
            break;
        }

        case 'order:next': {
            const formData = data as Record<string, string>;
            buyerModel.setBuyerData({
                address: formData.address ?? ''
            });
            if (!buyerModel.getBuyerData().payment || !buyerModel.getBuyerData().address.trim()) break;
            renderContactsForm();
            break;
        }

        case 'form:change': {
            const formData = data as Record<string, string>;
            buyerModel.setBuyerData(formData as Partial<IBuyer>);
            break;
        }

        case 'contacts:submit': {
            const formData = data as Record<string, string>;
            buyerModel.setBuyerData({
                email: formData.email ?? buyerModel.getBuyerData().email,
                phone: formData.phone ?? buyerModel.getBuyerData().phone
            });
            const buyer = buyerModel.getBuyerData();
            if (!buyer.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email) || !buyer.phone.trim()) break;

            const orderData = {
                payment: buyer.payment as TPayment,
                email: buyer.email,
                phone: buyer.phone,
                address: buyer.address,
                items: basketModel.getItems().map(item => item.id),
                total: basketModel.getTotal()
            };

            apiService.submitOrder(orderData)
                .then(() => {
                    renderSuccessModal(orderData.total);
                    basketModel.clear();
                    buyerModel.clearBuyerData();
                })
                .catch((error) => {
                    console.error('Ошибка оформления заказа:', error);
                    renderContactsForm();
                });
            break;
        }

        case 'modal:close':
            activeModal = null;
            activeBasketView = null;
            activeFormView = null;
            break;

        case 'success:close':
            modalView.close();
            activeModal = null;
            break;

        case 'modal:open':
            break;

        default:
            break;
    }
};

const headerView = new HeaderView(headerContainer, handleViewEvent);
const galleryView = new GalleryView(galleryContainer, handleViewEvent);
const modalView = new ModalView(modalContainer, handleViewEvent);

const renderCatalog = (products: IProduct[]) => {
    galleryView.render(products);
};

const renderPreviewModal = (product: IProduct) => {
    const previewCard = new PreviewCardView(product, basketModel.hasItem(product.id), handleViewEvent);
    activeModal = 'preview';
    activeBasketView = null;
    activeFormView = null;
    modalView.open(previewCard.render(product, basketModel.hasItem(product.id)));
};

const renderOrderForm = () => {
    const formRoot = cloneTemplate<HTMLFormElement>('#order');
    const orderFormView = new OrderFormView(formRoot, handleViewEvent, buyerModel.getBuyerData());
    activeBasketView = null;
    activeFormView = orderFormView;
    activeModal = 'order';
    validateActiveForm();
    modalView.open(orderFormView.render());
};

const renderContactsForm = () => {
    const formRoot = cloneTemplate<HTMLFormElement>('#contacts');
    const contactsFormView = new ContactsFormView(formRoot, handleViewEvent, buyerModel.getBuyerData());
    activeBasketView = null;
    activeFormView = contactsFormView;
    activeModal = 'contacts';
    validateActiveForm();
    modalView.open(contactsFormView.render());
};

const renderSuccessModal = (total: number) => {
    const successRoot = cloneTemplate<HTMLElement>('#success');
    const successView = new SuccessView(successRoot, handleViewEvent);
    activeModal = 'success';
    activeBasketView = null;
    activeFormView = null;
    modalView.open(successView.render(total));
};

catalogModel.on('catalog:products:changed', (data: { products: IProduct[] }) => {
    renderCatalog(data.products);
});

catalogModel.on('catalog:selected:changed', (data: { product: IProduct | null }) => {
    if (data.product) {
        renderPreviewModal(data.product);
    }
});

basketModel.on('basket:items:changed', (data: { items: IProduct[]; total: number; count: number }) => {
    headerView.setCounter(data.count);

    if (activeModal === 'basket' && activeBasketView) {
        activeBasketView.render(data.items, data.total);
    }
});

buyerModel.on('buyer:data:changed', validateActiveForm);

apiService.getProducts()
    .then((response) => {
        catalogModel.setProducts(response.items);
    })
    .catch((error) => console.error('Ошибка при загрузке каталога:', error));

