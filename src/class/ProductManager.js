class ProductManager {
  constructor() {
    this.products = [];
  }

  // methods

  // add products
  addProduct = (title, description, price, thumbnail, code, stock) => {
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    // verifica si todos los campos estan completos

    for (const key in newProduct) {
      if (newProduct[key] == undefined) {
        console.log("Debe contar con todas las propiedades del objeto");
        return;
      }
    }

    // verifica si el codigo existe
    const exist = this.products.some((value) => value.code == code);
    if (exist) {
      console.log("El codigo de producto ya existe");
      return;
    }

    //pushea si todo ok
    this.products.push({ id: this.products.length + 1, ...newProduct });
  };

  // get products
  getProducts = () => console.log(this.products);

  //get product by id
  getProductById = (id) => {
    const product = this.products.find((value) => value.id == id);

    if (product) {
      console.log(product);
      return;
    }

    console.log("Not found");
  };
}

// ejecucion de clase
const productos = new ProductManager();

productos.getProducts();
productos.addProduct(
  "producto1",
  "producto descripcion 1",
  "price 1",
  "thumbnail 1",
  "code 1",
  "stock 1"
);
productos.getProducts();
productos.addProduct(
  "producto2",
  "producto descripcion 2",
  "price 2",
  "thumbnail 2",
  "code 2",
  "stock 2"
);
productos.getProducts();
productos.addProduct(
  "producto3",
  "producto descripcion 3",
  "price 3",
  "thumbnail 3",
  "code 3",
  "stock 3"
);
productos.getProducts();


// por id
productos.getProductById(5);
