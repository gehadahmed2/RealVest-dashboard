import axios from 'axios'
export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: "", value: 'photos' },
            { text: 'Investors ID', value: 'investor_id' },
            { text: 'Property name', value: 'property_name' },
            { text: 'Location', value: 'location' },
            { text: 'Listed on', value: 'listed_on' },
            { text: 'Investments', value: 'investment_at', sortable: false },
            { text: 'Status', value: 'status', sortable: false },
            { text: 'Actions', value: 'actions', sortable: false },

        ],
        listing: [],
        searchData: '',
        editedIndex: -1,
        editedItem: {
            investor_id: '',
            property_name: '',
            location: '',
            listed_on: '',
            investment_at: 0,
            status: '',
        },
        defaultItem: {
            investor_id: '',
            property_name: '',
            location: '',
            listed_on: '',
            investment_at: 0,
            status: '',
        },
        pagination: {
            current: 1,
            total: 0
          },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
        // findListing() {
        //     return this.listing.filter(x => {
        //         return x.property_name.toLowerCase().includes(this.searchData.toLowerCase())
        //     })
        // }
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    mounted() {
        if (!localStorage.getItem('user_token')) {
            this.$router.push('/')
        }
    },
    created() {
        // this.initialize()
        this.getListing()

    },


    methods: {
        onPageChange() {
            this.getListing();
          },
        getListing() {
            try {
                console.log(this.$v)
                axios.get('https://web.marsworkers.com/admin/listings?', {
                    params:{
                      'page': this.pagination.current,
                      'filter': this.searchData 
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.user_token}`
                    }

                }).then((response) => {
                    this.listing = response.data.data
                    console.log(response, "listing")
                    this.pagination.current = response.data.current_page;
                    this.pagination.total = response.data.last_page;

                })

            } catch (e) {

            }
        },

        goToList() {
            this.$router.push('/createList')
        },
        getColor(status) {
            if (status == 'ACTIVE') return 'green'
            else if (status == 'DRAFT') return 'orange'
            else if (status == 'SOLD') return 'blue'
            else if (status == 'EXPIRED') return 'Grey'
        },
        editItem(item) {
            this.editedIndex = this.listing.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.listing.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm() {
            const id = this.listing.splice(this.editedIndex, 1)
            console.log(id[0].id, "deleteddiddd")
            try {
                await axios.get(`https://web.marsworkers.com/admin/listings/${id[0].id}/delete`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.user_token}`
                    }

                }).then((response) => {
                    // this.investors = response.data.data
                    console.log(response, "delet")

                })
            } catch (e) {
                console.log(e)
            }
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
                Object.assign(this.listing[this.editedIndex], this.editedItem)
            } else {
                this.listing.push(this.editedItem)
            }
            this.close()
        },
    },
}