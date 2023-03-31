<template>
    <form @submit="onSubmit">
        <div class="row">
            <div class="form-group col-md-6 col-sm-12">
                <input type="text" class="form-control" id="searchBar" v-model="searchKey"
                    :placeholder="searchMode == 0 ? 'Search Scrum Master' : 'Search Developer'">
            </div>
            <div class="col-md-2 col-sm-12 d-flex justify-content-center">
                <div v-if="isLoading" class="spinner-border text-primary" role="status"></div>
                <button v-else type="submit" class="btn btn-primary w-100" id="searchButton">Search</button>
            </div>
        </div>
        <div class="form-check form-check-inline">
            <input type="radio" class="form-check-input" name="searchMode" id="searchMode0" value=0 v-model="searchMode">
            <label for="searchMode0" class="form-check-label">By scrum master</label>
        </div>
        <div class="form-check form-check-inline">
            <input type="radio" class="form-check-input" name="searchMode" id="searchMode1" value=1 v-model="searchMode">
            <label for="searchMode1" class="form-check-label">By developer</label>
        </div>
    </form>
</template>

<script>
export default {
    name: 'SearchComponent',
    props: {
        search: Function,
    },
    data() {
        return {
            searchKey: '',
            searchMode: 0,
            isLoading: false,
        };
    },
    methods: {
        async onSubmit(e) {
            e.preventDefault();

            this.isLoading = true;

            await this.search(this.searchKey, this.searchMode);
            this.isLoading = false;
        }
    },
}
</script>

<style scoped>
form {
    margin-bottom: 16px;
}
</style>