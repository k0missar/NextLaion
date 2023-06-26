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
  if (method == "set") return localStorage.setItem(lsdb, JSON.stringify(db));
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

//Общее количество заказанных товаров
function cartProductQuantity() {
  let count = 0;
  const productList = localStorageGetSet("get", "product");
  for (key in productList) {
    count += productList[key].quantity;
  }
  return count;
}

function cartProductQuantityView() {
  const count = cartProductQuantity();
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

cartProductQuantityView();

//Добавить товар в localStorage
let productLists = JSON.parse(localStorage.getItem("product"));
const addToCartButton = document.querySelectorAll(".product__add-to-cart");

addToCartButton.forEach((item, index) => {
  item.addEventListener("click", () => {
    const productName =
      item.parentElement.parentElement.querySelector(".product__title").dataset
        .productName;
    productLists[productName].quantity += Number(
      productQuantityInput[index].value
    );
    localStorage.setItem("product", JSON.stringify(productLists));
    productLists = JSON.parse(localStorage.getItem("product"));
    cartProductQuantityView();
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
}

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

function cartFilling() {
  const productList = Object.keys(localStorageGetSet("get", "product"));
  const ul = document.querySelector(".cart__list");
  productList.forEach((item) => {
    console.dir(item);
    console.log(item.quantity);
  });
}

cartFilling();
