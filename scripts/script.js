if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  var removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  document.getElementById("emptyCart").addEventListener("click", emptyCart);

  loadCartFromLocalStorage(); // Carregar itens do Local Storage
}

function emptyCart() {
  var cartItems = document.getElementById("cart-items");
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
  saveCartToLocalStorage(); // Limpar itens no Local Storage
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
  saveCartToLocalStorage(); // Atualizar itens no Local Storage
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
  saveCartToLocalStorage(); // Atualizar itens no Local Storage
}

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  addItemToCart(title, price);
  updateCartTotal();
  saveCartToLocalStorage(); // Adicionar itens ao Local Storage
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    formatPrice(total);
}

function addItemToCart(title, price) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");

  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames.innerText == title) {
      alert("This item is already added to the cart");
    }
  }

  var cartRowContents = `
    <span class="cart-item-title">${title}</span>
    <div class="cart-item cart-column">
    </div>
    <div class="cart-column">
      <input class="cart-quantity-input" type="number" value="1">
      <b class="cart-price">${price}</b> <br>
    </div>
    <div class="cart-quantity cart-column">
      <button class="btn btn-danger" type="button">X</button>
    </div>
  `;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
}

// Função para salvar os itens no Local Storage
function saveCartToLocalStorage() {
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItems.getElementsByClassName("cart-row");
  var cart = [];

  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var title = cartRow.getElementsByClassName("cart-item-title")[0].innerText;
    var price = cartRow.getElementsByClassName("cart-price")[0].innerText;

    cart.push({
      title: title,
      price: price
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// Função para carregar os itens do Local Storage
function loadCartFromLocalStorage() {
  var cart = localStorage.getItem("cart");

  if (cart) {
    var cartItems = JSON.parse(cart);

    for (var i = 0; i < cartItems.length; i++) {
      var item = cartItems[i];
      addItemToCart(item.title, item.price);
    }

    updateCartTotal();
  }
}

const fetchData = (url_api) => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url_api, true);
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        request.status === 200
          ? resolve(JSON.parse(request.responseText))
          : reject(new Error("Error " + url_api));
      }
    };
    request.send();
  });
};

const API = "https://fakestoreapi.com/products/";
fetch("scripts/itens.json")
  .then((response) => response.json())
  .then((responseJson) => {
    var todosOsItens = [];
    responseJson.forEach((item) => {
      const image = document.createElement("img");
      image.src = item.image;
      image.className = "card-img-top";

      const title = document.createElement("h5");
      title.textContent = item.title.substring(0, 36) + "...";
      title.className = "card-title";

      const description = document.createElement("p");
      description.textContent = item.description.substring(0, 70) + "...";

      const category = document.createElement("p");
      category.textContent = item.category;

      const divCard = document.createElement("div");
      divCard.append(title, description);
      divCard.className = "card-body";

      const price = document.createElement("b");
      price.textContent = "R" + formatPrice(item.price);
      price.className = "nav me-auto ms-3 mt-3";

      const addToCard = document.createElement("button");
      addToCard.textContent = "Ver Produto";
      addToCard.className = "btn btn-outline-success flex-row-reverse m-2";
      addToCard.id = "addToCard";
      addToCard.onclick = function () {
        redirectToProductPage(item.id);
        /*
        addItemToCart(
          title.textContent.substring(0, 15) + "...",
          price.textContent
        );*/
      };
      addToCard.ontouchstart = function () {
        redirectToProductPage(item.id);
        /*
        addItemToCart(
          title.textContent.substring(0, 15) + "...",
          price.textContent
        );*/
      };

      const actionDiv = document.createElement("div");
      actionDiv.append(price, addToCard);
      actionDiv.className = "d-flex";

      const myContainer = document.createElement("div");
      myContainer.append(image, divCard, actionDiv);
      myContainer.className = "card h-100";

      const bigContainer = document.createElement("div");
      bigContainer.append(myContainer);
      bigContainer.className = "col";
      bigContainer.style.backgroundColor = "white";

      todosOsItens.push(myContainer);
    });
    app = app.append(...todosOsItens);
  });


  
function redirectToProductPage(itemId) {
  // Redirecionar para a página do produto com base no ID
  window.location.href = "detalhes.html?itemId=" + itemId;
}


var viewCart = document.getElementById("viewCart");
viewCart.addEventListener("click", updateCartTotal);

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    formatPrice(total);
}

function addItemToCart(title, price) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");

  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames.innerText == title) {
      alert("This item is already added to the cart");
    }
  }

  var cartRowContents = `
            
        <span class="cart-item-title">${title}</span>
            <div class="cart-item cart-column">
            </div>
            <div class="cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <b class="cart-price">${price}</b> <br>
            </div>
            <div class="cart-quantity cart-column">
                <button class="btn btn-danger" type="button">X</button>
            </div>
            `;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
}

const APIcurrency =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/";

window
  .fetch(APIcurrency)
  .then((response) => response.json())
  .then((responseCurrency) => {
    console.log(responseCurrency);
  });

//Intl format for price
const formatPrice = (price) => {
  const newPrice = new window.Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
  }).format(price);

  return newPrice;
};

const anotherFunction = async (url_api) => {
  try {
    const data = await fetchData(url_api);
    console.log(data[0]);
  } catch (error) {
    console.log(`este es el error: ${error}`);
  }
};

anotherFunction(APIcurrency);

