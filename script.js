fetch("products.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => initialize(json))
  .catch((err) => console.error(`Fetch problem: ${err.message}`));

function initialize(products) {
  const category = document.querySelector("#category");
  const searchTerm = document.querySelector("#searchTerm");
  const main = document.querySelector("main");

  let lastCategory = category.value;
  let lastSearch = "";

  let categoryGroup;
  let finalGroup;

  finalGroup = products;
  updateDisplay();

  categoryGroup = [];
  finalGroup = [];

  document.addEventListener("change", selectCategory);

  function selectCategory(e) {
    e.preventDefault();
    categoryGroup = [];
    finalGroup = [];

    if (
      category.value === lastCategory &&
      searchTerm.value.trim() === lastSearch
    ) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      if (category.value === "Semua Kategori") {
        categoryGroup = products;
        selectProducts();
      } else {
        const lowerCaseType = category.value.toLowerCase();
        categoryGroup = products.filter(
          (product) => product.type === lowerCaseType
        );
        selectProducts();
      }
    }
  }

  function selectProducts() {
    if (searchTerm.value.trim() === "") {
      finalGroup = categoryGroup;
    } else {
      const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();

      finalGroup = categoryGroup.filter((product) =>
        product.name.includes(lowerCaseSearchTerm)
      );
    }

    updateDisplay();
  }

  function updateDisplay() {
    // remove the previous contents of the <main> element
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    // if no products match the search term, display a "No results to display" message
    if (finalGroup.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No results to display!";
      main.appendChild(para);
      // for each product we want to display, pass its product object to fetchBlob()
    } else {
      for (const product of finalGroup) {
        fetchBlob(product);
      }
    }
  }

  function fetchBlob(product) {
    const url = `images/${product.image}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => showProduct(blob, product))
      .then((err) => console.error(`Fetch problem: ${err.message}`));
  }

  function showProduct(blob, product) {
    const objectURL = URL.createObjectURL(blob);
    const section = document.createElement("section");
    const heading = document.createElement("h2");
    const para = document.createElement("p");
    const image = document.createElement("img");

    section.setAttribute("class", product.type);
    heading.textContent = product.name.replace(
      product.name.charAt(0),
      product.name.charAt(0).toUpperCase()
    );
    para.textContent = `Rp.${product.price.toFixed(2)}`;
    image.src = objectURL;
    image.alt = product.name;

    main.appendChild(section);
    section.appendChild(image);
    section.appendChild(heading);
    section.appendChild(para);
  }
}
