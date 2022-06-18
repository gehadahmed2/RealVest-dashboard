import axios from 'axios'
export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: "", value: 'image' },
            { text: 'Listing ID', value: 'listing_id' },
            { text: 'Investors name', value: 'investor_name' },
            { text: 'Income', value: 'income' },
            { text: 'Price', value: 'price' },
            { text: 'Requested on', value: 'request_on' },
            { text: 'Shares', value: 'shares' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        investments: [],
        searchData:'',
        toggle:false,
        editedIndex: -1,
        editedItem: {
            listing_id: 0,
            investor_name: '',
            income: 0,
            price: 0,
            request_on: 0,
            shares: 0,
        },
        defaultItem: {
            listing_id: 0,
            investor_name: '',
            income: 0,
            price: 0,
            request_on: 0,
            shares: 0,
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
        findData(){
            return this.investments.filter(x =>{
                return x.investor_name.toLowerCase().includes(this.searchData.toLowerCase())
            })
        }
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
        this.getInvestment()
    },
    mounted() {
        if (!localStorage.getItem('user_token')) {
            this.$router.push('/')
        }
    },
    methods: {
        toggleTab(item){
            this.toggle = !this.toggle
        },
        onPageChange() {
            this.getInvestment();
          },
        getInvestment() {
            console.log('hereeee')
            try {
                axios.get('https://web.marsworkers.com/admin/investment-requests?page=' + this.pagination.current,{
                    headers: {
                        Authorization: `Bearer ${localStorage.user_token}`
                    }

                }).then((response) => {
                    this.investments= response.data.data
                    console.log(response, "investments")
                    this.pagination.current = response.data.current_page;
                    this.pagination.total = response.data.last_page;

                })

            } catch (e) {

            }
        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.investments.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

       async deleteItemConfirm() {
            const id = this.investments.splice(this.editedIndex, 1)
            console.log(id[0].id, "deleteddiddd")
            try {
                await axios.get(`http://34.125.158.199/admin/investment-requests/${id[0].id}/delete`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.user_token}`
                    }

                }).then((response) => {
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
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
            } else {
                this.desserts.push(this.editedItem)
            }
            this.close()
        },
    },
}