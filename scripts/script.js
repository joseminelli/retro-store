if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  var addToCartButtons = document.getElementsByClassName("shop-item-button"); //"addToCartButtons" são os botões de Ver produto
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
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
      price.textContent = "R" + item.price;
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