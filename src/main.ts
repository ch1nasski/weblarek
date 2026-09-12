import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Api } from './components/base/Api';
import { ApiService } from './components/services/ApiService';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// ===== Инициализация моделей данных =====
const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===\n');

// ===== Тестирование CatalogModel =====
console.log('--- Тестирование CatalogModel ---');

// Сохранение товаров в каталог
catalogModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога: ', catalogModel.getProducts());

// Получение товара по id
const firstProduct = catalogModel.getProduct(apiProducts.items[0].id);
console.log('Получение товара по id: ', firstProduct);

// Выбор товара для подробного просмотра
catalogModel.setSelectedProduct(firstProduct!);
console.log('Выбранный товар: ', catalogModel.getSelectedProduct());

console.log('');

// ===== Тестирование BasketModel =====
console.log('--- Тестирование BasketModel ---');

// Проверка пустой корзины
console.log('Товары в корзине (пусто): ', basketModel.getItems());
console.log('Количество товаров в корзине: ', basketModel.getCount());
console.log('Общая стоимость товаров: ', basketModel.getTotal());

// Добавление товара в корзину
basketModel.addItem(apiProducts.items[0]);
console.log('Товары в корзине после добавления первого товара: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());
console.log('Общая стоимость: ', basketModel.getTotal());

// Добавление второго товара
basketModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине после добавления второго товара: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());
console.log('Общая стоимость: ', basketModel.getTotal());

// Проверка наличия товара в корзине
console.log('Товар в корзине (id первого товара): ', basketModel.hasItem(apiProducts.items[0].id));
console.log('Товар в корзине (несуществующий id): ', basketModel.hasItem('non-existent-id'));

// Удаление товара из корзины
basketModel.removeItem(apiProducts.items[0]);
console.log('Товары в корзине после удаления первого товара: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());
console.log('Общая стоимость: ', basketModel.getTotal());

// Очистка корзины
basketModel.clear();
console.log('Товары в корзине после очистки: ', basketModel.getItems());
console.log('Количество товаров: ', basketModel.getCount());

console.log('');

// ===== Тестирование BuyerModel =====
console.log('--- Тестирование BuyerModel ---');

// Проверка пустых данных и валидация
console.log('Данные покупателя (пусто): ', buyerModel.getBuyerData());
console.log('Ошибки валидации (пусто): ', buyerModel.validateBuyerData());

// Установка только email
buyerModel.setBuyerData({ email: 'user@example.com' });
console.log('Данные после установки email: ', buyerModel.getBuyerData());
console.log('Ошибки валидации: ', buyerModel.validateBuyerData());

// Установка остальных данных
buyerModel.setBuyerData({
    payment: 'card',
    phone: '+7-999-888-77-66',
    address: 'ул. Примерная, 42'
});
console.log('Данные после установки всех полей: ', buyerModel.getBuyerData());
console.log('Ошибки валидации (должно быть пусто): ', buyerModel.validateBuyerData());

// Очистка данных
buyerModel.clearBuyerData();
console.log('Данные после очистки: ', buyerModel.getBuyerData());
console.log('Ошибки валидации: ', buyerModel.validateBuyerData());

console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');

// ===== Подключение к серверу =====
console.log('\n=== ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА ===\n');

// Инициализация Api и ApiService
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Получение товаров с сервера
apiService.getProducts()
    .then(response => {
        console.log('Ответ с сервера (raw):', response);
        
        // Сохранение товаров в каталог
        catalogModel.setProducts(response.items);
        
        // Вывод товаров в консоль
        console.log('Товары, сохраненные в каталоге:');
        console.log('Количество товаров:', catalogModel.getProducts().length);
        console.log('Все товары:', catalogModel.getProducts());
        
        console.log('\n=== ТОВАРЫ УСПЕШНО ЗАГРУЖЕНЫ ===');
    })
    .catch(error => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });
