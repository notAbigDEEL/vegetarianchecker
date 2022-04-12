// Add an event listener to the button, and call getFetch() when clicked
document.getElementById("button").addEventListener("click", getFetch);

function getFetch() {
  // Get value of barcode input
  let inputVal = document.getElementById("barcode").value;

  // If the barcode is not 12 characters long, alert the user
  if (inputVal.length !== 12) {
    alert(`Please ensure that barcode length is 12 characters.`);
    return;
  }
  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`;

  // Make a fetch request to the url
  fetch(url)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      // If the product is found create a new productinfo object and display it.
      if (data.status === 1) {
        const item = new ProductInfo(data.product);
        item.showInfo();
        item.listIngredients();

        // If the product is not found, alert the user
      } else if (data.status === 0) {
        alert(`Product ${inputVal} not found. Please try another.`);
      }
    })
    // Catch any errors and console log them.
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

// ProductInfo class
class ProductInfo {
  constructor(productData) {
    this.brand = productData.brands;
    this.name = productData.product_name;
    this.ingredients = productData.ingredients;
    this.image = productData.image_url;
  }

  // Show the product info on the page
  showInfo() {
    document.getElementById("product-img").src = this.image;
    document.getElementById("product-name").innerHTML = `${this.name}`;
  }
  // List the ingredients on the page
  listIngredients() {
    let tableRef = document.getElementById("ingredient-table");
    for (var i = 1; i < tableRef.rows.length; ) {
      tableRef.deleteRow(i);
    }
    if (!(this.ingredients === null)) {
      for (var key in this.ingredients) {
        let newRow = tableRef.insertRow(-1);
        let newICell = newRow.insertCell(0);
        let newVCell = newRow.insertCell(1);
        let newIText = document.createTextNode(this.ingredients[key].text);
        let vegStatus =
          this.ingredients[key].vegetarian === null
            ? "unknown"
            : this.ingredients[key].vegetarian;
        let newVText = document.createTextNode(vegStatus);
        newICell.appendChild(newIText);
        newVCell.appendChild(newVText);
        if (vegStatus === "no") {
          newVCell.classList.add("non-veg-item");
        } else if (vegStatus === "unknown" || vegStatus === "maybe") {
          newVCell.classList.add("unknown-item");
        }
      }
    }
  }
}
