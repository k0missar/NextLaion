//Формируем список товаров
const productListPage = document.querySelectorAll(".isProduct");

function createProductList() {
  let productList = {};
  productListPage.forEach((item) => {
    const productItem =
      item.querySelector(".product__title").dataset.productName;
    const productName = item.querySelector(".product__title").innerText;
    const productPrice = Number(
      item
        .querySelector(".product__price")
        .innerText.match(/[0-9\s]{1,}/)[0]
        .replace(/\s/g, "")
    );
    const productDescription = item.querySelector(
      ".product__description"
    ).innerText;
    const productImage = item.querySelector(
      ".product__slider-image"
    ).currentSrc;

    //Итоговое формирование списка товаров
    productList[productItem] = {
      quantity: 0,
      name: productName.toLowerCase(),
      price: productPrice,
      description: productDescription,
      imageSrc: productImage,
    };
  });
  return productList;
}

//localStorage
function storageAvailable(type) {
  //Функция проверки доступности localStorage
  try {
    var storage = window[type],
      x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

if (storageAvailable("localStorage")) {
  if (!localStorage.getItem("product")) {
    const product = createProductList();
    localStorage.setItem("product", JSON.stringify(product));
    //Проверка элемента если localStorage ранее был создан
    //Проверка актуальности цены, описание, изображения в ранее созданном localStorage
  } else {
    const product = createProductList();
    let productLocalStorage = JSON.parse(localStorage.getItem("product"));
    for (key in product) {
      if (productLocalStorage[key]) {
        productLocalStorage[key].name = product[key].name;
        productLocalStorage[key].price = product[key].price;
        productLocalStorage[key].description = product[key].description;
        productLocalStorage[key].imageSrc = product[key].imageSrc;
      } else {
        productLocalStorage[key] = product[key];
      }
    }
    localStorage.setItem("product", JSON.stringify(productLocalStorage));
  }
} else {
  console.log("localStorage не доступен");
}

//Функция получения/отправки данных продукта в localStorage
function localStorageGetSet(method, lsdb, db) {
  if (method == "get") return JSON.parse(localStorage.getItem(lsdb));
  if (method == "set") localStorage.setItem(lsdb, JSON.stringify(db));
}

//Меню
const mainMenu = document.querySelector(".main-menu");
if (mainMenu) {
  mainMenu.classList.add("main-menu--close");
}

const mainMenuButton = document.querySelector(".header__button-menu");
if (mainMenuButton) {
  mainMenuButton.addEventListener("click", () => {
    mainMenu.classList.toggle("main-menu--close");
  });
}

//Открытие закрытие корзины
function cartOpenClose() {
  const cart = document.querySelector(".cart");
  const openCart = document.querySelectorAll(".isCart");
  const closeCart = document.querySelector(".cart__close");
  openCart.forEach((item) => {
    item.addEventListener("click", () => {
      cart.style.display = "flex";
      CartProductItem.cartCreate("product");
      //document.querySelector(".cart__list").innerHTML = "";
    });
  });
  closeCart.addEventListener("click", () => {
    cart.style.display = "none";
  });
}

cartOpenClose();
//Карусель
const caruselItem = document.querySelectorAll(".carusel__item");
function carusel(count = 0) {
  caruselItem[count].classList.remove("carusel__item--close");
  if (count - 1 < 0) {
    caruselItem[caruselItem.length - 1].classList.add("carusel__item--close");
  } else {
    caruselItem[count - 1].classList.add("carusel__item--close");
  }

  if (count < caruselItem.length - 1) setTimeout(carusel, 5000, count + 1);
  if (!(count < caruselItem.length - 1)) setTimeout(carusel, 5000, 0);
}

//ЗАПУСКАЕМ КАРУСЕЛЬ
if (caruselItem) {
  carusel();
}

//Слайдер товаров
const productSliderList = document.querySelectorAll(".product__slider-list");

for (let i = 0; i < productSliderList.length; i++) {
  const arr = Array.from(productSliderList[i].children);
  for (j = 1; j < arr.length; j++) {
    arr[j].addEventListener("click", (e) => {
      arr[0].childNodes[1].src = e.target.currentSrc;
    });
  }
}

//Увеличение количества товаров
const productIncrementButton = document.querySelectorAll(
  ".product__add-increment"
);
const productDecrimentButton = document.querySelectorAll(
  ".product__add-decriment"
);
const productQuantityInput = document.querySelectorAll(
  ".product__add-quantity"
);

function addQuntityCart() {
  productIncrementButton.forEach((item, index) => {
    item.addEventListener("click", () => {
      productQuantityInput[index].value++;
    });
  });
}

function removeQuntityCart() {
  productDecrimentButton.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (productQuantityInput[index].value > 0)
        productQuantityInput[index].value--;
    });
  });
}

addQuntityCart();
removeQuntityCart();

function cartProductQuantityView() {
  const count = CartProductItem.cartTotalItem();
  const cartProductQuantityView = document.querySelector(
    ".header__cart-quantity"
  );
  if (count) {
    cartProductQuantityView.style.display = "flex";
    cartProductQuantityView.textContent = count;
  } else {
    cartProductQuantityView.style.display = "none";
  }
}

//Добавить товар в localStorage
let productLists = JSON.parse(localStorage.getItem("product"));
const addToCartButton = document.querySelectorAll(".product__add-to-cart");

