<template>
  <div class="fixed-top d-flex justify-content-between px-4 py-2">
    <h2 class="align-self-center">IMB Products <i class="fas fa-hammer fa-2xs"></i></h2>
    <button class="btn btn-primary align-self-center" @click="showModal(true)">Add Product</button>
  </div>
  <div class="px-4 pt-2">
    <ProductTable :products="products" @edit="(product) => showModal(true, product)" @remove="onRemove"></ProductTable>
  </div>
  <ProductFormModal v-show="showingModal" @close-modal="showModal(false)" :submitForm="this.submitForm" :product="selectedProduct"></ProductFormModal>
</template>

<script>
import ProductTable from './components/ProductTable.vue';
import ProductFormModal from './components/ProductFormModal.vue';

export default {
  name: 'App',
  components: {
    ProductTable,
    ProductFormModal,
  },
  data() {
    return {
      products: [],
      showingModal: false,
      selectedProduct: null,
    }
  },
  methods: {
    // GET all products
    async getProducts() {
      const res = await fetch('api/products');
      const data = await res.json();

      if (!res.ok) {
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }

      return data;
    },

    // GET product by scrum master name
    async getProductByScrumMaster(name) {
      const res = await fetch(`api/products?scrumMaster=${name}`);
      const data = await res.json();

      if (!res.ok) {
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }

      return data;
    },

    // GET product by developer name
    async getProductByDeveloper(name) {
      const res = await fetch(`api/products?developer=${name}`);
      const data = await res.json();

      if (!res.ok) {
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }

      return data;
    },

    // POST a new product
    async addProduct(product) {
      const res = await fetch('api/products', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();

      if (!res.ok) {
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }

      this.products.push(data); // Add newly added product to the fetched product list
    },

    // EDIT an existing product
    async editProduct(productId, changes) {
      const res = await fetch(`api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(changes),
      });

      if (!res.ok) {
        const data = res.json();
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }

      let product = this.products.find((product) => product.id === productId);
      Object.assign(product, changes);
    },

    // REMOVE an existing product
    async removeProduct(productId) {
      const res = await fetch(`api/products/${productId}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = res.json();
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }

      this.products = this.products.filter((product) => product.id !== productId);
    },

    showModal(value, product=null) {
      this.selectedProduct = product;
      this.showingModal = value;
    },

    async submitForm(oldProduct, newProduct) {
      if (oldProduct) {
        // This is an edit. Use "old" to get Product #
        const id = oldProduct.id;
        await this.editProduct(id, newProduct);
      } else {
        // This is a new product
        await this.addProduct(newProduct);
      }
    },

    async onRemove(product) {
      let confirmed = await confirm('Are you sure you want to remove this product?');
      if (confirmed) {
        await this.removeProduct(product.id);
      }
    }
  },
  async created() {
    this.products = await this.getProducts();
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.fixed-top {
  background-color: lightsteelblue;
  z-index: 1 !important;
}
</style>
