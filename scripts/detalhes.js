// Função para fazer a leitura do arquivo JSON
function readJSON(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

// Função para exibir o item no DOM
function displayItem(item) {
  var container = document.getElementById("item-container");

  // Cria o botão para voltar para o index.html
  var backButton = document.createElement("button");
  backButton.setAttribute("id", "voltar");
  backButton.addEventListener("click", function() {
    window.location.href = "index.html";
  });

  backButton.ontouchstart = function () {
    window.location.href = "index.html";
  };

  var btn = document.createElement("button");
  btn.classList.add("btn");
  btn.textContent = "Adicionar ao carrinho";

  btn.addEventListener("click", function() {
    alert("Este item não está em estoque no momento :(");
  });

  // Cria a imagem de seta para o botão
  var arrowImage = document.createElement("img");
  arrowImage.src = "https://cdn.discordapp.com/attachments/1109149984357613638/1111653810511822868/arrow.png";
  backButton.appendChild(arrowImage);

  // Cria a logo
  var logoImage = document.createElement("img");
  logoImage.setAttribute("id", "logo");
  logoImage.src = "img/retrostore.png";

  // Cria elementos HTML para exibir as informações do item
  var title = document.createElement("h1");
  title.textContent = item.title;

  var image = document.createElement("img");
  image.src = item.image;
  image.alt = item.title;

  var price = document.createElement("h6");
  price.textContent = "Preço: R$" + item.price;

  var description = document.createElement("p");
  description.textContent = "Descrição: \n" + item.description;

  // Adiciona os elementos criados ao container
  container.appendChild(backButton);
  container.appendChild(logoImage);
  container.appendChild(title);
  container.appendChild(image);
  container.appendChild(price);
  container.appendChild(description);
  container.appendChild(btn);
}


// Obtém o valor do itemId da URL
var url = window.location.href;
var itemIdIndex = url.indexOf("itemId=");
var itemId = null;

if (itemIdIndex !== -1) {
  var itemIdString = url.substring(itemIdIndex + 7);
  itemId = parseInt(itemIdString);
  console.log("teste");
}

readJSON("scripts/itens.json", function (response) {
  var items = JSON.parse(response);
  var item = items.find(function (i) {
    return i.id === itemId;
  });

  if (item) {
    displayItem(item);
  } else {
    console.log("Item not found");
  }
});