addToCartButton.forEach((item, index) => {
  item.addEventListener("click", () => {
    const productName =
      item.parentElement.parentElement.querySelector(".product__title").dataset
        .productName;
    window[productName].cartAddProduct(
      Number(productQuantityInput[index].value)
    );

    cartProductQuantityView();
    productItemCreate();
  });
});

//Формирование корзины товаров
class CartProductItem {
  constructor(options) {
    this.id = options.id;
    this.name = options.name;
    this.quantity = options.quantity;
    this.price = options.price;
    this.description = options.description;
    this.imageSrc = options.imageSrc;
  }

  static totalCost = 0;

  static cartCreate = function (localStorageObjectName = "product") {
    const cartList = document.querySelector(".cart__list");
    cartList.innerHTML = ""; // Очищаем корзину
    this.totalCost = 0; // Обнуляем итоговую сумму
    const localStorageObject = JSON.parse(
      localStorage.getItem(localStorageObjectName)
    );
    const localStorageObjectKeys = Object.keys(localStorageObject);
    localStorageObjectKeys.forEach((item) => {
      const productItem = window[item];
      if (productItem.quantity > 0) {
        this.totalCost += productItem.quantity * productItem.price; // Пересчет стоимости корзины
        const cartListItem = document.createElement("tr");
        cartListItem.className = "cart__item";
        cartListItem.innerHTML += `
          <td><img src="${productItem.imageSrc}" class="cart__item-image"><td>
          <td><p class="cart__item-text">${productItem.name}</p></td>
          <td><p class="cart__item-text">${productItem.quantity} шт.</p></td>
          <td><p class="cart__item-text">${productItem.price} Р.</p></td>
          <td><p class="cart__item-text">${productItem.totalCostProduct()} Р.</p></td>
          <td class="cart__item-text is${
            productItem.id
          }"><svg width="25" height="25" class="cart__delete"><use xlink:href="#delete"></svg></td>`;
        cartList.append(cartListItem);
        const deleteItem = document.querySelector(`.is${productItem.id}`);
        deleteItem.addEventListener("click", () => {
          productItem.cartDeleteProduct();
        });
      }
    });
    const totalCost = document.querySelector(".cart__total-cost span");
    totalCost.textContent = `${this.totalCost} Р.`;
    this.cartForm();
  };

  static cartTotalItem = function (localStorageObjectName = "product") {
    let count = 0;
    const localStorageObject = JSON.parse(
      localStorage.getItem(localStorageObjectName)
    );
    for (key in localStorageObject) {
      count += window[key].quantity;
    }
    return count;
  };

  static cartForm = function () {
    const cartForm = document.querySelector(".cart__form");
    cartForm.classList.add("cart__form--close");
    const cartOpenFormButton = document.querySelector(
      ".cart__open-form-button"
    );
    cartOpenFormButton.addEventListener("click", () => {
      cartForm.classList.remove("cart__form--close");
    });
  };

  static cartSendForm = function (localStorageObjectName = "product") {
    const localStorageObject = JSON.parse(
      localStorage.getItem(localStorageObjectName)
    );
    const sendButton = document.querySelector(".cart__form-button");
    const token = "6118634566:AAH9xXsQK2vhoRFvMnoGsthXlSvFwnnd5v4";
    const chat = -1001949835917;
    let api = new XMLHttpRequest();

    let message = "Заказано: ";
    for (key in localStorageObject) {
      if (window[key].quantity)
        message += `${window[key].name} в количестве ${window[key].quantity} шт. `;
    }
    message += `Заказчиком ${
      document.querySelector("#name").value
    }, номер телефона - ${document.querySelector("#phone").value}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&text=${message}`;
    api.open("GET", url, true);
    api.send();
  };

  modifyProducInLocalStorage = function (localStorageObjectName = "product") {
    // localStorageObjectName - название объекта с базой продуктов в localStorage
    let localStorageObject = JSON.parse(
      localStorage.getItem(localStorageObjectName)
    );
    localStorageObject[this.id] = {
      quantity: this.quantity,
      name: this.name,
      price: this.price,
      description: this.description,
      imageSrc: this.imageSrc,
    };
    localStorage.setItem(
      localStorageObjectName,
      JSON.stringify(localStorageObject)
    );
  };

  cartIncrementProduct = function () {
    this.quantity++;
  };

  cartDecrementProduct = function () {
    if (this.quantity > 0) this.quantity--;
  };

  cartDeleteProduct = function () {
    this.quantity = 0;
    this.modifyProducInLocalStorage();
    this.__proto__.constructor.cartCreate();
    cartProductQuantityView(); //КОСТЫЛЬ КОТОРЫЙ НУЖНО ПЕРЕНЕСТИ КАК МЕТОД КЛАССА
  };

  cartAddProduct = function (quantity) {
    this.quantity += quantity;
    this.modifyProducInLocalStorage();
    if (this.quantity > 0) this.__proto__.constructor.cartCreate();
  };

  totalCostProduct = function () {
    return this.quantity * this.price;
  };
}

function productItemCreate() {
  const cartProductList = localStorageGetSet("get", "product");
  for (key in cartProductList) {
    window[key] = new CartProductItem({
      id: key,
      name: cartProductList[key].name,
      quantity: cartProductList[key].quantity,
      price: cartProductList[key].price,
      description: cartProductList[key].description,
      imageSrc: cartProductList[key].imageSrc,
    });
  }
}

productItemCreate();

cartProductQuantityView();
