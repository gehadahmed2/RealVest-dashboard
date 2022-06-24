import axios from 'axios'
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [{
      text: "",
      value: 'image'
    },
    {
      text: 'Investors ID',
      value: 'id'
    },
    {
      text: 'Customer name',
      value: 'name'
    },
    {
      text: 'Income range',
      value: 'income_range'
    },
    {
      text: 'Requests',
      value: 'requests'
    },
    {
      text: 'Investments',
      value: 'investments'
    },
    {
      text: 'Listings',
      value: 'listings'
    },
    {
      text: 'Actions',
      value: 'actions',
      sortable: false
    },
    ],
    searchData: '',
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
    ourRespose: null,
    pagination: {
      current: 1,
      total: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    // findData() {
    //   return this.investors.filter(x => {
    //     return x.name.toLowerCase().includes(this.searchData.toLowerCase())
    //   })
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
    this.getInvestors()
  },

  methods: {
    onPageChange() {
      this.getInvestors();
    },
    getInvestors() {
      try {
        console.log(this.$v)
        axios.get('https://web.marsworkers.com/admin/investors', {
          params:{
            'page': this.pagination.current,
            'filter': this.searchData 
          },
          headers: {
            Authorization: `Bearer ${localStorage.user_token}`
          }

        }).then((response) => {
          this.ourRespose = response.data
          this.investors = response.data.data
          this.pagination.current = this.ourRespose.current_page;
          this.pagination.total = this.ourRespose.last_page;
        
        })

      } catch (e) {

      }
    },

    editItem(item) {
      this.editedIndex = this.investors.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      this.editedIndex = this.investors.indexOf(item)
      // this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {

      const id = this.investors.splice(this.editedIndex, 1)
      console.log(id[0].id, "deleteddiddd")
      try {
        await axios.get(`https://web.marsworkers.com/investors/${id[0].id}/delete`, {
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
        Object.assign(this.investors[this.editedIndex], this.editedItem)
      } else {
        this.investors.push(this.editedItem)
      }
      this.close()
    },
  },
}
