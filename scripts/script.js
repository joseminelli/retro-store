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
}

function emptyCart() {
  var cartItems = document.getElementById("cart-items");
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  addItemToCart(title, price);
  updateCartTotal();
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

  //call API and get JSON format
  .then((respuesta) => respuesta.json())
  //print API on app = app.append(...todoLosItems)
  .then((responseJson) => {
    //console.log(responseJson);
    var todosLosItems = [];
    responseJson.forEach((item) => {
      //console.log(item.price);
      //crear imagen
      const image = document.createElement("img");
      image.src = item.image;
      image.className = "card-img-top";

      //cerear tiutlo
      const title = document.createElement("h5");
      title.textContent = item.title.substring(0, 36) + "...";
      title.className = "card-title";
      //crear descripcion
      const description = document.createElement("p");
      description.textContent = item.description.substring(0, 70) + "...";

      //category
      const category = document.createElement("p");
      category.textContent = item.category;

      const divCard = document.createElement("div");
      divCard.append(title, description);
      divCard.className = "card-body";

      //crear precio
      const price = document.createElement("b");
      price.textContent = "R" + formatPrice(item.price);
      price.className = "nav me-auto ms-3 mt-3";

      //create Botones
      const addToCard = document.createElement("button");
      addToCard.textContent = "Add ao carrinho";
      addToCard.className = "btn btn-outline-success flex-row-reverse m-2";
      addToCard.id = "addToCard";
      addToCard.addEventListener("click", function () {
        //console.log(title.textContent);
        //console.log(price.textContent);
        //console.log(category.textContent);
        addItemToCart(
          title.textContent.substring(0, 15) + "...",
          price.textContent
        );
      });

      const actionDiv = document.createElement("div");
      actionDiv.append(price, addToCard);
      actionDiv.className = "d-flex";

      //crer contenendor
      const myContainer = document.createElement("div");
      myContainer.append(image, divCard, actionDiv);
      myContainer.className;
      ("card h-100");

      const bigContainer = document.createElement("div");
      bigContainer.append = myContainer;
      bigContainer.className = "col";
      bigContainer.style.backgroundColor = "white";

      todosLosItems.push(myContainer);
    });
    app.append(...todosLosItems);
  });

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
    // for (let i = 0; i < data.length; i++) {
    //     const title = data[i].title;
    //     const price = data[i].price;
    //     const description = data[i].description;
    //     const image = data[i].image;
    //     const category = data[i].category;
    //     console.log(title);
    //     document.getElementById("currencySelected").innerHTML = `
    //         <div class="col">
    //             <div class="card h-100">
    //             <img src="${image}" class="card-img-top" alt="...">
    //                 <div class="card-body">
    //                     <h5 class="card-title" id="itemTitle">${title}</h5>
    //                     <p class="card-text">${description}</p>
    //                 </div>
    //                 <div class=" d-flex">
    //                     <b class="nav me-auto ms-3 mt-3" id="itemPrice">$ ${price}</b>
    //                     <button class="btn btn-outline-success flex-row-reverse m-2" id="addButton">Add to Cart</button>
    //                 </div>
    //             </div>
    //         </div>
    //     `
    // }
  } catch (error) {
    console.log(`este es el error: ${error}`);
  }
};

anotherFunction(APIcurrency);

//In your Javascript code, you can store data by using:
//set_cookie("shopping_cart_items", items);
//Fetch the data by using:
//var data = get_cookie("shopping_cart_items");

//TODO: boton que agregue al carrito
//crear la LISTA del carrito y mostrarla.

//TODO: boton que elimine todos los items del carrito
