import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct,
    updateProductStatus,
  } from "../api";
  
  import {
    CreateProductFormValues,
    UpdateProductFormValues,
    UpdateProductStatusValues,
  } from "../schemas";
  
  export const productService = {
    list() {
      return getProducts();
    },
  
    get(id: string) {
      return getProduct(id);
    },
  
    create(
      payload: CreateProductFormValues,
    ) {
      return createProduct(payload);
    },
  
    update(
      id: string,
      payload: UpdateProductFormValues,
    ) {
      return updateProduct(
        id,
        payload,
      );
    },

    delete(id: string) {
        return deleteProduct(id);
      },
    
    updateStatus(
        id: string,
        payload: UpdateProductStatusValues,
      ) {
        return updateProductStatus(
          id,
          payload,
        );
      },
  };