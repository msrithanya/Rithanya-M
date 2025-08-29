var pop=0;
function check(view_icon_id){
  switch (view_icon_id) {
    case "view_icon1":
      popup("black-leather-bag")
      break;
    case "view_icon2":
      popup("blue-silk-tuxedo")
      break;
    case "view_icon3":
      popup("chequered-red-shirt")
      break;
    case "view_icon4":
      popup("classic-leather-jacket")
      break;
    case "view_icon5":
      popup("classic-varsity-top")
      break;
    case "view_icon6":
      popup("dark-denim-top")
      break;
  }
}

let currentProduct = null;
let selectedVariantId = null;
function popup(productHandle) {
  fetch(`/products/${productHandle}.js`)
    .then(response => response.json())
    .then(product => {
      currentProduct = product;
      selectedVariantId = product.variants[0].id;
document.getElementById("variant_id").value = selectedVariantId;
      document.getElementById("popupOverlay").style.display = "flex";
      document.getElementById("product_i").src = product.images[0];
      document.getElementById("product_title").innerText = product.title;
      document.getElementById("price").innerText = "$" + (product.variants[0].price / 100).toFixed(2);
      document.getElementById("dis").innerText = product.description.replace(/<\/?[^>]+(>|$)/g, "");

// Fetching Color Variants of the product
      const colors = [...new Set(product.variants.map(v => v.option2))];
      colors.forEach((color, index) => {
        const colorBox = document.getElementById(`color${index + 1}_picket`);
        const colorName = document.getElementById(`color${index + 1}_name`);
        if (colorBox) colorBox.style.backgroundColor = color;
        if (colorName) colorName.innerText = color;
      });

// Fetching sizes Variants  of the product
      const sizes = [...new Set(product.variants.map(v => v.option1))];
      const drop = document.getElementById("drop");
      drop.innerHTML = "";
      sizes.forEach(size => {
        const div = document.createElement("div");
        div.className = "choice";
        div.setAttribute("onclick", "chooseSize(this)");
        div.innerHTML = `<span>${size}</span>`;
        drop.appendChild(div);
      });
    })
    .catch(err => console.error(err));
}

// updating the useer selected variants
function updateSelectedVariant() {
    if (!currentProduct) return;

    const selectedSize = document.getElementById("size").innerText;
    const selectedColor = document.querySelector("#color_container p.color_name")?.innerText;

    const variant = currentProduct.variants.find(v => 
        v.option1 === selectedSize && v.option2 === selectedColor
    );

    if (variant) {
        selectedVariantId = variant.id;
        document.getElementById("variant_id").value = selectedVariantId; // update hidden input
    } else {
        selectedVariantId = null;
        document.getElementById("variant_id").value = "";
        console.error("Variant not found for selected options");
    }
}

function cancel() {
  document.getElementById("popupOverlay").style.display = "none";
  document.querySelectorAll('.button-grid p#card_content').forEach(el => el.innerText = "ADD TO CART");
}

// Color selection
function selectColor(div) {
  const container = document.getElementById("color_container").children;
  for (let d of container) {
    d.style.backgroundColor = "";
    const p = d.querySelector("p");
    if (p) p.style.color = "";
  }
  div.style.backgroundColor = "black";
  div.querySelector("p").style.color = "white";
  selectedOptions.color = div.querySelector("p").innerText;
  updateSelectedVariant();
}
function chooseSize(el) {
  const size = el.querySelector("span").innerText;
  document.getElementById("size").innerText = size;
  selectedOptions.size = size;
  dropdown(); 
    updateSelectedVariant();
}

let dropdown_flag = 0;
function dropdown() {
  const drop = document.getElementById("drop");
  const opened = document.getElementById("dropdown_opened");
  const closed = document.getElementById("dropdown_closeed");
  if(dropdown_flag === 0) {
    drop.style.display = "block";
    opened.style.display = "inline";
    closed.style.display = "none";
    dropdown_flag = 1;
  } else {
    drop.style.display = "none";
    opened.style.display = "none";
    closed.style.display = "inline";
    dropdown_flag = 0;
  }
}
var add_to_cart_flag = 0;

function clicked(event){
    event.preventDefault(); // prevent default form submission

    const variantId = document.getElementById("variant_id").value;

    if(!variantId){
        alert("Please select a variant first.");
        return;
    }

    // Add to cart via fetch
    fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(res => res.json())
    .then(data => {
        // Update button text
        if(add_to_cart_flag === 0){
            document.getElementById("cart_content").innerHTML = "ADDED[Refresh]";
            add_to_cart_flag = 1;
        } else if(add_to_cart_flag=== 1){
            document.getElementById("cart_content").innerHTML = "ADD TO CART";
            add_to_cart_flag= 0;
        }
        console.log("Added to cart:", data);
    })
    .catch(err => console.error("Error adding to cart:", err));
}
