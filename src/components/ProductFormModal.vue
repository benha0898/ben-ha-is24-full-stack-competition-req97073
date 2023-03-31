<template>
    <div class="modal-overlay" @click="$emit('close-modal')">
        <div class="modal-content" @click.stop="">
            <h3>{{ product ? 'Edit' : 'Add' }} Product</h3>
            <form action="" @submit="onSubmit">
                <div class="form-group required">
                    <label for="productName">Product Name</label>
                    <input type="text" class="form-control" id="productName" v-model="productName" placeholder="Product Name" required>
                </div>
                <div class="form-group required">
                    <label for="productOwner">Product Owner</label>
                    <input type="text" class="form-control" id="productOwner" v-model="productOwner" placeholder="Product Owner" required>
                </div>
                <div class="form-group required">
                    <label for="scrumMaster">Scrum Master</label>
                    <input type="text" class="form-control" id="scrumMaster" v-model="scrumMaster" placeholder="Scrum Master" required>
                </div>
                <div class="form-group required">
                    <label for="developers">Developers</label>
                    <input type="text" class="form-control" id="developers" v-model="developers" placeholder="Developers" required>
                    <small class="form-text text-muted">Separate developer names by comma</small>
                </div>
                <div class="form-group required">
                    <label for="startDate">Start Date</label>
                    <input type="text" class="form-control" id="startDate" v-model="startDate" placeholder="Start Date" required>
                </div>
                <div class="form-group required">
                    <label for="methodology">Methodology</label>
                    <input type="text" class="form-control" id="methodology" v-model="methodology" placeholder="Methodology" required>
                </div>
                <div class="row">
                    <div v-if="isLoading" class="spinner-border mx-auto" role="status">
                    </div>
                    <button v-else type="submit" class="btn btn-primary btn-lg w-50 mx-auto" id="modalButton">{{ product ? 'Save' : 'Submit'}}</button>
                </div>
                
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductFormModal',
    props: {
        product: Object,
        submitForm: Function,
    },
    watch: {
        // eslint-disable-next-line no-unused-vars
        product: function(newVal, oldVal) {
            this.productName = newVal ? newVal.productName : '';
            this.scrumMaster = newVal ? newVal.scrumMaster : '';
            this.productOwner = newVal ? newVal.productOwner : '';
            this.developers = newVal ? newVal.developers.join(', ') : '';
            this.startDate = newVal ? newVal.startDate : '';
            this.methodology = newVal ? newVal.methodology : '';
        },
      },
    data() {
        return {
            productName: '',
            scrumMaster: '',
            productOwner: '',
            developers: '',
            startDate: '',
            methodology: '',
            isLoading: false,
        };
    },
    methods: {
        async onSubmit(e) {
            e.preventDefault();

            this.isLoading = true;

            const newProduct = {
                productName: this.productName,
                productOwner: this.productOwner,
                developers: this.developers.split(/\s,+|,\s+|,+/),
                scrumMaster: this.scrumMaster,
                startDate: this.startDate,
                methodology: this.methodology,
            }
            await this.submitForm(this.product, newProduct);

            this.isLoading = false;

            this.$emit('close-modal');
        }
    },
    emits: ['close-modal'],
}
</script>

<style scoped>
.form-group.required label:after {
  content:" *";
  color:red;
}
.form-group {
    padding-bottom: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
  z-index: 2;
}

.modal-content {
  text-align: left;
  background-color: white;
  width: 500px;
  height: fit-content;
  min-height: 10;
  margin-top: 10%;
  padding: 60px 16px;
  border-radius: 20px;
}
.close {
  margin: 10% 0 0 16px;
  cursor: pointer;
}

</style>