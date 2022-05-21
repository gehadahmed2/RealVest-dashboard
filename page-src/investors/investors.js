import axios from 'axios'
export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: "", value: 'image' },
            { text: 'Investors ID', value: 'id' },
            { text: 'Customer name', value: 'name' },
            { text: 'Income range', value: 'income_range' },
            { text: 'Requests', value: 'requests' },
            { text: 'Investments', value: 'investments' },
            { text: 'Listings', value: 'listings' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        investors: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            name: '',
            income_range: 0,
            requests: 0,
            investments: 0,
            listings: 0,
        },
        defaultItem: {
            id: 0,
            name: '',
            income_range: 0,
            requests: 0,
            investments: 0,
            listings: 0,
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.getInvestors()
    },

    methods: {
        getInvestors() {
            try {
                console.log(this.$v)
                axios.get('http://34.125.158.199/admin/investors', {
                    headers:{
                        Authorization : `Bearer ${localStorage.user_token}`
                    }

                }).then((response) => {
                    this.investors = response.data.data
                    console.log(response,"investorsss")

                })

            } catch (e) {

            }
        },

        editItem(item) {
            this.editedIndex = this.investors.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.investors.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.investors.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.investors[this.editedIndex], this.editedItem)
            } else {
                this.investors.push(this.editedItem)
            }
            this.close()
        },
    },
}