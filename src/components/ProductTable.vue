<template>
    <h4>Total products: {{ products.length }}</h4>
    <table v-if="products.length > 0" class="table table-striped table-bordered">
        <thead>
            <tr>
                <th scope="col">Product #</th>
                <th scope="col">Product Name</th>
                <th scope="col">Product Owner</th>
                <th scope="col">Developers</th>
                <th scope="col">Scrum Master</th>
                <th scope="col">Start Date</th>
                <th scope="col">Methodology</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in products" :key="product.id">
                <td v-for="entry in Object.entries(product)" :key="entry[0]">{{ Array.isArray(entry[1]) ? entry[1].join(', ') : entry[1] }}</td>
                <td>
                    <div class="d-flex">
                        <button class="btn btn-primary" @click="onEdit(product)"><i class="fa-solid fa-pen fa-2xs"></i></button>
                        <button class="btn btn-danger" @click="onRemove(product)"><i class="fa-solid fa-trash fa-2xs"></i></button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: 'ProductTable',
    props: {
        products: Array,
    },
    methods: {
        onEdit(product) {
            this.$emit('edit', product);
        },
        onRemove(product) {
            this.$emit('remove', product);
        },
    },
    emits: ['edit', 'remove'],
};
</script>

<style scoped>
.d-flex {
    gap: 8px;
}

th {
    vertical-align: middle;
}
</style>