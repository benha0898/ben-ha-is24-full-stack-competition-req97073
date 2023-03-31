<template>
    <h4>Total products: {{ products.length }}</h4>
    <table v-if="products.length > 0" class="table table-striped table-bordered">
        <thead>
            <tr>
                <th sope="col">Product #</th>
                <th sope="col">Product Name</th>
                <th sope="col">Product Owner</th>
                <th sope="col">Developers</th>
                <th sope="col">Scrum Master</th>
                <th sope="col">Start Date</th>
                <th sope="col">Methodology</th>
                <th sope="col"></th>
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
</style>